import { createFileRoute } from '@tanstack/react-router'
import { ExpertSection } from '@/components/ExpertWorkspace'
export const Route=createFileRoute('/expert/agenda')({component:()=> <ExpertSection kind="agenda"/>})
