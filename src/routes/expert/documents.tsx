import { createFileRoute } from '@tanstack/react-router'
import { ExpertSection } from '@/components/ExpertWorkspace'
export const Route=createFileRoute('/expert/documents')({component:()=> <ExpertSection kind="documents"/>})
