import React from 'react'
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels'
import { FileExplorer } from '@/components/file-explorer/FileExplorer'
import { CodeEditor } from '@/components/editor/CodeEditor'
import { AppPreview } from '@/components/preview/AppPreview'
import { ChatPanel } from '@/components/ChatPanel'
import { TopBar } from './TopBar'
import { useUIStore } from '@/stores/uiStore'

export const MainLayout: React.FC = () => {
  const { activePanel, isChatOpen, isSidebarOpen } = useUIStore()

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <TopBar />

      <div className="flex-1 flex overflow-hidden">
        <PanelGroup direction="horizontal" className="flex-1">
          {/* Sidebar - File Explorer */}
          {isSidebarOpen && (
            <>
              <Panel defaultSize={15} minSize={10} maxSize={25}>
                <FileExplorer />
              </Panel>
              <PanelResizeHandle className="w-1 bg-panel-border hover:bg-primary transition-colors" />
            </>
          )}

          {/* Main Content Area */}
          <Panel defaultSize={isChatOpen ? 60 : 85}>
            <PanelGroup direction="horizontal">
              {/* Code Editor */}
              {(activePanel === 'code' || activePanel === 'split') && (
                <>
                  <Panel defaultSize={activePanel === 'split' ? 50 : 100} minSize={30}>
                    <CodeEditor />
                  </Panel>
                  {activePanel === 'split' && (
                    <PanelResizeHandle className="w-1 bg-panel-border hover:bg-primary transition-colors" />
                  )}
                </>
              )}

              {/* App Preview */}
              {(activePanel === 'preview' || activePanel === 'split') && (
                <Panel defaultSize={activePanel === 'split' ? 50 : 100} minSize={30}>
                  <AppPreview />
                </Panel>
              )}
            </PanelGroup>
          </Panel>

          {/* Chat Panel */}
          {isChatOpen && (
            <>
              <PanelResizeHandle className="w-1 bg-panel-border hover:bg-primary transition-colors" />
              <Panel defaultSize={25} minSize={20} maxSize={40}>
                <ChatPanel />
              </Panel>
            </>
          )}
        </PanelGroup>
      </div>
    </div>
  )
}
