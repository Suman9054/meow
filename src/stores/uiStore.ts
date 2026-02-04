import { create } from 'zustand'

type ActivePanel = 'code' | 'preview' | 'split'

interface UIState {
  activePanel: ActivePanel
  isChatOpen: boolean
  isSidebarOpen: boolean
  chatPosition: 'right' | 'bottom'
  setActivePanel: (panel: ActivePanel) => void
  toggleChat: () => void
  toggleSidebar: () => void
  setChatPosition: (position: 'right' | 'bottom') => void
}

export const useUIStore = create<UIState>((set) => ({
  activePanel: 'split',
  isChatOpen: true,
  isSidebarOpen: true,
  chatPosition: 'right',

  setActivePanel: (panel) => set({ activePanel: panel }),

  toggleChat: () => set((state) => ({ isChatOpen: !state.isChatOpen })),

  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

  setChatPosition: (position) => set({ chatPosition: position }),
}))
