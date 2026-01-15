import { create } from 'zustand'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatState {
  messages: ChatMessage[]
  sendMessage: (content: string) => void
  clearMessages: () => void
  setrespons: (content: string) => void
}



const generateId = () => crypto.randomUUID().toString().substring(2, 11)

export const useChatStore = create<ChatState>((set) => ({
  messages: [],


  sendMessage: (content) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    set((state) => ({
      messages: [...state.messages, userMessage],

    }))
  },

  setrespons: (content: string) => {
    const agentrespons: ChatMessage = {
      id: generateId(),
      role: "assistant",
      content,
      timestamp: new Date
    }
    set((state: ChatState) => ({
      messages: [...state.messages, agentrespons]
    }))
  },

  clearMessages: () => {
    set({
      messages: [
        {
          id: generateId(),
          role: 'assistant',
          content: 'Chat cleared. How can I help you? ',
          timestamp: new Date(),
        },
      ],
    })
  },
}))
