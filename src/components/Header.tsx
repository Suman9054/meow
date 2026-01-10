import { useState } from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import { ArrowRight, Bot, FolderGit2, LayoutDashboard, LogIn, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Header() {
  const [showAuth, setShowAuth] = useState(false)
  const { location } = useRouterState()
  const pathname = location.pathname

  const navLinkClass = (path: string) =>
    cn(
      'inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs md:text-sm transition-colors',
      pathname === path
        ? 'bg-slate-800 text-slate-100'
        : 'text-slate-300 hover:text-white hover:bg-slate-800/70',
    )

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-2.5">
        {/* Brand */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground">
            <Bot className="w-4 h-4" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-slate-50">AI Code Studio</p>
            <p className="text-[11px] text-slate-500">Workspace-aware coding assistant</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          <Link to="/" className={navLinkClass('/')}>Home</Link>
          <Link to="/chat" className={navLinkClass('/chat')}>
            <span>Workspace</span>
          </Link>
          <Link to="/dashboard" className={navLinkClass('/dashboard')}>
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>
        </nav>

        {/* Get started + Auth toggle */}
        <div className="relative flex items-center gap-2">
          <a
            href="/#start"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground shadow shadow-cyan-500/40 hover:bg-primary/90 transition-colors"
          >
            <span>Get started</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          <button
            type="button"
            onClick={() => setShowAuth((prev) => !prev)}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign in</span>
          </button>

          {showAuth && (
            <div className="absolute right-0 top-9 w-72 rounded-xl border border-slate-800 bg-slate-950/95 p-4 shadow-xl">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-xs font-semibold text-slate-100">Account</p>
                <button
                  type="button"
                  onClick={() => setShowAuth(false)}
                  className="rounded p-1 text-slate-500 hover:bg-slate-800 hover:text-slate-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-2">
                  <input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-[11px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full rounded-lg border border-slate-700 bg-slate-900/80 px-3 py-2 text-[11px] text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/70"
                  />
                  <button className="mt-1 w-full rounded-lg bg-primary px-3 py-2 text-[11px] font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                    Sign in
                  </button>
                </div>

                <div className="h-px bg-slate-800" />

                <div className="space-y-2 text-[11px] text-slate-400">
                  <p className="font-medium text-slate-100">New here?</p>
                  <p>
                    Create an account to save projects, sync conversations, and pick up where you
                    left off.
                  </p>
                  <button className="w-full rounded-lg border border-cyan-500/60 bg-slate-900/60 px-3 py-1.5 text-[11px] font-medium text-cyan-200 hover:bg-slate-900 transition-colors">
                    Create free account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
