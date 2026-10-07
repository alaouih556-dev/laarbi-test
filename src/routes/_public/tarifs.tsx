import { Navigate, createFileRoute } from '@tanstack/react-router'

/** Les offres détaillées et leurs prix sont réservés à l’espace après connexion. */
export const Route = createFileRoute('/_public/tarifs')({
  component: () => <Navigate to="/inscription" replace />,
  head: () => ({ meta: [{ title: 'Diagnostic ALLNEEDS' }] }),
})
