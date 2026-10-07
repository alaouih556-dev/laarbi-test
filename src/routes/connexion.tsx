import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight, Building2, Eye, EyeOff, KeyRound, ShieldCheck, UserRoundCog } from 'lucide-react'
import { AuthLayout } from '@/components/AuthLayout'
import { Alert, Button, Card, Field, Input } from '@/components/ui'
import { useAuth } from '@/features/auth/AuthContext'
import { useDemo, type ClientWorkspaceRole } from '@/store/store'

export const Route = createFileRoute('/connexion')({
  component: ConnexionPage,
  head: () => ({ meta: [{ title: 'Connexion — ALLNEEDS' }] }),
})

const DEMO_ACCOUNTS = [
  { role: 'client' as const, workspaceRole: 'dirigeant' as const, userId: 'usr-amina', title: 'Client · Enseignement', target: '/app' as const, icon: Building2, desc: 'Suivre les priorités d’une école.' },
  { role: 'client' as const, workspaceRole: 'dirigeant' as const, userId: 'usr-youssef', title: 'Client · Santé', target: '/app' as const, icon: Building2, desc: 'Explorer le parcours d’un centre de santé.' },
  { role: 'client' as const, workspaceRole: 'dirigeant' as const, userId: 'usr-salma', title: 'Client · Tourisme', target: '/app' as const, icon: Building2, desc: 'Voir le suivi d’un établissement touristique.' },
  { role: 'client' as const, workspaceRole: 'manager' as const, userId: 'usr-manager', title: 'Équipe · Responsable', target: '/app' as const, icon: Building2, desc: 'Ouvrir un profil équipe aux droits limités.' },
  { role: 'client' as const, workspaceRole: 'collaborateur' as const, userId: 'usr-collab', title: 'Équipe · Collaborateur', target: '/app' as const, icon: Building2, desc: 'Ouvrir un profil collaborateur.' },
  { role: 'concierge' as const, workspaceRole: null, userId: 'conc-001', title: 'Concierge ALLNEEDS', target: '/concierge' as const, icon: UserRoundCog, desc: 'Explorer le suivi des entreprises attribuées.' },
  { role: 'expert' as const, workspaceRole: null, userId: 'provider-atlas', title: 'Prestataire · Partenaire', target: '/expert' as const, icon: Building2, desc: 'Explorer les demandes et missions côté partenaire.' },
  { role: 'admin' as const, workspaceRole: null, userId: 'admin-nada', title: 'Administration', target: '/admin' as const, icon: ShieldCheck, desc: 'Explorer le pilotage interne ALLNEEDS.' },
]

function ConnexionPage() {
  const navigate = useNavigate()
  const auth = useAuth()
  const { setRole, dispatch } = useDemo()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [showRecoveryNote, setShowRecoveryNote] = useState(false)

  async function openDemo(account: typeof DEMO_ACCOUNTS[number]) {
    setError('')
    await auth.logout().catch(() => undefined)
    try { sessionStorage.setItem('allneeds.demoRole', account.role) } catch {
      setError('La session de démonstration nécessite le stockage de session du navigateur.')
      return
    }
    setRole(account.role === 'expert' ? 'client' : account.role)
    dispatch({ type: 'SWITCH_USER', userId: account.userId })
    if (account.workspaceRole) dispatch({ type: 'CLIENT_WORKSPACE_ROLE_SET', role: account.workspaceRole as ClientWorkspaceRole })
    await navigate({ to: account.target })
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      const account = await auth.login(email, password)
      const destination = account.role === 'admin' ? '/admin' : account.role === 'concierge' ? '/concierge' : account.role === 'prestataire' ? '/expert' : ['dirigeant', 'manager', 'collaborateur'].includes(account.role) ? '/app' : null
      if (!destination) throw new Error('Ce rôle ne dispose pas encore d’un espace accessible dans l’interface.')
      const appRole = account.role === 'admin' ? 'admin' : account.role === 'concierge' ? 'concierge' : 'client'
      dispatch({ type: 'RESET' })
      setRole(appRole)
      dispatch({ type: 'SWITCH_USER', userId: account.id })
      if (appRole === 'client') dispatch({ type: 'CLIENT_WORKSPACE_ROLE_SET', role: account.role === 'manager' ? 'manager' : account.role === 'collaborateur' ? 'collaborateur' : 'dirigeant' })
      await navigate({ to: destination })
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'La connexion a échoué. Réessayez.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout
      title="Entrez dans l’espace ALLNEEDS"
      subtitle="Connectez-vous à votre compte. Pour parcourir l’interface, ouvrez séparément une démonstration locale."
      footer={<>Pas encore de compte client ? <Link to="/inscription" className="font-semibold text-brand-700">Faire une demande</Link></>}
      wide
    >
      <form onSubmit={submit} className="space-y-5">
        <Field label="Adresse e-mail" required>
          <Input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="vous@entreprise.ma" required />
        </Field>
        <Field label="Mot de passe" required>
          <div className="relative">
            <Input type={show ? 'text' : 'password'} autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="pr-10" required />
            <button type="button" onClick={() => setShow((visible) => !visible)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-400 hover:bg-ink-100" aria-label={show ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>
        <div className="flex justify-end">
          <button type="button" onClick={() => setShowRecoveryNote((visible) => !visible)} className="text-xs font-semibold text-brand-700">Mot de passe oublié ?</button>
        </div>
        {showRecoveryNote ? <Alert tone="info" title="Réinitialisation non disponible">La récupération par e-mail n’est pas encore raccordée. Contactez l’administrateur ALLNEEDS pour réinitialiser votre accès.</Alert> : null}
        {error ? <Alert tone="danger">{error}</Alert> : null}
        <Button type="submit" size="lg" fullWidth disabled={busy}>{busy ? 'Vérification…' : 'Se connecter'} <ArrowRight className="h-4 w-4" /></Button>
      </form>

      <div className="my-8 flex items-center gap-3" aria-hidden="true"><span className="h-px flex-1 bg-ink-100"/><span className="text-[10px] font-bold uppercase tracking-[0.16em] text-ink-400">Ou explorer une démo</span><span className="h-px flex-1 bg-ink-100"/></div>
      <div className="mb-4 flex items-start gap-3 rounded-xl border border-sky-100 bg-sky-50 p-4">
        <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
        <p className="text-xs leading-relaxed text-ink-600">Démonstration locale : profils et données fictifs, enregistrés dans ce navigateur. Ces boutons n’ouvrent aucun compte réel.</p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {DEMO_ACCOUNTS.map((account) => (
          <button key={account.userId} type="button" onClick={() => void openDemo(account)} className="group min-h-28 rounded-2xl border border-ink-200 bg-white p-4 text-left transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500">
            <account.icon className="h-5 w-5 text-brand-700" />
            <p className="mt-3 text-sm font-bold text-ink-950">{account.title}</p>
            <p className="mt-1 text-xs leading-relaxed text-ink-500">{account.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-brand-700">Ouvrir la démo <ArrowRight size={13}/></span>
          </button>
        ))}
      </div>
      <Card className="mt-6 p-4"><p className="text-xs leading-relaxed text-ink-500">Pour ouvrir une vraie session, l’administrateur doit avoir créé votre compte et défini votre mot de passe. Les données métier de cette interface restent encore en démonstration tant que leur raccordement serveur n’est pas terminé.</p></Card>
    </AuthLayout>
  )
}
