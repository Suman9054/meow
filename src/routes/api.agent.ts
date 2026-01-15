import { createFileRoute } from '@tanstack/react-router'
import { createOpenaiChat, openaiText, type OpenAITextConfig } from '@tanstack/ai-openai';
import { chat, toServerSentEventsResponse } from '@tanstack/ai'
import { geminiText } from '@tanstack/ai-gemini'
import { systemprompt } from '@/lib/prompt'

export const Route = createFileRoute('/api/agent')({
  server: {
    handlers: {
      POST: async ({ request }) => {

        const { messages, conversationId } = await request.json();


        const config: Omit<OpenAITextConfig, 'apiKey'> = {
          baseURL: 'https://openrouter.ai/api/v1',


        }

        //   const adapter = createOpenaiChat('xiaomi/mimo-v2-flash:free', process.env.AIAPI!, 
        //    baseUrl: 'https://openrouter.ai/api/v1',
        //  });
        // const aadapter = openaiText({
        //  model: 'xiaomi/mimo-v2-flash:free',
        //  apiKey: process.env.AIAPI!,
        //   baseUrl: 'https://openrouter.ai/api/v1',
        // });
        const message = [...messages, { role: "system", content: systemprompt() }];
        const adapter = createOpenaiChat('xiaomi/mimo-v2-flash:free', process.env.OPENAI_API_KEY!, config)

        try {
          const stream = chat({
            adapter: adapter,
            messages: message,
            conversationId: conversationId,
            temperature: 0.2,


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
