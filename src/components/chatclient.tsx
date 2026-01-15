import { useChat, fetchServerSentEvents } from '@tanstack/ai-react'
import AgentResponseParser from '@/lib/agentresponsparse'
import { useEffect, useRef } from 'react'


export const ChatClient = () => {
  const { messages, sendMessage, isLoading } = useChat({
    connection: fetchServerSentEvents('/api/agent'),
  })

  // Use a Ref to persist the same parser instance across renders
  const parserRef = useRef(new AgentResponseParser())
  const hasSentInitialMessage = useRef(false)

  useEffect(() => {
    if (!hasSentInitialMessage.current) {
      // PROMPT HINT: Tell the AI how to use your parser
      sendMessage('Create a hello world app ')
      hasSentInitialMessage.current = true
    }
  }, [sendMessage])

  useEffect(() => {
    if (isLoading || messages.length === 0) return

    const lastMessage = messages[messages.length - 1]

    if (lastMessage.role === 'assistant') {
      const fullText = lastMessage.parts
        .filter(p => p.type === 'text')
        .map(p => p.content)
        .join('')
      const lastPart = lastMessage.parts[lastMessage.parts.length - 1]

      console.log("Raw Assistant Text:", fullText) // Check if tags exist here!
      console.log("Last Part:", lastPart) // Inspect the last part for any anomalies
      if (lastPart?.type === 'text') {
        // Use the persisted parser
        const commands = parserRef.current.parse(lastPart.content)

        console.log("BUFFER:", parserRef.current["buffer"]);

        if (commands.length > 0) {
          console.log('Parsed Commands:', commands)
        }
      }
    }
  }, [messages, isLoading])

  return null
}
