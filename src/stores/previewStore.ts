import { create } from 'zustand'

interface PreviewState {
  previewKey: number
  isLoading: boolean
  previewUrl: string
  refreshPreview: () => void
  setLoading: (loading: boolean) => void
}

export const usePreviewStore = create<PreviewState>((set) => ({
  previewKey: 0,
  isLoading: false,
  previewUrl: '/preview',

  refreshPreview: () => {
    set((state) => ({
      previewKey: state.previewKey + 1,
      isLoading: true,
    }))
    setTimeout(() => {
      set({ isLoading: false })
    }, 800)
  },

  setLoading: (loading) => {
    set({ isLoading: loading })
  },
}))
