import { createFileRoute } from '@tanstack/react-router'
import { createOpenaiChat, type OpenAITextConfig } from '@tanstack/ai-openai'
import { chat, toServerSentEventsResponse } from '@tanstack/ai'
import { z } from 'zod'
import { systemprompt } from '@/lib/prompt'

// -----------------------------
// Route
// -----------------------------
export const Route = createFileRoute('/api/agent')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const apiKey = process.env.OPENAI_API_KEY
          if (!apiKey) {
            console.error('Missing OPENAI_API_KEY environment variable')
            return new Response(
              JSON.stringify({ error: 'some thing went wrong' }),
              {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
              },
            )
          }

          let body
          try {
            body = await request.json()
          } catch (parseError) {
            console.error('Failed to parse request body:', parseError)
            return new Response(
              JSON.stringify({ error: 'some thing went wrong' }),
              {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
              },
            )
          }

          const { messages, conversationId } = body as {
            messages: Array<any>
            conversationId: string
          }

          console.log('API Agent messages:', messages.length, 'messages')

          const config: Omit<OpenAITextConfig, 'apiKey'> = {
            baseURL: 'https://router.huggingface.co/v1',
          }

          const modelName =
            process.env.OPENAI_MODEL || 'Qwen/Qwen3-Coder-Next:novita'

          const adapter = createOpenaiChat(modelName as any, apiKey, config)

          const stream = chat({
            adapter: adapter,
            messages: messages,
            systemPrompts: [systemprompt().trim()],
            conversationId,
            temperature: 0.2,
          })

          return toServerSentEventsResponse(stream)
        } catch (error) {
          if (error instanceof z.ZodError) {
            console.error('Validation error:', error.issues)

            return new Response(
              JSON.stringify({ error: 'some thing went wrong' }),
              {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
              },
            )
          }

          // ❗ Unexpected runtime errors
          console.error('Unexpected error in agent endpoint:', error)

          return new Response(JSON.stringify({ error: error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      },
    },
  },
})
