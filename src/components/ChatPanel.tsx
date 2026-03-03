import React, { useState, useRef, useEffect } from 'react'
import {
  Send,
  Sparkles,
  Trash2,
  MoreVertical,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { useChatStore, useSendChatStore } from '@/stores/chatStore'
import { cn } from '@/lib/utils'
import { fetchServerSentEvents, useChat } from '@tanstack/ai-react'
import { clientTools } from '@tanstack/ai-client'
import {
  commandExecutorTool,
  makePathTool,
  writeFileTool,
} from '@/lib/tools/tools'




export const ChatPanel: React.FC = () => {
  const { messages, clearMessages } = useChatStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { setIsSend, error, setError } = useSendChatStore()
  const clienttools = clientTools(
    commandExecutorTool,
    makePathTool,
    writeFileTool,
  )
  const aiclient = useChat({
    connection: fetchServerSentEvents('/api/agent'),
    tools: clienttools,

  })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Auto-clear error after 5 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error, setError])
  const submite = () => {
    if (input.trim() && !aiclient.isLoading) {

      setIsSend(false)
      aiclient.sendMessage(input.trim())
      setInput('')
    }
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submite()
    // 30 second timeou
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !aiclient.isLoading) {
      e.preventDefault()
      submite()
    }
  }

  return (
    <div className="h-full flex flex-col bg-panel">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-panel-header border-b border-panel-border">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-primary" />
          <span className="font-medium text-sm">AI Assistant</span>
          {aiclient.isLoading && (
            <Loader2 size={16} className="animate-spin text-primary ml-1" />
          )}
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => {
              clearMessages()
              setError(null)
            }}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Clear chat"
            disabled={aiclient.isLoading}
          >
            <Trash2 size={16} />
          </button>
          <button
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            disabled={aiclient.isLoading}
          >
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {/* Error message */}
        {error && (
          <div className="flex gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
              <AlertCircle size={16} className="text-red-400" />
            </div>
            <div className="flex-1 px-4 py-3 rounded-2xl rounded-bl-md bg-red-500/10 text-red-300 text-sm border border-red-500/30">
              {error}
            </div>
          </div>
        )}

        {aiclient.messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${message.role === "assistant" ? "text-blue-600" : "text-gray-800"
              }`}
          >
            <div className="font-semibold mb-1">
              {message.role === "assistant" ? "Assistant" : "You"}
            </div>
            <div>
              {message.parts.map((part, idx) => {
                if (part.type === "thinking") {
                  return (
                    <div
                      key={idx}
                      className="text-sm text-gray-500 italic mb-2"
                    >
                      💭 Thinking: {part.content}
                    </div>
                  );
                }
                if (part.type === "text") {
                  return <div key={idx}>{part.content}</div>;
                }
                return null;
              })}
            </div>
          </div>
        ))}
        {aiclient.isLoading && <div className="text-sm text-gray-500 italic mb-2">
          💭 AI is thinking...
        </div>
        }
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-panel-border">
        <form onSubmit={handleSubmit} className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything..."
            rows={1}
            disabled={aiclient.isLoading}
            className={cn(
              'w-full px-4 py-3 pr-12 bg-muted rounded-xl resize-none text-sm',
              'placeholder:text-muted-foreground',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'scrollbar-thin',
            )}
            style={{ minHeight: '48px', maxHeight: '120px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || aiclient.isLoading}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all',
              input.trim() && !aiclient.isLoading
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed',
            )}
          >
            {aiclient.isLoading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <Send size={18} />
            )}
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          {aiclient.isLoading
            ? 'AI is thinking...'
            : 'Press Enter to send, Shift+Enter for new line'}
        </p>
      </div>
    </div>
  )
}


