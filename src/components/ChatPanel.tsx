import React, { useState, useRef, useEffect } from 'react'
import { Send, Sparkles, Trash2, MoreVertical } from 'lucide-react'
import { useChatStore, ChatMessage } from '@/stores/chatStore'
import { cn } from '@/lib/utils'

const ChatBubble: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn(
        'flex gap-3 animate-slide-in-up',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-medium',
          isUser
            ? 'bg-chat-user text-primary-foreground'
            : 'bg-gradient-to-br from-primary to-accent text-primary-foreground',
        )}
      >
        {isUser ? 'U' : <Sparkles size={16} />}
      </div>
      <div
        className={cn(
          'max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-chat-user text-primary-foreground rounded-br-md'
            : 'bg-chat-assistant text-foreground rounded-bl-md',
        )}
      >
        {message.content}
      </div>
    </div>
  )
}

const TypingIndicator: React.FC = () => (
  <div className="flex gap-3">
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
      <Sparkles size={16} className="text-primary-foreground" />
    </div>
    <div className="bg-chat-assistant px-4 py-3 rounded-2xl rounded-bl-md">
      <div className="flex gap-1">
        <span
          className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
          style={{ animationDelay: '0ms' }}
        />
        <span
          className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
          style={{ animationDelay: '150ms' }}
        />
        <span
          className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
          style={{ animationDelay: '300ms' }}
        />
      </div>
    </div>
  </div>
)

export const ChatPanel: React.FC = () => {
  const { messages, isTyping, sendMessage, clearMessages } = useChatStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim() && !isTyping) {
      sendMessage(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="h-full flex flex-col bg-panel">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-panel-header border-b border-panel-border">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-primary" />
          <span className="font-medium text-sm">AI Assistant</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={clearMessages}
            className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            title="Clear chat"
          >
            <Trash2 size={16} />
          </button>
          <button className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4 space-y-4">
        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
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
            disabled={isTyping}
            rows={1}
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
            disabled={!input.trim() || isTyping}
            className={cn(
              'absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all',
              input.trim() && !isTyping
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-muted text-muted-foreground cursor-not-allowed',
            )}
          >
            <Send size={18} />
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          AI responses are mocked for demo purposes
        </p>
      </div>
    </div>
  )
}
