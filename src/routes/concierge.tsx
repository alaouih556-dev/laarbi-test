import { Outlet, createFileRoute } from '@tanstack/react-router'
import { WorkspaceGate } from '@/features/auth/WorkspaceGate'

export const Route = createFileRoute('/concierge')({
  component: () => (
    <WorkspaceGate workspace="concierge">
      <Outlet />
    </WorkspaceGate>
  ),
})
