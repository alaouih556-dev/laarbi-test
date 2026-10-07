import { createFileRoute } from '@tanstack/react-router'
import { DiagnosticReview } from '@/features/saas/DiagnosticReview'
export const Route = createFileRoute('/admin/diagnostics-auto')({component:DiagnosticReview})
