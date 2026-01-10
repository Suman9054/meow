import React from 'react'
import { X } from 'lucide-react'
import { useEditorStore } from '@/stores/editorStore'
import { cn } from '@/lib/utils'

export const EditorTabs: React.FC = () => {
  const { openTabs, activeFile, setActiveFile, closeTab } = useEditorStore()

  const getFileName = (fileId: string): string => {
    const parts = fileId.split('/')
    return parts[parts.length - 1]
  }

  if (openTabs.length === 0) return null

  return (
    <div className="flex bg-panel-header border-b border-panel-border overflow-x-auto scrollbar-thin">
      {openTabs.map((fileId) => (
        <div
          key={fileId}
          className={cn(
            'group flex items-center gap-2 px-3 py-2 text-sm border-r border-panel-border cursor-pointer transition-colors min-w-0',
            activeFile === fileId
              ? 'bg-editor text-foreground'
              : 'bg-panel-header text-muted-foreground hover:text-foreground hover:bg-panel',
          )}
          onClick={() => setActiveFile(fileId)}
        >
          <span className="truncate max-w-32">{getFileName(fileId)}</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              closeTab(fileId)
            }}
            className={cn(
              'p-0.5 rounded hover:bg-muted transition-colors',
              activeFile === fileId ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
            )}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
