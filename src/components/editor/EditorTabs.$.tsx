'use client'
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
    <div className="flex bg-[#181825] border-b border-[#313244] overflow-x-auto scrollbar-thin">

      {openTabs.map((fileId) => (

        <div
          key={fileId}
          onClick={() => setActiveFile(fileId)}
          className={cn(
            "group flex items-center gap-2 px-3 py-2 text-sm border-r border-[#313244] cursor-pointer transition min-w-0",
            activeFile === fileId
              ? "bg-[#1e1e2e] text-[#cdd6f4]"
              : "bg-[#181825] text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[#313244]"
          )}
        >

          <span className="truncate max-w-32">
            {getFileName(fileId)}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation()
              closeTab(fileId)
            }}
            className={cn(
              "p-0.5 rounded transition hover:bg-[#45475a]",
              activeFile === fileId
                ? "opacity-100"
                : "opacity-0 group-hover:opacity-100"
            )}
          >
            <X size={14} />
          </button>

        </div>

      ))}

    </div>)
}
