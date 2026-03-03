import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight, Loader } from 'lucide-react'
import Header from '@/components/Header'
import FaultyTerminal from '@/components/faltyterminal'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [prompt, setPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setIsLoading(true)
    setError('')

    try {
      // Navigate to workspace with the prompt as initial state
      await navigate({
        to: '/workspace/$id',
        params: { id: 'new-project' },
        search: { initialPrompt: prompt },
      })
      setPrompt('')
    } catch (err) {
      setError('Failed to create workspace. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <>
      <Header />
      <div className="h-screen flex flex-col bg-slate-950">
        {/* Fixed Terminal Background */}
        <div className="fixed inset-0 w-full h-full z-0">
          <FaultyTerminal
            scale={1.5}
            gridMul={[2, 1]}
            digitSize={1.2}
            timeScale={0.5}
            pause={false}
            scanlineIntensity={0.5}
            glitchAmount={1}
            flickerAmount={1}
            noiseAmp={1}
            chromaticAberration={0}
            dither={0}
            curvature={0.1}
            tint="#00ffff"

            mouseStrength={0.5}
            brightness={0.6}
          />
        </div>

        {/* Dark overlay for content readability */}
        <div className="fixed inset-0 bg-gradient-to-b from-slate-950/40 via-slate-950/60 to-slate-950/80 z-10" />

        {/* Main scrollable content */}
        <div className="relative z-20 flex-grow overflow-y-auto flex flex-col ">
          {/* Expandable space */}
          <div className="flex-grow flex flex-col items-center justify-center px-6">
            <p className="text-center text-sm text-slate-200 mt-6">
              Welcome to AI Code Studio! Start by describing your project idea below.
            </p>
          </div>

          {/* Chat Section */}
          <div className="px-6 py-6">
            <div className="max-w-3xl mx-auto w-full flex flex-col gap-4">

              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-cyan-500/40 bg-slate-900/60 backdrop-blur-sm p-4 md:p-5 shadow-2xl shadow-cyan-500/20 hover:border-cyan-400/60 hover:bg-slate-900/80 transition-all"
              >
                <div className="flex flex-col gap-3">
                  <textarea
                    rows={4}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    disabled={isLoading}
                    placeholder="e.g. Generate a project dashboard layout with filters and a summary card at the top."
                    className="w-full resize-none bg-slate-950/80 px-4 py-3 text-sm md:text-base text-slate-100 placeholder:text-slate-500 rounded-xl border border-cyan-500/20 focus:outline-none focus:ring-2 focus:ring-cyan-400/60 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  />
                  {error && (
                    <div className="rounded-lg bg-red-500/15 border border-red-500/40 p-3 text-xs md:text-sm text-red-300">
                      {error}
                    </div>
                  )}
                  <div className="flex items-center justify-between gap-3 text-[11px] text-slate-400">
                    <span>
                      Tip: be specific about components, data, and tech stack.
                    </span>
                    <button
                      type="submit"
                      disabled={!prompt.trim() || isLoading}
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-xs font-medium text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cyan-600 active:bg-cyan-700 transition-all shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-3.5 h-3.5 animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <ArrowRight className="w-4 h-4" />
                          <span>Send</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Fixed Footer */}
      </div>
      <footer className="relative z-20 border-t border-cyan-500/20 bg-slate-950/95 backdrop-blur-sm py-3 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-500">
          <span>
            © {new Date().getFullYear()} AI Code Studio. All rights reserved.
          </span>
          <span>Workspace powered by TanStack Start.</span>
        </div>
      </footer>

    </>
  )
}
