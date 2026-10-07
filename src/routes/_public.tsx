import { Link, Outlet, createFileRoute, useRouterState } from '@tanstack/react-router'
import { LaunchBanner, PublicFooter, PublicHeader } from '@/components/marketing'

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
})

const SEGMENT_LABELS: Record<string, string> = {
  '': 'Accueil',
  secteurs: 'Secteurs',
  sante: 'Santé',
  enseignement: 'Enseignement',
  tourisme: 'Tourisme',
  diagnostic: 'Diagnostic offert',
  tarifs: 'Tarifs',
  faq: 'FAQ',
  'a-propos': 'À propos',
  conditions: 'Conditions',
  contact: 'Contact',
  inscription: 'Créer mon compte',
  connexion: 'Connexion',
  missions: 'Missions',
}

function useBreadcrumb() {
  const path = useRouterState({ select: (s) => s.location.pathname })
  const parts = path.split('/').filter(Boolean)
  const crumbs = [{ label: 'Accueil', to: '/' }]
  let acc = ''
  for (const p of parts) {
    acc += '/' + p
    crumbs.push({ label: SEGMENT_LABELS[p] ?? p.charAt(0).toUpperCase() + p.slice(1), to: acc })
  }
  return crumbs
}

function PublicLayout() {
  const crumbs = useBreadcrumb()
  return (
    <>
      <LaunchBanner />
      <PublicHeader />
      <div className="border-b border-ink-100 bg-white">
        <nav className="container-page flex flex-wrap items-center gap-1.5 py-2 text-xs text-ink-500" aria-label="Fil d'Ariane">
          {crumbs.map((c, i) => (
            <span key={c.to} className="inline-flex items-center gap-1.5">
              {i > 0 ? <span className="text-ink-300">/</span> : null}
              {i === crumbs.length - 1 ? (
                <span className="font-semibold text-ink-900">{c.label}</span>
              ) : (
                <Link to={c.to as any} className="hover:text-ink-950 hover:underline">{c.label}</Link>
              )}
            </span>
          ))}
        </nav>
      </div>
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </>
  )
}
