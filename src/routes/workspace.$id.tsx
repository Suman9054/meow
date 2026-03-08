import { createFileRoute } from '@tanstack/react-router'
import { MainLayout } from '../components/layout/MainLayout.$'
import { convexQuery } from '@convex-dev/react-query'
import { api } from 'convex/_generated/api'
import { Id } from 'convex/_generated/dataModel'

export const Route = createFileRoute('/workspace/$id')({
  ssr: 'data-only',
  component: ChatRoute,
  loader: async (ctx) => {
    await ctx.context.queryClient.ensureQueryData(
      convexQuery(api.querys.getallfiletree, {
        workspaceID: 'jd760ygcxnzs2h2vapetkhp0fx828xvd' as Id<'workspaces'>,
      }),
    )
    await ctx.context.queryClient.ensureQueryData(
      convexQuery(api.querys.getmessages, {
        workspaceID: 'jd760ygcxnzs2h2vapetkhp0fx828xvd' as Id<'workspaces'>,
      }),
    )
  },
})

function ChatRoute() {
  return (
    <>
      <MainLayout />
    </>
  )
}
