
import { createFileRoute } from '@tanstack/react-router'
import { createOpenaiChat, type OpenAITextConfig } from '@tanstack/ai-openai'
import { createOllamaChat } from '@tanstack/ai-ollama'
import { chat, toServerSentEventsResponse } from '@tanstack/ai'
import { z } from 'zod'

import { systemprompt } from '@/lib/prompt'
import { commandExecutorTool, makePathTool, writeFileTool } from '@/lib/tools/tools'





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



          const { messages, conversationId } = body

          console.log('API Agent messages:', messages.length, 'messages')

          const config: Omit<OpenAITextConfig, 'apiKey'> = {
            baseURL: 'https://router.huggingface.co/v1',
          }



          const adapter = createOpenaiChat(
            process.env.OPENAI_MODEL || 'Qwen/Qwen3-Coder-Next:novita',
            apiKey,
            config,
          )

          const ollamad = createOllamaChat('qwen3-vl')

          const stream = chat({
            adapter: ollamad,
            messages: messages,
            systemPrompts: [systemprompt()],
            conversationId,
            temperature: 0.2,
            tools: [commandExecutorTool, writeFileTool, makePathTool],
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


          return new Response(
            JSON.stringify({ error: error }),
            {
              status: 500,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }
      },
    },
  },
})

