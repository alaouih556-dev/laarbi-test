import { useEffect, useState, type ReactNode } from 'react'
import { Link, useNavigate, type LinkProps } from '@tanstack/react-router'
import {
  BarChart3,
  Bell,
  Briefcase,
  Building2,
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  ClipboardList,
  FileText,
  Gauge,
  Inbox,
  LayoutDashboard,
  ListChecks,
  Target,
  UsersRound,
  LineChart,
  FolderKanban,
  LogOut,
  Menu,
  MessageSquare,
  Network,
  Receipt,
  RefreshCcw,
  Settings2,
  ShieldCheck,
  UserRoundCog,
  X,
} from 'lucide-react'
import { orgHasSaasAccess, useDemo } from '@/store/store'
import { useAuth } from '@/features/auth/AuthContext'
import { cn } from '@/lib/utils'
import { Avatar, Button } from '@/components/ui'

/* ------------------------------------------------------------------ */
/* Toaster                                                             */
/* ------------------------------------------------------------------ */

export function Toaster() {
  const { state, dispatch } = useDemo()

  useEffect(() => {
    if (state.toasts.length === 0) return
    const timers = state.toasts.map((toast) =>
      window.setTimeout(() => dispatch({ type: 'TOAST_REMOVE', id: toast.id }), 5200),
    )
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [state.toasts, dispatch])

  if (state.toasts.length === 0) return null

  const tones = {
    success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    info: 'border-sky-200 bg-sky-50 text-sky-900',
    warning: 'border-amber-200 bg-amber-50 text-amber-900',
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2">
      {state.toasts.map((toast) => (
        <div key={toast.id} className={cn('pointer-events-auto animate-fade-up rounded-xl border px-4 py-3 shadow-lift', tones[toast.tone])}>
          <p className="text-sm font-semibold">{toast.title}</p>
          {toast.description ? <p className="mt-0.5 text-xs opacity-80">{toast.description}</p> : null}
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Sidebar                                                             */
/* ------------------------------------------------------------------ */

interface NavItem {
  label: string
  to: LinkProps['to']
  icon: ReactNode
  badge?: number
  disabled?: boolean
  disabledHint?: string
  group: string
}

function buildClientNav(unreadMessages: number, pendingDocs: number, saasEnabled: boolean, workspaceRole: 'dirigeant'|'manager'|'collaborateur', sector?: string, accountActivated = true): NavItem[] {
  const items: NavItem[] = [
    { group: 'Espace', label: 'Accueil', to: '/app', icon: <LayoutDashboard className="h-4 w-4" /> },
    { group: 'Piloter', label: 'Objectifs', to: '/app/objectifs' as any, icon: <Target className="h-4 w-4" />, disabled: !accountActivated, disabledHint: 'En attente d’activation par l’administrateur' },
    { group: 'Piloter', label: 'Plan d’action', to: '/app/actions' as any, icon: <ListChecks className="h-4 w-4" />, disabled: !accountActivated, disabledHint: 'En attente d’activation par l’administrateur' },
    { group: 'Piloter', label: 'Diagnostic 360°', to: '/app/diagnostic-auto' as any, icon: <Gauge className="h-4 w-4" /> },
    { group: 'Piloter', label: 'Résultats', to: '/app/performance' as any, icon: <LineChart className="h-4 w-4" />, disabled: !accountActivated, disabledHint: 'En attente d’activation par l’administrateur' },
    { group: 'Collaborer', label: 'Équipe', to: '/app/equipe' as any, icon: <UsersRound className="h-4 w-4" />, disabled: !accountActivated, disabledHint: 'En attente d’activation par l’administrateur' },
    { group: 'Collaborer', label: 'Projets', to: '/app/projets' as any, icon: <FolderKanban className="h-4 w-4" />, disabled: !accountActivated, disabledHint: 'En attente d’activation par l’administrateur' },
    { group: 'Collaborer', label: 'Documents', to: '/app/documents', icon: <ShieldCheck className="h-4 w-4" />, badge: pendingDocs, disabled: !accountActivated, disabledHint: 'En attente d’activation par l’administrateur' },
    { group: 'Collaborer', label: 'Messages', to: '/app/messages', icon: <MessageSquare className="h-4 w-4" />, badge: unreadMessages, disabled: !accountActivated, disabledHint: 'En attente d’activation par l’administrateur' },
    { group: 'Collaborer', label: 'Notifications', to: '/app/notifications' as any, icon: <Bell className="h-4 w-4" />, disabled: !accountActivated, disabledHint: 'En attente d’activation par l’administrateur' },
    { group: 'Réseau', label: 'Écosystème', to: '/app/ecosysteme' as any, icon: <Network className="h-4 w-4" />, disabled: !accountActivated, disabledHint: 'En attente d’activation par l’administrateur' },
    { group: 'Réseau', label: sector === 'sante' ? 'Espace métier Santé' : 'Espace métier SaaS', to: '/app/espace-metier', icon: <Building2 className="h-4 w-4" />, disabled: !accountActivated || !saasEnabled, disabledHint: !accountActivated ? 'En attente d’activation par l’administrateur' : 'En attente de validation ALLNEEDS' },
    { group: 'Compte', label: 'Offres & abonnement', to: '/app/abonnement' as any, icon: <Receipt className="h-4 w-4" />, disabled: !accountActivated, disabledHint: 'Disponible après activation du compte' },
    { group: 'Compte', label: 'Profil & activité', to: '/app/parametres' as any, icon: <Settings2 className="h-4 w-4" />, disabled: !accountActivated, disabledHint: 'En attente d’activation par l’administrateur' },
  ]
  if (workspaceRole === 'collaborateur') return items.filter((item) => ['Accueil','Plan d’action','Projets','Documents','Messages','Notifications','Profil & activité'].includes(item.label))
  if (workspaceRole === 'manager') return items.filter((item) => !['Espace métier Santé', 'Espace métier SaaS'].includes(item.label))
  return items
}


function buildConciergeNav(): NavItem[] {
  return [
    { group: 'Portefeuille', label: 'Mon portefeuille', to: '/concierge' as any, icon: <LayoutDashboard className="h-4 w-4" /> },
    { group: 'Portefeuille', label: 'Entreprises suivies', to: '/concierge/entreprises' as any, icon: <Building2 className="h-4 w-4" /> },
    { group: 'Suivi', label: 'Besoins', to: '/concierge/besoins' as any, icon: <Inbox className="h-4 w-4" /> },
    { group: 'Suivi', label: 'Diagnostics', to: '/concierge/diagnostics' as any, icon: <Gauge className="h-4 w-4" /> },
    { group: 'Suivi', label: 'Missions', to: '/concierge/missions' as any, icon: <Briefcase className="h-4 w-4" /> },
    { group: 'Développement client', label: 'Offres complémentaires', to: '/concierge/suivi-commercial' as any, icon: <BarChart3 className="h-4 w-4" /> },
    { group: 'Coordination', label: 'Prestataires', to: '/concierge/prestataires' as any, icon: <Network className="h-4 w-4" /> },
    { group: 'Coordination', label: 'Rendez-vous', to: '/concierge/rendez-vous' as any, icon: <CalendarDays className="h-4 w-4" /> },
    { group: 'Coordination', label: 'Documents', to: '/concierge/documents' as any, icon: <FileText className="h-4 w-4" /> },
    { group: 'Coordination', label: 'Messages', to: '/concierge/messages' as any, icon: <MessageSquare className="h-4 w-4" /> },
  ]
}

function buildAdminNav(): NavItem[] {
  return [
    { group: 'Pilotage', label: 'Vue d’ensemble', to: '/admin', icon: <LayoutDashboard className="h-4 w-4" /> },
    { group: 'Pilotage', label: 'Pipeline', to: '/admin/pipeline', icon: <BarChart3 className="h-4 w-4" /> },
    { group: 'Pilotage', label: 'Relances', to: '/admin/relances', icon: <Bell className="h-4 w-4" /> },
    { group: 'Opérations', label: 'Besoins', to: '/admin/besoins', icon: <Inbox className="h-4 w-4" /> },
    { group: 'Opérations', label: 'Diagnostics à relire', to: '/admin/diagnostics-auto', icon: <Gauge className="h-4 w-4" /> },
    { group: 'Opérations', label: 'Diagnostics internes', to: '/admin/diagnostics', icon: <ClipboardList className="h-4 w-4" /> },
    { group: 'Opérations', label: 'Qualification', to: '/admin/qualification', icon: <ClipboardList className="h-4 w-4" /> },
    { group: 'Opérations', label: 'Grille STARTER', to: '/admin/grille', icon: <ClipboardCheck className="h-4 w-4" /> },
    { group: 'Opérations', label: 'Prestataires', to: '/admin/prestataires', icon: <Network className="h-4 w-4" /> },
    { group: 'Opérations', label: 'Missions', to: '/admin/missions', icon: <Briefcase className="h-4 w-4" /> },
    { group: 'Accès', label: 'Clients', to: '/admin/clients', icon: <Building2 className="h-4 w-4" /> },
    { group: 'Accès', label: 'Concierges & accès', to: '/admin/concierges' as any, icon: <UserRoundCog className="h-4 w-4" /> },
    { group: 'Accès', label: 'Quotas & abonnements', to: '/admin/quotas', icon: <RefreshCcw className="h-4 w-4" /> },
  ]
}

/* ------------------------------------------------------------------ */
/* App shell                                                           */
/* ------------------------------------------------------------------ */

export function AppShell({
  children,
  variant,
}: {
  children: ReactNode
  variant: 'client' | 'admin' | 'concierge'
}) {
  const { state, dispatch, user } = useDemo()
  const auth = useAuth()
  const navigate = useNavigate()
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const displayUser = auth.status === 'authenticated' && auth.user ? {
    ...user,
    id: auth.user.id,
    name: auth.user.name,
    email: auth.user.email,
    roleLabel: auth.user.role === 'admin' ? 'ALLNEEDS · Administrateur' : auth.user.role === 'concierge' ? 'ALLNEEDS · Concierge' : auth.user.role === 'manager' ? 'Responsable · Espace client' : auth.user.role === 'collaborateur' ? 'Collaborateur · Espace client' : user.roleLabel,
  } : user

  const unread = state.threads.reduce((acc, t) => acc + t.unread, 0)
  const pendingDocs = state.documents.filter((d) => d.status !== 'valide').length
  const clientOrg = state.orgs.find((org) => org.id === user.orgId)
  const clientSaasEnabled = clientOrg ? orgHasSaasAccess(state, clientOrg.id, clientOrg.sector) : false

  const accountActivated = state.registrationProfile?.activated ?? true
  const nav = variant === 'admin' ? buildAdminNav() : variant === 'concierge' ? buildConciergeNav() : buildClientNav(unread, pendingDocs, clientSaasEnabled, state.clientWorkspaceRole, state.registrationProfile?.sector ?? clientOrg?.sector, accountActivated)

  return (
    <div className={`workspace-redesign workspace-${variant} flex min-h-screen bg-[#f6f9fd]`}>
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-ink-100 bg-white lg:flex">
        <div className="flex h-16 items-center gap-2.5 border-b border-ink-100 px-5">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/allneeds-icon.svg" alt="" className="h-8 w-8 rounded-lg" />
            <span className="leading-none">
              <span className="block font-display text-sm font-extrabold tracking-tight text-ink-950">all<span className="text-brand-700">needs</span></span>
              <span className="block text-[0.65rem] font-semibold uppercase tracking-widest text-ink-400">
                {variant === 'admin' ? 'Administration' : variant === 'concierge' ? 'Concierge' : 'Espace client'}
              </span>
            </span>
          </Link>
        </div>

        <WorkspaceNavigation items={nav} onNavigate={() => setMobileNavOpen(false)} />

        <div className="border-t border-ink-100 p-3">
          <div className="rounded-xl bg-ink-50 p-3">
            <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-ink-400">{auth.status === 'authenticated' ? 'Données affichées' : 'Démo locale'}</p>
            <p className="mt-1 text-[0.7rem] leading-relaxed text-ink-500">
              {auth.status === 'authenticated' ? 'Session vérifiée. Besoins synchronisés ; missions, devis et autres dossiers encore en démonstration.' : 'Données fictives, partagées entre les espaces et conservées dans ce navigateur.'}
            </p>
            {auth.status !== 'authenticated' ? <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => {
                dispatch({ type: 'RESET' })
                dispatch({ type: 'TOAST_ADD', toast: { title: 'Démonstration réinitialisée', tone: 'info' } })
              }}
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              Réinitialiser la démo
            </Button> : null}
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-ink-100 bg-white/90 px-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button type="button" onClick={() => setMobileNavOpen((open) => !open)} aria-label={mobileNavOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={mobileNavOpen} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-ink-950 text-white lg:hidden">
              {mobileNavOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-950">
                {variant === 'admin' ? 'Administration ALLNEEDS' : variant === 'concierge' ? 'Portefeuille concierge' : (clientOrg?.name ?? 'Espace client')}
              </p>
              <p className="truncate text-xs text-ink-500">
                {variant === 'admin' ? 'Vue interne · gestion des accès' : variant === 'concierge' ? 'Pilotage complet des entreprises attribuées' : clientOrg ? `${clientOrg.kind} · ${clientOrg.city}` : 'Votre espace ALLNEEDS'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden rounded-full border border-ink-200 bg-ink-50 px-3 py-1.5 text-[0.68rem] font-bold uppercase tracking-wider text-ink-600 sm:block">
              {variant === 'admin' ? 'Administrateur' : variant === 'concierge' ? 'Concierge' : 'Client'}
            </div>

            {variant === 'client' ? (
              <Link
                to="/app/messages"
                className="relative rounded-lg p-2 text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
              >
                <Bell className="h-4 w-4" />
                {unread > 0 ? <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" /> : null}
              </Link>
            ) : null}

            <div className="flex items-center gap-2 border-l border-ink-100 pl-2">
              <Avatar name={displayUser.name} size="sm" />
              <div className="hidden leading-tight md:block">
                <p className="text-xs font-semibold text-ink-900">{displayUser.name}</p>
                <p className="text-[0.65rem] text-ink-500">{displayUser.roleLabel}</p>
              </div>
              <ChevronDown className="hidden h-3.5 w-3.5 text-ink-400 md:block" />
            </div>

            <button
              type="button"
              onClick={() => {
                void auth.logout().catch(() => undefined)
                void navigate({ to: '/' })
              }}
              className="rounded-lg p-2 text-ink-400 transition hover:bg-ink-100 hover:text-ink-800"
              title="Retour au site public"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </header>

        {mobileNavOpen ? <div className="fixed inset-0 top-16 z-40 bg-ink-950/30 lg:hidden" onClick={() => setMobileNavOpen(false)}>
          <div className="max-h-[calc(100vh-4rem)] w-full overflow-y-auto border-b border-ink-100 bg-white p-3 shadow-lift" onClick={(event) => event.stopPropagation()}>
            <WorkspaceNavigation items={nav} onNavigate={() => setMobileNavOpen(false)} />
            <Link to="/" onClick={() => setMobileNavOpen(false)} className="mt-3 flex items-center gap-2 rounded-xl border border-ink-100 px-3 py-3 text-sm font-semibold text-ink-700"><LogOut size={16} />Retour à l’accueil ALLNEEDS</Link>
          </div>
        </div> : null}

        <main className="mx-auto flex-1 px-4 py-6 sm:px-6 lg:px-8 w-full max-w-7xl">{children}</main>
      </div>
    </div>
  )
}

function WorkspaceNavigation({ items, onNavigate }: { items: NavItem[]; onNavigate: () => void }) {
  let previousGroup = ''
  return <nav aria-label="Navigation de l’espace" className="flex-1 space-y-1 overflow-y-auto p-3">
    {items.map((item) => {
      const showGroup = item.group !== previousGroup
      previousGroup = item.group
      return <div key={String(item.to)}>
        {showGroup ? <p className="mb-1 mt-4 px-3 text-[0.64rem] font-bold uppercase tracking-[0.14em] text-ink-400 first:mt-1">{item.group}</p> : null}
        {item.disabled ? (
          <div title={item.disabledHint} className="flex cursor-not-allowed items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-300">
            <span className="flex items-center gap-2.5">{item.icon}{item.label}</span>
            <span className="text-[0.62rem] font-bold uppercase tracking-wider text-ink-300">Verrouillé</span>
          </div>
        ) : (
          <Link to={item.to} onClick={onNavigate} className="flex items-center justify-between gap-2 rounded-lg px-3 py-2 text-sm font-medium text-ink-600 transition hover:bg-ink-50 hover:text-ink-950" activeProps={{ className: 'bg-brand-50 text-brand-800 hover:bg-brand-50' }}>
            <span className="flex items-center gap-2.5">{item.icon}{item.label}</span>
            {item.badge ? <span className="rounded-full bg-ink-950 px-1.5 py-0.5 text-[0.62rem] font-bold text-white">{item.badge}</span> : null}
          </Link>
        )}
      </div>
    })}
  </nav>
}

/* ------------------------------------------------------------------ */
/* Page header (used inside app + admin)                               */
/* ------------------------------------------------------------------ */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string
  title: string
  description?: ReactNode
  actions?: ReactNode
  className?: string
}) {
  return (
    <div className={cn('mb-6 flex flex-wrap items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow ? <p className="mb-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-brand-700">{eyebrow}</p> : null}
        <h1 className="font-display text-2xl tracking-tight text-ink-950 sm:text-3xl">{title}</h1>
        {description ? <div className="mt-1.5 max-w-2xl text-sm leading-relaxed text-ink-500">{description}</div> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </div>
  )
}
