import { createFileRoute } from '@tanstack/react-router'
import { createOpenaiChat, type OpenAITextConfig } from '@tanstack/ai-openai'
import { chat, toServerSentEventsResponse } from '@tanstack/ai'
import { z } from 'zod'

import { systemprompt } from '@/lib/prompt'

// Validation schema for API request
const AgentRequestSchema = z.object({
  messages: z.array(
    z.object({
      role: z.enum(['user', 'assistant', 'system']),
      content: z.string().max(10000),
    }),
  ),
  conversationId: z.string().optional(),
})

export const Route = createFileRoute('/api/agent')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          // Validate environment variables
          const apiKey = process.env.OPENAI_API_KEY
          if (!apiKey) {
            console.error('Missing OPENAI_API_KEY environment variable')
            return new Response(
              JSON.stringify({
                error: 'Server configuration error: missing API key',
              }),
              {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
              },
            )
          }

          // Parse and validate request body
          let body
          try {
            body = await request.json()
          } catch (parseError) {
            console.error('Failed to parse request body:', parseError)
            return new Response(
              JSON.stringify({
                error: 'Invalid request: malformed JSON',
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              },
            )
          }

          // Validate request schema
          const validatedData = AgentRequestSchema.parse(body)
          const { messages, conversationId } = validatedData

          console.log('API Agent messages:', messages.length, 'messages')

          const config: Omit<OpenAITextConfig, 'apiKey'> = {
            baseURL: 'https://openrouter.ai/api/v1',
          }

          const messagesWithSystem = [
            ...messages,
            { role: 'system', content: systemprompt() },
          ]

          const adapter = createOpenaiChat(
            process.env.OPENAI_MODEL || 'tngtech/deepseek-r1t2-chimera:free',
            apiKey,
            config,
          )

          const stream = chat({
            adapter: adapter,
            messages: messagesWithSystem as any,
            conversationId: conversationId,
            temperature: 0.2,
          })

          return toServerSentEventsResponse(stream)
        } catch (error) {
          if (error instanceof z.ZodError) {
            const firstError = error.issues[0]
            console.error('Validation error:', error.issues)
            return new Response(
              JSON.stringify({
                error: `Invalid request: ${firstError.path.join('.')} - ${firstError.message}`,
              }),
              {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
              },
            )
          }

          console.error('Unexpected error in agent endpoint:', error)
          return new Response(
            JSON.stringify({
              error:
                error instanceof Error
                  ? error.message
                  : 'An unexpected error occurred',
            }),
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
