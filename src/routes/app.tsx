import { Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { LockKeyhole } from 'lucide-react'
import { WorkspaceGate } from '@/features/auth/WorkspaceGate'
import { Card } from '@/components/ui'
import { useDemo } from '@/store/store'

export const Route = createFileRoute('/app')({
  component: ClientAppLayout,
})

function ClientAppLayout() {
  const { state } = useDemo()
  const path = useRouterState({ select: (s) => s.location.pathname })
  const pending = state.registrationProfile?.activated === false
  const allowed = path === '/app' || path === '/app/' || path === '/app/diagnostic-auto' || path === '/app/abonnement'

  return (
    <WorkspaceGate workspace="client">
      {pending && !allowed ? (
        <Card className="mx-auto max-w-2xl p-8 text-center">
          <LockKeyhole className="mx-auto h-8 w-8 text-ink-400" />
          <h1 className="mt-4 font-display text-2xl text-ink-950">Fonctionnalité verrouillée</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-600">Votre compte est créé et reste en attente d’activation par l’administrateur ALLNEEDS. L’accueil et votre diagnostic restent accessibles pendant cette attente.</p>
        </Card>
      ) : <Outlet />}
    </WorkspaceGate>
  )
}
