'use client'
import React from 'react'
import {
  ChevronRight,
  ChevronDown,
  File,
  Folder,
  FolderOpen,
} from 'lucide-react'
import { useEditorStore, FileNode } from '@/stores/editorStore'
import { cn } from '@/lib/utils'
import { useMounted } from '@/lib/hooks/mounted'

interface FileTreeItemProps {
  node: FileNode
  depth: number
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ node, depth }) => {
  const { activeFile, expandedFolders, setActiveFile, toggleFolder } =
    useEditorStore()

  const isExpanded = expandedFolders.has(node.id)
  const isActive = activeFile === node.id

  const handleClick = () => {
    if (node.type === 'folder') {
      toggleFolder(node.id)
    } else {
      setActiveFile(node.id)
    }
  }

  const getFileIcon = (fileName: string) => {
    if (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) {
      return <span className="text-syntax-type text-xs font-bold">TS</span>
    }
    if (fileName.endsWith('.css')) {
      return <span className="text-syntax-keyword text-xs font-bold">#</span>
    }
    if (fileName.endsWith('.json')) {
      return (
        <span className="text-syntax-number text-xs font-bold">{'{}'}</span>
      )
    }
    if (fileName.endsWith('.html')) {
      return (
        <span className="text-syntax-string text-xs font-bold">&lt;&gt;</span>
      )
    }
    return <File size={14} className="text-muted-foreground" />
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={cn(
          'w-full flex items-center gap-1.5 px-2 py-1 text-sm text-left rounded-sm transition-colors',
          'hover:bg-sidebar-hover',
          isActive && 'bg-sidebar-hover text-sidebar-active',
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
      >
        {node.type === 'folder' ? (
          <>
            {isExpanded ? (
              <ChevronDown size={14} className="text-muted-foreground" />
            ) : (
              <ChevronRight size={14} className="text-muted-foreground" />
            )}
            {isExpanded ? (
              <FolderOpen size={14} className="text-syntax-function" />
            ) : (
              <Folder size={14} className="text-syntax-function" />
            )}
          </>
        ) : (
          <>
            <span className="w-3.5" />
            <span className="w-3.5 flex items-center justify-center">
              {getFileIcon(node.name)}
            </span>
          </>
        )}
        <span
          className={cn(
            'truncate',
            node.type === 'folder'
              ? 'text-sidebar-foreground'
              : 'text-foreground/80',
          )}
        >
          {node.name}
        </span>
      </button>

      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  )
}

export const FileExplorer: React.FC = () => {
  const mounted = useMounted()
  const { fileTree } = useEditorStore()
  if (!mounted) return null

  return (
    <div className="h-full bg-sidebar flex flex-col">
      <div className="px-4 py-3 border-b border-panel-border">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Explorer
        </h2>
      </div>
      <div className="flex-1 overflow-auto py-2">
        {fileTree.map((node) => (
          <FileTreeItem key={node.id} node={node} depth={0} />
        ))}
      </div>
    </div>
  )
}
