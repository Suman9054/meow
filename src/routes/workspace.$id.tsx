
import { createFileRoute } from '@tanstack/react-router'
import { MainLayout } from '../components/layout/MainLayout'
import { ChatClient } from '@/components/chatclient'

export const Route = createFileRoute('/workspace/$id')({
  component: ChatRoute,
})

function ChatRoute() {



  return (
    <>
      <MainLayout />
      {typeof window !== 'undefined' && <ChatClient />}
    </>
  )
}
