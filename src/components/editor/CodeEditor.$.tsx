'use client'
import React from 'react'
import Editor from '@monaco-editor/react'
import { useEditorStore } from '@/stores/editorStore'
import { EditorTabs } from './EditorTabs.$'

export const CodeEditor: React.FC = () => {
  const { activeFile, getFileContent } = useEditorStore()
  const content = activeFile ? getFileContent(activeFile) : ''

  const getLanguage = (fileId: string | null): string => {
    if (!fileId) return 'plaintext'
    if (fileId.endsWith('.tsx') || fileId.endsWith('.ts')) return 'typescript'
    if (fileId.endsWith('.jsx') || fileId.endsWith('.js')) return 'javascript'
    if (fileId.endsWith('.css')) return 'css'
    if (fileId.endsWith('.html')) return 'html'
    if (fileId.endsWith('.json')) return 'json'
    return 'plaintext'
  }

  return (
    <div className="h-full flex flex-col bg-editor">
      <EditorTabs />
      <div className="flex-1">
        {activeFile ? (
          <Editor
            height="100%"
            language={getLanguage(activeFile)}
            value={content}
            theme="vs-dark"
            options={{
              readOnly: true,
              minimap: { enabled: true },
              fontSize: 13,
              fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
              lineNumbers: 'on',
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16 },
              renderLineHighlight: 'line',
              cursorBlinking: 'smooth',
              smoothScrolling: true,
              wordWrap: 'on',
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <p className="text-lg mb-2">No file selected</p>
              <p className="text-sm">
                Select a file from the explorer to view its contents
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
