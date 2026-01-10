import React from 'react'
import { Code, Eye, Columns, MessageSquare, PanelLeft, Settings } from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

export const TopBar: React.FC = () => {
  const { activePanel, setActivePanel, isChatOpen, toggleChat, isSidebarOpen, toggleSidebar } =
    useUIStore()

  return (
    <header className="h-12 flex items-center justify-between px-4 bg-panel-header border-b border-panel-border">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className={cn(
            'p-1.5 rounded transition-colors',
            isSidebarOpen
              ? 'bg-muted text-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
          title="Toggle sidebar"
        >
          <PanelLeft size={18} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-xs font-bold text-primary-foreground">L</span>
          </div>
          <span className="font-semibold text-sm">Lovable Browser</span>
        </div>
      </div>

      {/* Center Section - View Toggles */}
      <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
        <button
          onClick={() => setActivePanel('code')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            activePanel === 'code'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Code size={16} />
          <span>Code</span>
        </button>
        <button
          onClick={() => setActivePanel('split')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            activePanel === 'split'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Columns size={16} />
          <span>Split</span>
        </button>
        <button
          onClick={() => setActivePanel('preview')}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            activePanel === 'preview'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          <Eye size={16} />
          <span>Preview</span>
        </button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        <button
          onClick={toggleChat}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            isChatOpen
              ? 'bg-primary text-primary-foreground'
              : 'bg-muted text-muted-foreground hover:text-foreground',
          )}
        >
          <MessageSquare size={16} />
          <span>Chat</span>
        </button>
        <button className="p-1.5 rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <Settings size={18} />
        </button>
      </div>
    </header>
  )
}