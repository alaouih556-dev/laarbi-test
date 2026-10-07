import { Navigate, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_public/demande')({
  component: () => <Navigate to="/inscription" replace />,
})
