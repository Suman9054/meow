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
    <div className="h-full flex flex-col bg-[#1e1e2e] text-[#cdd6f4]">

      <EditorTabs />

      <div className="flex-1 bg-[#1e1e2e]">

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

          <div className="h-full flex items-center justify-center text-[#a6adc8]">
            <div className="text-center space-y-2">

              <div className="text-3xl opacity-40">📂</div>

              <p className="text-lg text-[#cdd6f4] font-medium">
                No file selected
              </p>

              <p className="text-sm text-[#a6adc8]">
                Select a file from the explorer to view its contents
              </p>

            </div>
          </div>

        )}

      </div>

    </div>)
}
