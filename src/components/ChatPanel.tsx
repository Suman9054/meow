import React, { useState, useRef, useEffect } from 'react'
import {
  Send,
  Sparkles,
  Trash2,
  MoreVertical,
  Loader2,
  AlertCircle,
  ChevronDown,
  Terminal,
  Wrench,
  CheckCircle2,
  Clock,
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
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"
import { ScrollArea, ScrollBar } from './ui/scroll-area'
import { useMutation } from '@tanstack/react-query'

import { useConvexMutation } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import { Id } from 'convex/_generated/dataModel'

/* ─── Typing indicator dots ──────────────────────────────────────────────── */
const TypingDots = () => (
  <div className="flex items-center gap-1 px-4 py-3">
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-[#89b4fa] animate-bounce"
        style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.9s' }}
      />
    ))}
  </div>
)

/* ─── AI avatar ──────────────────────────────────────────────────────────── */
const AIAvatar = () => (
  <div className="relative flex-shrink-0 w-7 h-7 mt-0.5">
    <div className="w-full h-full rounded-lg bg-gradient-to-br from-[#89b4fa] to-[#cba6f7] flex items-center justify-center shadow-lg shadow-[#89b4fa]/20">
      <Sparkles size={13} className="text-[#1e1e2e]" />
    </div>
    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#a6e3a1] border-2 border-[#1e1e2e]" />
  </div>
)

