import { createFileRoute, Link } from '@tanstack/react-router'
import { FolderGit2, Plus, Clock, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

type ProjectStatus = 'active' | 'draft' | 'archived'

type Project = {
  id: string
  name: string
  description: string
  updatedAt: string
  status: ProjectStatus
}

const mockProjects: Project[] = [
  {
    id: 'ai-sandbox',
    name: 'AI Sandbox Studio',
    description: 'Full IDE workspace with chat, preview, and live panels.',
    updatedAt: 'Updated 2 hours ago',
    status: 'active',
  },
  {
    id: 'marketing-landing',
    name: 'Marketing Landing',
    description: 'Landing page with AI-generated sections and forms.',
    updatedAt: 'Updated yesterday',
    status: 'draft',
  },
  {
    id: 'docs-portal',
    name: 'Docs Portal',
    description: 'Content-focused app with search and MDX-style pages.',
    updatedAt: 'Updated 3 days ago',
    status: 'archived',
  },
]

function statusBadge(status: ProjectStatus) {
  if (status === 'active') {
    return (
      <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-medium text-emerald-300 border border-emerald-500/40">
        Active
      </span>
    )
  }
  if (status === 'draft') {
    return (
      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700">
        Draft
      </span>
    )
  }
  return (
    <span className="rounded-full bg-slate-900 px-2 py-0.5 text-[10px] font-medium text-slate-500 border border-slate-800">
      Archived
    </span>
  )
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-background px-4 py-10 md:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-slate-50 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-cyan-400" />
              Your projects
            </h1>
            <p className="mt-1 text-sm text-slate-400 max-w-xl">
              Create dedicated spaces for each app or experiment. Projects keep
              chat history, code context, and previews organized.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/workspace/$id"
              params={{ id: 'new-project' }}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs md:text-sm font-medium text-primary-foreground shadow shadow-cyan-500/40 hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New project in workspace</span>
            </Link>
          </div>
        </header>

        <main className="grid gap-6 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] items-start">
          {/* Project list */}
          <section className="space-y-3">
            {mockProjects.map((project) => (
              <article
                key={project.id}
                className="group rounded-2xl border border-slate-800 bg-slate-950/60 px-4 py-3.5 sm:px-5 sm:py-4 hover:border-cyan-500/60 hover:bg-slate-900/80 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h2 className="text-sm md:text-base font-semibold text-slate-50 flex items-center gap-2">
                      {project.name}
                    </h2>
                    <p className="text-xs text-slate-400 max-w-xl">
                      {project.description}
                    </p>
                    <p className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{project.updatedAt}</span>
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {statusBadge(project.status)}
                    <Link
                      to="/workspace/$id"
                      params={{ id: project.id }}
                      className="text-[11px] font-medium text-cyan-300 hover:text-cyan-200"
                    >
                      Open in workspace
                    </Link>
                  </div>
                </div>
              </article>
            ))}

            <div className="mt-2 rounded-2xl border border-dashed border-slate-700 bg-slate-950/50 px-4 py-3 flex items-center justify-between text-xs text-slate-400">
              <span>
                This dashboard is purely client-side and uses mock data. Wire it
                up to your own API or database when you are ready.
              </span>
            </div>
          </section>

          {/* Side panel */}
          <aside className="space-y-4">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-slate-50 mb-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Quick start
              </h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  • Create a new project and describe the feature you want in
                  the Chat route.
                </li>
                <li>
                  • Use the workspace to inspect generated code and adjust
                  prompts.
                </li>
                <li>
                  • When you are happy, copy changes into your main repo or
                  connect Git.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-400 space-y-2">
              <p className="font-semibold text-slate-100 text-sm mb-1">
                Coming next
              </p>
              <p>
                Hook this dashboard into real authentication and persistence:
                user accounts, per-project settings, and environment
                configuration.
              </p>
            </div>
          </aside>
        </main>
      </div>
    </div>
  )
}
