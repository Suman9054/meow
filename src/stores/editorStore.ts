import { create } from 'zustand'
import { AgentComand } from '@/lib/type/agentresponstype'

export interface FileNode {
  id: string
  name: string
  type: 'file' | 'folder'
  children?: FileNode[]
}

interface EditorState {
  fileTree: FileNode[]
  fileContents: Record<string, string>
  activeFile: string | null
  openTabs: string[]
  expandedFolders: Set<string>

  setActiveFile: (fileId: string | null) => void
  toggleFolder: (folderId: string) => void
  closeTab: (fileId: string) => void
  getFileContent: (fileId: string) => string

  applyAgentCommands: (commands: AgentComand[]) => void
}

const ensurePath = (
  nodes: FileNode[],
  parts: string[],
  currentPath = '',
): void => {
  const [head, ...rest] = parts
  const fullPath = currentPath ? `${currentPath}/${head}` : head

  let node = nodes.find((n) => n.id === fullPath)

  if (!node) {
    node = {
      id: fullPath,
      name: head,
      type: rest.length === 0 ? 'file' : 'folder',
      children: rest.length ? [] : undefined,
    }
    nodes.push(node)
  }

  if (rest.length && node.children) {
    ensurePath(node.children, rest, fullPath)
  }
}

// Storage key for persistence

// Load persisted state from localStorage
const loadPersistedState = (): Partial<EditorState> | null => {
  try {
  } catch (error) {
    console.error('Failed to load persisted editor state:', error)
  }
  return null
}

// Save state to localStorage
const persistState = (_state: EditorState) => {
  try {
    console.log('Persisting editor state...')
  } catch (error) {
    console.error('Failed to persist editor state:', error)
  }
}

export const useEditorStore = create<EditorState>((set, get) => {
  const persisted = loadPersistedState()

  return {
    fileTree: persisted?.fileTree ?? [],
    fileContents: persisted?.fileContents ?? {},
    activeFile: persisted?.activeFile ?? null,
    openTabs: persisted?.openTabs ?? [],
    expandedFolders: persisted?.expandedFolders ?? new Set(),

    setActiveFile: (fileId) =>
      set((state) => {
        const newState = {
          activeFile: fileId,
          openTabs:
            fileId && !state.openTabs.includes(fileId)
              ? [...state.openTabs, fileId]
              : state.openTabs,
        }
        persistState({ ...state, ...newState })
        return newState
      }),

    toggleFolder: (folderId) =>
      set((state) => {
        const next = new Set(state.expandedFolders)
        next.has(folderId) ? next.delete(folderId) : next.add(folderId)
        const newState = { expandedFolders: next }
        persistState({ ...state, ...newState })
        return newState
      }),

    closeTab: (fileId) =>
      set((state) => {
        const tabs = state.openTabs.filter((id) => id !== fileId)
        const newState = {
          openTabs: tabs,
          activeFile:
            state.activeFile === fileId
              ? (tabs[tabs.length - 1] ?? null)
              : state.activeFile,
        }
        persistState({ ...state, ...newState })
        return newState
      }),

    getFileContent: (fileId) => get().fileContents[fileId] ?? '',

    applyAgentCommands: (_commands) =>
      set((_state) => {
        const nextTree = structuredClone(_state.fileTree)
        const nextContents = { ..._state.fileContents }
        const nextTabs = [..._state.openTabs]
        const nextExpanded = new Set(_state.expandedFolders)
        let nextActive = _state.activeFile
        const newState = {
          fileTree: nextTree,
          fileContents: nextContents,
          activeFile: nextActive,
          openTabs: nextTabs,
          expandedFolders: nextExpanded,
        }

        // Persist the new state
        persistState({ ..._state, ...newState })
        return newState
      }),
  }
})
