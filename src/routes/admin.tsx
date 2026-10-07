import { Outlet, createFileRoute } from '@tanstack/react-router'
import { WorkspaceGate } from '@/features/auth/WorkspaceGate'

export const Route = createFileRoute('/admin')({
  component: () => (
    <WorkspaceGate workspace="admin">
      <Outlet />
    </WorkspaceGate>
  ),
})
