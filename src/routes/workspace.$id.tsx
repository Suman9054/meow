import { createFileRoute } from '@tanstack/react-router'
import { MainLayout } from '../components/layout/MainLayout'

export const Route = createFileRoute('/workspace/$id')({
  component: ChatRoute,
})

function ChatRoute() {
  return <MainLayout />
}
