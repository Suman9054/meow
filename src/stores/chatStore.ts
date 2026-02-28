'use client'
import { create } from 'zustand'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content?: string
  timestamp: string // Store as string for JSON serialization
}

interface ChatState {
  messages: ChatMessage[]
  sendMessage: (content: string) => void
  clearMessages: () => void
  setrespons: (content: string) => void
}

interface MessageContent {
  id: string
  timestamp: Date
  text: string
}

interface SendChatStore {
  issend: boolean
  content: MessageContent
  error: string | null

  setIsSend: (is: boolean) => void
  setContent: (text: string) => void
  getCurrentMessage: () => string
  setError: (error: string | null) => void
}

const generateId = () => crypto.randomUUID().toString().substring(2, 11)

const CHAT_STORAGE_KEY = 'meow_chat_history'

// Load chat history from localStorage
// @ts-ignore - Function is kept for future use
const loadChatHistory = (): ChatMessage[] => {
  if (typeof window === 'undefined') return []

  try {
    const stored = localStorage.getItem(CHAT_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) || []
    }
  } catch (error) {
    console.error('Failed to load chat history:', error)
  }
  return []
}

// Save chat history to localStorage
const persistChatHistory = (messages: ChatMessage[]) => {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages))
  } catch (error) {
    console.error('Failed to persist chat history:', error)
  }
}

export const useChatStore = create<ChatState>((set) => {
  const initialMessages: ChatMessage[] = []

  return {
    messages: initialMessages,

    sendMessage: (content) => {
      const userMessage: ChatMessage = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: new Date(0).toISOString(),
      }

      set((state) => {
        const newMessages = [...state.messages, userMessage]
        persistChatHistory(newMessages)
        return { messages: newMessages }
      })
    },

    setrespons: (content: string) => {
      const agentrespons: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content,
        timestamp: new Date().toISOString(),
      }
      set((state: ChatState) => {
        const newMessages = [...state.messages, agentrespons]
        persistChatHistory(newMessages)
        return { messages: newMessages }
      })
    },

    clearMessages: () => {
      const clearedMessages: ChatMessage[] = [
        {
          id: generateId(),
          role: 'assistant',
          content: 'Chat cleared. How can I help you?',
          timestamp: new Date().toISOString(),
        },
      ]
      set({ messages: clearedMessages })
      persistChatHistory(clearedMessages)
    },
  }
})

export const useSendChatStore = create<SendChatStore>((set, get) => ({
  issend: true,
  error: null,

  content: {
    id: generateId(),
    timestamp: new Date(0),
    text: '',
  },

  setIsSend: (is: boolean) => set({ issend: is }),

  setContent: (text: string) =>
    set({
      content: {
        ...get().content,
        text,
        timestamp: new Date(0),
      },
    }),

  getCurrentMessage: () => get().content.text,

  setError: (error: string | null) => set({ error }),
}))
