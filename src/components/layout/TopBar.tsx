'use client'
import React from 'react'
import {
  Code,
  Eye,
  Columns,
  MessageSquare,
  PanelLeft,
  Settings,
} from 'lucide-react'
import { useUIStore } from '@/stores/uiStore'
import { cn } from '@/lib/utils'

export const TopBar: React.FC = () => {
  const {
    activePanel,
    setActivePanel,
    isChatOpen,
    toggleChat,
    isSidebarOpen,
    toggleSidebar,
  } = useUIStore()

  return (
    <header className="h-12 flex items-center justify-between px-4 bg-[#181825] border-b border-[#313244] text-[#cdd6f4]">

      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleSidebar}
          className={cn(
            "p-1.5 rounded-md transition-colors",
            isSidebarOpen
              ? "bg-[#313244] text-[#cdd6f4]"
              : "text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[#313244]"
          )}
          title="Toggle sidebar"
        >
          <PanelLeft size={18} />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gradient-to-br from-[#89b4fa] to-[#cba6f7] flex items-center justify-center">
            <span className="text-xs font-bold text-[#1e1e2e]">L</span>
          </div>

          <span className="font-semibold text-sm text-[#cdd6f4]">
            Lovable Browser
          </span>
        </div>
      </div>

      {/* Center */}
      <div className="flex items-center gap-1 bg-[#313244] p-1 rounded-lg">

        <button
          onClick={() => setActivePanel("code")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition",
            activePanel === "code"
              ? "bg-[#1e1e2e] text-[#cdd6f4]"
              : "text-[#a6adc8] hover:text-[#cdd6f4]"
          )}
        >
          <Code size={16} />
          Code
        </button>

        <button
          onClick={() => setActivePanel("split")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition",
            activePanel === "split"
              ? "bg-[#1e1e2e] text-[#cdd6f4]"
              : "text-[#a6adc8] hover:text-[#cdd6f4]"
          )}
        >
          <Columns size={16} />
          Split
        </button>

        <button
          onClick={() => setActivePanel("preview")}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition",
            activePanel === "preview"
              ? "bg-[#1e1e2e] text-[#cdd6f4]"
              : "text-[#a6adc8] hover:text-[#cdd6f4]"
          )}
        >
          <Eye size={16} />
          Preview
        </button>

      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        <button
          onClick={toggleChat}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition",
            isChatOpen
              ? "bg-[#89b4fa] text-[#1e1e2e]"
              : "bg-[#313244] text-[#a6adc8] hover:text-[#cdd6f4]"
          )}
        >
          <MessageSquare size={16} />
          Chat
        </button>

        <button className="p-1.5 rounded-md text-[#a6adc8] hover:text-[#cdd6f4] hover:bg-[#313244] transition">
          <Settings size={18} />
        </button>

      </div>

    </header>)
}
