'use client'
import { useChat, fetchServerSentEvents } from '@tanstack/ai-react'
import AgentResponseParser from '@/lib/agentresponsparse'
import { useEffect, useRef } from 'react'
import { useEditorStore } from '@/stores/editorStore'
import { useChatStore, useSendChatStore } from '@/stores/chatStore'
import { executeCommand, formatExecResult } from '@/lib/executecommand'

export const ChatClient = () => {
  // TanStack AI's useChat hook - handles streaming automatically
  const { messages, append, isLoading, error } = useChat({
    connection: fetchServerSentEvents('/api/agent'),
  })

  // Parser instance - persists across renders
  const parserRef = useRef(new AgentResponseParser())

  // Track last processed message to prevent duplicate processing during streaming
  const lastProcessedIdRef = useRef<string | null>(null)
  const processedCommandsRef = useRef<Set<string>>(new Set())

  const { issend, setIsSend, getCurrentMessage, setError } = useSendChatStore()
  const { setrespons } = useChatStore()

  console.log(
    '🤖 ChatClient Rendered, isLoading:',
    isLoading,
    'Messages:',
    messages.length,
  )

  // ========================================
  // HANDLE API ERRORS
  // ========================================
  useEffect(() => {
    if (error) {
      console.error('❌ Chat API error:', error)
      setError(
        error instanceof Error
          ? error.message
          : 'Failed to connect to AI service',
      )
      setIsSend(true) // Stop loading state
    }
  }, [error, setError, setIsSend])

  // ========================================
  // SEND USER MESSAGE
  // ========================================
  useEffect(() => {
    if (!issend) {
      const current = getCurrentMessage()
      console.log(
        '📤 Sending initial message to AI agent:',
        current.slice(0, 50) + '...',
      )
      if (current.trim()) {
        // TanStack AI's append sends message and starts streaming response
        append({
          role: 'user',
          content: current,
        })
        setIsSend(true) // Mark as sent
      }
    }
  }, [issend, append, getCurrentMessage, setIsSend])

  // ========================================
  // PROCESS STREAMING RESPONSES
  // ========================================
  useEffect(() => {
    if (messages.length === 0) return

    // Find the last assistant message (the one being streamed)
    let lastAssistantMessage = null
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'assistant') {
        lastAssistantMessage = messages[i]
        break
      }
    }

    if (!lastAssistantMessage) return

    // TanStack AI uses parts array for message content
    const parts = (lastAssistantMessage as any).parts || []
    if (parts.length === 0) return

    const lastPart = parts[parts.length - 1]
    if (lastPart?.type !== 'text') return

    const fullText = lastPart.content || ''
    const messageId = lastAssistantMessage.id

    // Skip if already fully processed
    if (lastProcessedIdRef.current === messageId && !isLoading) {
      return
    }

    console.log(
      `📨 [${isLoading ? 'STREAMING' : 'COMPLETE'}] Message length: ${fullText.length}`,
    )

    // ========================================
    // STREAMING PHASE: Parse commands as chunks arrive
    // ========================================
    if (isLoading) {
      // Parser's internal buffer handles streaming chunks
      // Extracts complete commands as they finish arriving
      const commands = parserRef.current.parse(fullText)

      if (commands.length > 0) {
        console.log(
          '🔨 [STREAMING] Parsed commands:',
          commands.map((c) => c.type),
        )

        // Hash to detect duplicate commands in stream
        const commandHash = JSON.stringify(commands)

        if (!processedCommandsRef.current.has(commandHash)) {
          console.log(
            '✅ [STREAMING] Applying commands to editor in real-time...',
          )

          // Count by type
          const stats = {
            makef: commands.filter((c) => c.type === 'makef').length,
            writf: commands.filter((c) => c.type === 'writf').length,
            exe: commands.filter((c) => c.type === 'exe').length,
          }
          console.log(
            `📊 Stats - makef: ${stats.makef}, writf: ${stats.writf}, exe: ${stats.exe}`,
          )

          // Apply ALL commands to editor store
          useEditorStore.getState().applyAgentCommands(commands)
          processedCommandsRef.current.add(commandHash)

          // Execute shell commands asynchronously
          commands
            .filter((c) => c.type === 'exe')
            .forEach((cmd) => {
              if (cmd.type === 'exe') {
                console.log('[EXEC] Executing command:', cmd.command)
                // Execute in background - don't block streaming
                executeCommand({ command: cmd.command })
                  .then((result) => {
                    const message = formatExecResult(result)
                    console.log('[EXEC] Result:', message)
                    // Store result for later display
                    const execResults =
                      JSON.parse(
                        localStorage.getItem('exec_results') || '[]',
                      ) || []
                    execResults.push({
                      command: cmd.command,
                      timestamp: new Date().toISOString(),
                      result: message,
                    })
                    localStorage.setItem(
                      'exec_results',
                      JSON.stringify(execResults),
                    )
                  })
                  .catch((error) => {
                    console.error('[EXEC] Execution error:', error)
                  })
              }
            })
        }
      }
    }

    // ========================================
    // FINALIZATION PHASE: Stream ended, display clean text
    // ========================================
    else if (!isLoading && lastProcessedIdRef.current !== messageId) {
      console.log('📬 [STREAM COMPLETE] Finalizing response text...')

      // Strip XML command tags - keep only human-readable text
      const cleanText = parserRef.current.stripCommandTags(fullText)

      if (cleanText.length > 0) {
        // Has explanatory text - display it
        console.log('💬 [DISPLAY] Response:', cleanText.slice(0, 80) + '...')
        setrespons(cleanText)
      } else {
        // Only commands, no text - show confirmation
        const totalCommands = parserRef.current.parse(fullText).length
        if (totalCommands > 0) {
          const confirmMsg = `✓ Applied ${totalCommands} command(s)`
          console.log('💬 [DISPLAY] Confirmation:', confirmMsg)
          setrespons(confirmMsg)
        }
      }

      // Mark message as processed
      lastProcessedIdRef.current = messageId
      processedCommandsRef.current.clear()
    }
  }, [messages, isLoading])

  // This component doesn't render anything - it's purely for side effects
  return null
}