/* ─── Tool call card ─────────────────────────────────────────────────────── */
const ToolCallCard = ({ part }: { part: any }) => {
  const [open, setOpen] = useState(false)
  const isDone = part.state === 'done' || part.output !== undefined

  return (
    <div className="mt-2 rounded-xl border border-[#45475a] bg-[#181825] overflow-hidden text-xs font-mono">
      {/* Header row */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-[#1e1e2e]/60 transition-colors text-left"
      >
        <span className={cn(
          "flex-shrink-0 w-4 h-4 rounded-full flex items-center justify-center",
          isDone ? "bg-[#a6e3a1]/20" : "bg-[#f9e2af]/20"
        )}>
          {isDone
            ? <CheckCircle2 size={11} className="text-[#a6e3a1]" />
            : <Clock size={11} className="text-[#f9e2af] animate-pulse" />
          }
        </span>
        <Wrench size={11} className="text-[#cba6f7] flex-shrink-0" />
        <span className="text-[#cba6f7] font-semibold flex-1 truncate">{part.name}</span>
        <span className={cn(
          "px-1.5 py-0.5 rounded text-[10px] font-medium",
          isDone ? "bg-[#a6e3a1]/10 text-[#a6e3a1]" : "bg-[#f9e2af]/10 text-[#f9e2af]"
        )}>
          {isDone ? "done" : part.state}
        </span>
        <ChevronDown
          size={12}
          className={cn("text-[#6c7086] transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      {/* Expanded content */}
      {open && (
        <div className="border-t border-[#313244] divide-y divide-[#313244]">
          {/* Args */}
          <div className="px-3 py-2 space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-[#6c7086] mb-1.5">Arguments</p>
            <pre className="text-[#cdd6f4] overflow-x-auto text-[11px] leading-relaxed">
              {JSON.stringify(part.arguments, null, 2)}
            </pre>
          </div>
          {/* Output */}
          {part.output !== undefined && (
            <div className="px-3 py-2 space-y-1">
              <p className="text-[10px] uppercase tracking-widest text-[#6c7086] mb-1.5">Output</p>
              <pre className="text-[#a6e3a1] overflow-x-auto text-[11px] leading-relaxed">
                {JSON.stringify(part.output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

/* ─── Thinking block ─────────────────────────────────────────────────────── */
const ThinkingBlock = ({ content }: { content: string }) => {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-2">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[11px] text-[#6c7086] hover:text-[#a6adc8] transition-colors"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cba6f7] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#cba6f7]/50" />
        </span>
        <span>Thinking{open ? "" : "…"}</span>
        <ChevronDown size={10} className={cn("transition-transform duration-150", open && "rotate-180")} />
      </button>
      {open && (
        <div className="mt-1.5 pl-3 border-l-2 border-[#cba6f7]/30 text-[11px] text-[#6c7086] italic leading-relaxed">
          {content}
        </div>
      )}
    </div>
  )
}

/* ─── AI message bubble ──────────────────────────────────────────────────── */
const AIMessage = ({ message }: { message: any }) => (
  <div className="flex items-start gap-2.5 group">
    <AIAvatar />

    <div className="flex-1 min-w-0 space-y-0.5">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[11px] font-semibold text-[#89b4fa] tracking-wide">Assistant</span>
        <span className="text-[10px] text-[#45475a]">just now</span>
      </div>

      <div className="rounded-2xl rounded-tl-sm bg-[#24273a] border border-[#313244] px-4 py-3 shadow-lg shadow-black/20">
        {message.parts.map((part: any, idx: number) => {
          if (part.type === "thinking") {
            return <ThinkingBlock key={idx} content={part.content} />
          }

          if (part.type === "text") {
            return (
              <div
                key={idx}
                className={cn(
                  "prose prose-invert max-w-none text-sm leading-relaxed",
                  // Typography
                  "[&_p]:text-[#cdd6f4] [&_p]:my-1.5",
                  "[&_h1]:text-[#89b4fa] [&_h1]:text-lg [&_h1]:font-bold [&_h1]:mt-3 [&_h1]:mb-1.5",
                  "[&_h2]:text-[#89b4fa] [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-3 [&_h2]:mb-1",
                  "[&_h3]:text-[#cba6f7] [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-2 [&_h3]:mb-0.5",
                  // Lists
                  "[&_ul]:my-1.5 [&_ul]:pl-4 [&_ul>li]:text-[#cdd6f4] [&_ul>li]:my-0.5",
                  "[&_ol]:my-1.5 [&_ol]:pl-4 [&_ol>li]:text-[#cdd6f4] [&_ol>li]:my-0.5",
                  "[&_li::marker]:text-[#89b4fa]",
                  // Inline code
                  "[&_code]:bg-[#181825] [&_code]:text-[#f38ba8] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[12px] [&_code]:font-mono [&_code]:border [&_code]:border-[#313244]",
                  // Code blocks
                  "[&_pre]:bg-[#181825] [&_pre]:border [&_pre]:border-[#313244] [&_pre]:rounded-xl [&_pre]:p-3 [&_pre]:my-2 [&_pre]:overflow-x-auto",
                  "[&_pre_code]:bg-transparent [&_pre_code]:border-0 [&_pre_code]:p-0 [&_pre_code]:text-[#cdd6f4] [&_pre_code]:text-[12px]",
                  // Blockquote
                  "[&_blockquote]:border-l-2 [&_blockquote]:border-[#89b4fa] [&_blockquote]:pl-3 [&_blockquote]:my-2 [&_blockquote]:text-[#a6adc8] [&_blockquote]:italic",
                  // Table
                  "[&_table]:w-full [&_table]:text-sm [&_table]:my-2 [&_table]:border-collapse",
                  "[&_th]:bg-[#181825] [&_th]:text-[#89b4fa] [&_th]:px-3 [&_th]:py-1.5 [&_th]:text-left [&_th]:border [&_th]:border-[#313244]",
                  "[&_td]:px-3 [&_td]:py-1.5 [&_td]:border [&_td]:border-[#313244] [&_td]:text-[#cdd6f4]",
                  "[&_tr:nth-child(even)_td]:bg-[#1e1e2e]",
                  // Links
                  "[&_a]:text-[#89b4fa] [&_a]:underline [&_a:hover]:text-[#b4d0f7]",
                  // Strong / em
                  "[&_strong]:text-[#f5c2e7] [&_strong]:font-semibold",
                  "[&_em]:text-[#a6adc8]",
                  // HR
                  "[&_hr]:border-[#313244] [&_hr]:my-3",
                )}
              >
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {part.content}
                </ReactMarkdown>
              </div>
            )
          }

          if (part.type === "tool-call") {
            return <ToolCallCard key={idx} part={part} />
          }

          return null
        })}
      </div>
    </div>
  </div>
)

/* ─── User message bubble ────────────────────────────────────────────────── */
const UserMessage = ({ message }: { message: any }) => (
  <div className="flex justify-end items-end gap-2.5">
    <div className="max-w-[78%]">
      <div className="flex justify-end mb-1">
        <span className="text-[10px] text-[#45475a]">You</span>
      </div>
      <div className="bg-gradient-to-br from-[#89b4fa] to-[#74c7ec] text-[#1e1e2e] px-4 py-2.5 rounded-2xl rounded-br-sm text-sm font-medium shadow-lg shadow-[#89b4fa]/10 leading-relaxed">
        {message.parts.map((part: any, idx: number) =>
          part.type === "text" ? <span key={idx}>{part.content}</span> : null
        )}
      </div>
    </div>
    {/* User avatar */}
    <div className="flex-shrink-0 w-7 h-7 rounded-lg bg-gradient-to-br from-[#74c7ec] to-[#89b4fa] flex items-center justify-center text-[#1e1e2e] text-[11px] font-bold shadow-md mb-0.5">
      U
    </div>
  </div>
)

/* ─── Empty state ────────────────────────────────────────────────────────── */
const EmptyState = () => (
  <div className="flex flex-col items-center justify-center h-full gap-4 select-none">
    <div className="relative">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#89b4fa] to-[#cba6f7] flex items-center justify-center shadow-xl shadow-[#89b4fa]/20">
        <Sparkles size={26} className="text-[#1e1e2e]" />
      </div>
      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#a6e3a1] border-2 border-[#1e1e2e] flex items-center justify-center">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1e1e2e]" />
      </span>
    </div>
    <div className="text-center space-y-1">
      <p className="text-[#cdd6f4] font-semibold text-base">AI Assistant</p>
      <p className="text-[#6c7086] text-xs max-w-[200px] leading-relaxed">
        Ask me anything — I can write code, run commands, and create files.
      </p>
    </div>
    <div className="flex flex-wrap gap-2 justify-center mt-1">
      {["Write a script", "Explain code", "Create a file"].map((s) => (
        <span key={s} className="px-2.5 py-1 rounded-lg bg-[#313244] text-[#a6adc8] text-[11px] border border-[#45475a]">
          {s}
        </span>
      ))}
    </div>
  </div>
)

/* ─── Main component ─────────────────────────────────────────────────────── */
export const ChatPanel: React.FC = () => {
  const { messages, clearMessages } = useChatStore()
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const { setIsSend, error, setError } = useSendChatStore()
  const filemute = useMutation({
    mutationFn: useConvexMutation(api.workspace.savemessages)
  })


  const clienttools = clientTools(commandExecutorTool, makePathTool, writeFileTool)
  const aiclient = useChat({
    connection: fetchServerSentEvents('/api/agent'),
    tools: clienttools,

    onFinish(message) {
      filemute.mutate({
        workspaceid: 'jd760ygcxnzs2h2vapetkhp0fx828xvd' as Id<"workspaces">,
        messages: message
      })
    },
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [aiclient.messages])

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [error, setError])

  const submit = () => {
    if (input.trim() && !aiclient.isLoading) {
      setIsSend(false)
      aiclient.sendMessage(input.trim())
      setInput('')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !aiclient.isLoading) {
      e.preventDefault()
      submit()
    }
  }

  const isEmpty = aiclient.messages.length === 0

  return (

    <div className="h-full flex flex-col bg-[#1e1e2e] text-[#cdd6f4]">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#181825] border-b border-[#313244] flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#89b4fa] to-[#cba6f7] flex items-center justify-center">
            <Sparkles size={13} className="text-[#1e1e2e]" />
          </div>
          <span className="font-semibold text-sm text-[#cdd6f4]">AI Assistant</span>
          {aiclient.isLoading && (
            <span className="flex items-center gap-1 text-[11px] text-[#89b4fa]">
              <Loader2 size={11} className="animate-spin" />
              thinking
            </span>
          )}
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => { clearMessages(); setError(null) }}
            disabled={aiclient.isLoading}
            title="Clear chat"
            className="p-1.5 rounded-md text-[#6c7086] hover:text-[#f38ba8] hover:bg-[#313244] transition-colors disabled:opacity-40"
          >
            <Trash2 size={14} />
          </button>
          <button className="p-1.5 rounded-md text-[#6c7086] hover:text-[#cdd6f4] hover:bg-[#313244] transition-colors">
            <MoreVertical size={14} />
          </button>
        </div>
      </div>

      {/* ── Messages — ScrollArea ONLY wraps this section ── */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="px-4 py-5 space-y-5">

          {isEmpty && <EmptyState />}

          {error && (
            <div className="flex gap-2.5 items-start">
              <div className="w-7 h-7 rounded-lg bg-[#f38ba8]/15 flex items-center justify-center flex-shrink-0">
                <AlertCircle size={14} className="text-[#f38ba8]" />
              </div>
              <div className="flex-1 px-4 py-2.5 rounded-2xl rounded-tl-sm bg-[#f38ba8]/10 border border-[#f38ba8]/25 text-sm text-[#f38ba8]">
                {error}
              </div>
            </div>
          )}

          {aiclient.messages.map((message) =>
            message.role === "assistant"
              ? <AIMessage key={message.id} message={message} />
              : <UserMessage key={message.id} message={message} />
          )}

          {aiclient.isLoading && (
            <div className="flex items-start gap-2.5">
              <AIAvatar />
              <div className="rounded-2xl rounded-tl-sm bg-[#24273a] border border-[#313244] shadow-lg shadow-black/20">
                <TypingDots />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Styled scrollbar */}
        <ScrollBar
          orientation="vertical"
          className="w-1.5 rounded-full bg-transparent [&>div]:bg-[#45475a] [&>div]:hover:bg-[#6c7086] [&>div]:rounded-full [&>div]:transition-colors"
        />
      </ScrollArea>

      {/* ── Input ── */}
      <div className="px-4 pb-4 pt-2 border-t border-[#313244] flex-shrink-0">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask me anything…"
            rows={1}
            disabled={aiclient.isLoading}
            className={cn(
              "w-full px-4 py-3 pr-12 bg-[#24273a] border border-[#313244] rounded-2xl resize-none text-sm",
              "placeholder:text-[#45475a]",
              "focus:outline-none focus:border-[#89b4fa]/60 focus:ring-2 focus:ring-[#89b4fa]/15",
              "disabled:opacity-50 transition-all leading-relaxed"
            )}
            style={{ minHeight: "48px", maxHeight: "120px" }}
          />

          <button
            onClick={handleSubmit}
            disabled={!input.trim() || aiclient.isLoading}
            className={cn(
              "absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center transition-all",
              input.trim() && !aiclient.isLoading
                ? "bg-gradient-to-br from-[#89b4fa] to-[#74c7ec] text-[#1e1e2e] shadow-lg shadow-[#89b4fa]/20 hover:scale-105 active:scale-95"
                : "bg-[#313244] text-[#45475a] cursor-not-allowed"
            )}
          >
            {aiclient.isLoading
              ? <Loader2 size={15} className="animate-spin" />
              : <Send size={15} />
            }
          </button>
        </div>

        <p className="text-[10px] text-[#45475a] mt-2 text-center tracking-wide">
          {aiclient.isLoading ? "✦ Generating response…" : "↵ Send  ⇧↵ New line"}
        </p>
      </div>
    </div>
  )
}
