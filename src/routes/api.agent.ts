import { createFileRoute } from '@tanstack/react-router'
import { createOllamaChat } from '@tanstack/ai-ollama'
import { chat, toServerSentEventsResponse } from '@tanstack/ai'
import { systemprompt } from '@/lib/prompt'

export const Route = createFileRoute('/api/agent')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const { message, convertationid } = await request.json()
          const adaapter = createOllamaChat("qwen3-vl:2b", "http://localhost:11434")
          const stream = chat({
            adapter: adaapter,
            systemPrompts: [systemprompt()],
            messages: message,
            conversationId: convertationid,


          })
          //console.timeLog("agent request", body)
          return toServerSentEventsResponse(stream)
        } catch (error) {
          console.error(error)
          return new Response(JSON.stringify({
            error: error instanceof Error ? error.message : "an error acord"
          }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
  }
})
