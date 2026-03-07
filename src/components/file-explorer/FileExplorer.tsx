'use client'
import React from 'react'
import { FileNode } from '@/stores/editorStore'
import { useMounted } from '@/lib/hooks/mounted'
import { useQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import { Id } from 'convex/_generated/dataModel'
import { Tree, Folder, File } from '../ui/file-tree'


const reandernode = (node: FileNode) => {
  if (node.type === 'folder') {
    return (
      <Folder element={node.name} value={node._id} key={node._id}>
        {node.childrean && node.childrean.map((child) => reandernode(child))}
      </Folder>
    )
  }
  return (
    <File value={node._id} key={node._id}>
      <span>{node.name}</span>
    </File>
  )
}

export const FileExplorer: React.FC = () => {
  const mounted = useMounted()
  const fileTree = useQuery(convexQuery(api.querys.getallfiletree, {
    workspaceID: 'jd760ygcxnzs2h2vapetkhp0fx828xvd' as Id<"workspaces">
  }))

  if (!mounted) return null

  return (
    <div className="h-full flex flex-col bg-[#1e1e2e] text-[#cdd6f4]">

      {/* Header */}
      <div className="px-4 py-3 border-b border-[#313244] bg-[#181825]">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-[#a6adc8]">
          Explorer
        </h2>
      </div>

      {/* File Tree */}
      <div className="flex-1 overflow-y-auto px-2 py-2">
        <Tree className="rounded-md bg-[#1e1e2e] p-2 text-sm">
          {fileTree.data?.map((node) => reandernode(node))}
        </Tree>
      </div>

    </div>)
}
