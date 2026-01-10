import { useRef, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  ArrowRight,
  Bot,
  Code2,
  FolderGit2,
  LayoutPanelLeft,
  Sparkles,
} from 'lucide-react'
import Header from '@/components/Header'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [prompt, setPrompt] = useState('')
  const chatSectionRef = useRef<HTMLDivElement | null>(null)

  const handleGetStarted = () => {
    chatSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    // In a real app this would send the prompt to your AI backend
    setPrompt('')
  }

  const features = [
    {
      icon: <Code2 className="w-5 h-5 text-cyan-400" />,
      title: 'AI-powered code workspace',
      description:
        'Chat with an AI that understands your project structure, files, and tech stack.',
    },
    {
      icon: <LayoutPanelLeft className="w-5 h-5 text-cyan-400" />,
      title: 'In-browser IDE surface',
      description:
        'Inspect files, preview UI, and iterate quickly without leaving the browser.',
    },
    {
      icon: <FolderGit2 className="w-5 h-5 text-cyan-400" />,
      title: 'Project-based workflows',
      description:
        'Organize work into projects with saved prompts and generated changes.',
    },
  ]

  return (

    <>
      <Header />
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-foreground overflow-hidden">
        {/* Hero + AI prompt */}
        <section className="min-h-screen relative px-6 py-16 md:py-24 flex items-center justify-center">
          <div className="pointer-events-none absolute inset-0 opacity-40">
            <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
            <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-purple-500/20 blur-3xl" />
          </div>

          <div className="relative max-w-3xl mx-auto text-center flex flex-col items-center gap-10 w-full">
            {/* Hero copy */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-slate-900/60 px-3 py-1 text-xs font-medium text-cyan-200 mb-4">
                <Sparkles className="w-3 h-3" />
                <span>AI-native coding workspace</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-white mb-4">
                Ship faster with
                <span className="block bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-400 bg-clip-text text-transparent">
                  an AI code studio
                </span>
              </h1>

              <p className="text-base md:text-lg text-slate-400 max-w-xl mx-auto mb-8">
                Ask in natural language. Watch your project-aware AI assistant explore files,
                update code, and keep everything in sync—directly inside your browser.
              </p>

              <div className="grid gap-4 sm:grid-cols-3 text-sm">
                {features.map((feature) => (
                  <div
                    key={feature.title}
                    className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-3"
                  >
                    <div className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-800">
                      {feature.icon}
                    </div>
                    <div className="text-left">
                      <h3 className="text-xs font-semibold text-slate-100 mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Simple chat section for getting started */}
        <section
          id="start"
          ref={chatSectionRef}
          className="min-h-screen px-6 py-16 flex items-center justify-center"
        >
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-4">
            <div className="mb-1">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Start with a prompt
              </p>
              <p className="text-sm text-slate-300">
                Describe what you want to build and we'll guide you into the full workspace.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-800 bg-slate-900/90 p-5 md:p-7 shadow-2xl shadow-cyan-500/10">
              <div className="flex flex-col gap-4">
                <textarea
                  rows={5}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Generate a project dashboard layout with filters and a summary card at the top."
                  className="min-h-[120px] w-full resize-none bg-slate-950/60 px-4 py-3 text-base md:text-lg text-slate-100 placeholder:text-slate-500 rounded-2xl border border-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500/80"
                />
                <div className="flex items-center justify-between gap-3 text-[11px] text-slate-500">
                  <span>Tip: be specific about components, data, and tech stack.</span>
                  <button
                    type="submit"
                    disabled={!prompt.trim()}
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-cyan-500 px-4 py-1.5 text-xs font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-600 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </section>

        <footer className="border-t border-slate-800/80 bg-slate-950/90 py-4">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
            <span>© {new Date().getFullYear()} AI Code Studio. All rights reserved.</span>
            <span>Workspace powered by TanStack Start.</span>
          </div>
        </footer>
      </div>
    </>
  )
}
