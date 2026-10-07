import { Outlet, createFileRoute } from '@tanstack/react-router'
import { WorkspaceGate } from '@/features/auth/WorkspaceGate'
export const Route=createFileRoute('/expert')({component:()=> <WorkspaceGate workspace="expert"><Outlet/></WorkspaceGate>})
