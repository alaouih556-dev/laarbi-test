import { createFileRoute } from '@tanstack/react-router'
import { ExpertSection } from '@/components/ExpertWorkspace'
export const Route=createFileRoute('/expert/clients')({component:()=> <ExpertSection kind="clients"/>})
