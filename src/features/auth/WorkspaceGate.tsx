import { useEffect, type ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { LockKeyhole, ShieldCheck } from 'lucide-react'
import { AppShell } from '@/components/layouts'
import { ExpertShell } from '@/components/ExpertWorkspace'
import { Alert, Button, Card } from '@/components/ui'
import { useAuth } from '@/features/auth/AuthContext'
import { useDemo, type ClientWorkspaceRole, type Role } from '@/store/store'

type Workspace = 'client' | 'admin' | 'concierge' | 'expert'
const DEMO_KEY = 'allneeds.demoRole'

function demoRole(): Workspace | null {
  try {
    const value = sessionStorage.getItem(DEMO_KEY)
    return value === 'client' || value === 'admin' || value === 'concierge' || value === 'expert' ? value : null
  } catch { return null }
}

export function WorkspaceGate({ workspace, children }: { workspace: Workspace; children: ReactNode }) {
  const auth = useAuth()
  const { state, setRole, dispatch } = useDemo()
  const currentDemoRole = demoRole()
  const realRole = auth.user?.role
  const roleMatches = workspace === 'admin'
    ? realRole === 'admin'
    : workspace === 'concierge'
      ? realRole === 'concierge'
      : workspace === 'expert'
        ? realRole === 'prestataire'
        : ['dirigeant', 'manager', 'collaborateur'].includes(realRole || '')
  const role = (['dirigeant', 'manager', 'collaborateur', 'prestataire'].includes(realRole || '') ? 'client' : realRole) as Role | undefined
  const workspaceRole: ClientWorkspaceRole = realRole === 'manager' || realRole === 'collaborateur'
    ? realRole
    : auth.status === 'authenticated' ? 'dirigeant' : state.clientWorkspaceRole
  const expectedDemoUser = workspace === 'admin' ? 'admin-nada' : workspace === 'concierge' ? 'conc-001' : workspace === 'expert' ? 'provider-atlas' : undefined
  const expectedAuthUserId = auth.user?.id
  const expectedUserId = expectedAuthUserId ?? expectedDemoUser
  const expectedStoreRole = workspace === 'expert' ? 'client' : role ?? workspace
  const storeAligned = state.role === expectedStoreRole && (!expectedUserId || state.userId === expectedUserId) && (workspace !== 'client' || state.clientWorkspaceRole === workspaceRole)

  useEffect(() => {
    if (auth.status !== 'authenticated' || !auth.user || !roleMatches || !role) return
    setRole(role)
    dispatch({ type: 'SWITCH_USER', userId: auth.user.id })
    if (workspace === 'client') dispatch({ type: 'CLIENT_WORKSPACE_ROLE_SET', role: workspaceRole })
  }, [auth.status, auth.user?.id, role, roleMatches, setRole, dispatch, workspace, workspaceRole])

  if (auth.status === 'loading') return <GateMessage title="Vérification de votre session" detail="Nous vérifions votre accès avant d’ouvrir cet espace." />

  if (auth.status === 'authenticated') {
    if (!roleMatches) return <GateMessage title="Cet espace n’est pas autorisé pour votre compte" detail="Connectez-vous avec un compte ayant le rôle correspondant, ou revenez à l’accueil." />
    if (!storeAligned) return <GateMessage title="Ouverture de votre espace" detail="Votre profil est vérifié. Préparation de l’interface…" />
    const notice = <Alert tone="info" title="Session vérifiée · besoins synchronisés">
      Les besoins et leurs étapes sont partagés avec les profils autorisés de l’entreprise. Les missions, devis, prestataires, diagnostics et indicateurs affichés ailleurs restent à raccorder au serveur.
    </Alert>
    return workspace === 'expert'
      ? <ExpertShell>{notice}{children}</ExpertShell>
      : <AppShell variant={workspace}>{notice}{children}</AppShell>
  }

  if (currentDemoRole === workspace && storeAligned) {
    const notice = <Alert tone="info" title="Démonstration locale · données fictives">
      Cet espace illustre les parcours ALLNEEDS. Les actions et données sont conservées uniquement dans ce navigateur.
    </Alert>
    return workspace === 'expert'
      ? <ExpertShell>{notice}{children}</ExpertShell>
      : <AppShell variant={workspace}>{notice}{children}</AppShell>
  }

  return <GateMessage title="Connectez-vous pour accéder à cet espace" detail="Les espaces client, concierge, prestataire et administration sont protégés. Vous pouvez vous connecter ou choisir un profil explicitement présenté comme une démonstration.">
    <Link to="/connexion"><Button>Connexion ou démonstration</Button></Link>
  </GateMessage>
}

function GateMessage({ title, detail, children }: { title: string; detail: string; children?: ReactNode }) {
  return <div className="flex min-h-screen items-center justify-center bg-[#f6f9fd] p-5">
    <Card className="max-w-xl p-8 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><ShieldCheck className="h-6 w-6" /></div>
      <LockKeyhole className="mx-auto mt-4 h-5 w-5 text-ink-400" />
      <h1 className="mt-3 font-display text-2xl text-ink-950">{title}</h1>
      <p className="mt-3 text-sm leading-relaxed text-ink-600">{detail}</p>
      <div className="mt-6 flex justify-center">{children ?? <Link to="/"><Button variant="outline">Retour à l’accueil</Button></Link>}</div>
    </Card>
  </div>
}
