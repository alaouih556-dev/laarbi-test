import { createFileRoute } from '@tanstack/react-router'
import { Diagnostic } from '@/features/saas/Diagnostic'
export const Route = createFileRoute('/app/diagnostic-auto')({ component: Diagnostic })
