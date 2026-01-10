import { create } from 'zustand'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface ChatState {
  messages: ChatMessage[]
  isTyping: boolean
  sendMessage: (content: string) => void
  clearMessages: () => void
}

const mockResponses = [
  "I've analyzed your code and made some improvements to the component structure. The changes have been applied to your project.",
  "Great question! I've updated the styling to use a more modern approach with CSS Grid. Check the preview to see the changes.",
  "I've refactored the Button component to support additional variants. You can now use 'primary', 'secondary', or 'outline' styles.",
  "The counter functionality has been enhanced with animations. I've also added keyboard accessibility for better UX.",
  "I've created a new utility hook for managing state persistence. This will help keep your data synced across sessions.",
  "The responsive design has been improved. Your app now works seamlessly on mobile, tablet, and desktop devices.",
  "I've optimized the bundle size by implementing code splitting. The initial load time should be significantly faster now.",
]

const generateId = () => Math.random().toString(36).substring(2, 11)

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: generateId(),
      role: 'assistant',
      content:
        "👋 Welcome! I'm your AI coding assistant. I can help you build, modify, and improve your application. What would you like to work on today?",
      timestamp: new Date(),
    },
  ],
  isTyping: false,

  sendMessage: (content) => {
    const userMessage: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    }

    set((state) => ({
      messages: [...state.messages, userMessage],
      isTyping: true,
    }))

    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]

      const assistantMessage: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date(),
      }

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isTyping: false,
      }))
    }, 1500 + Math.random() * 1000)
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
