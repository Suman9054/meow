import { useState } from 'react'
import { Github, Settings, LogIn, X } from 'lucide-react'

export default function Header() {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-30 w-[96%] max-w-7xl">
      <div className="rounded-4xl border border-cyan-500/30 bg-slate-950/50 backdrop-blur-md shadow-lg shadow-cyan-500/10">
        <div className="flex items-center justify-between gap-6 px-8 py-5">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-cyan-600">
              <span className="text-sm font-bold text-white">AI</span>
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-slate-50">
                AI Code Studio
              </p>
              <p className="text-[11px] text-slate-400">Workspace assistant</p>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* GitHub with Project Settings Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="inline-flex items-center justify-center rounded-lg p-2.5 text-slate-300 hover:text-cyan-400 transition-colors hover:bg-slate-800/60"
                aria-label="GitHub & Project Settings"
              >
                <Github className="w-5 h-5" />
              </button>

              {showSettings && (
                <div className="absolute right-0 top-12 w-56 rounded-xl border border-cyan-500/30 bg-slate-950/90 backdrop-blur-md shadow-xl">
                  <div className="flex items-center justify-between border-b border-cyan-500/20 p-4">
                    <p className="text-sm font-semibold text-slate-100">
                      Project Settings
                    </p>
                    <button
                      onClick={() => setShowSettings(false)}
                      className="rounded p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="space-y-2 p-4">
                    <button className="w-full rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-300 hover:bg-cyan-500/20 transition-colors">
                      Project Settings
                    </button>
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-4 py-2.5 text-sm font-medium text-cyan-300 hover:bg-cyan-500/20 transition-colors"
                    >
                      <Github className="w-4 h-4" />
                      View on GitHub
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Login Button */}
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
