import { useState } from 'react'
import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { ACCESS_OFFERS, SECTOR_LABEL, SECTOR_ORDER } from '@/data/catalog'
import { useDemo } from '@/store/store'
import { useAuth } from '@/features/auth/AuthContext'
import { AuthLayout } from '@/components/AuthLayout'
import { Alert, Button, Card, Checkbox, Field, Input, Select, Steps } from '@/components/ui'
import { cn } from '@/lib/utils'
import type { AccessTier, Sector } from '@/types'

export const Route = createFileRoute('/inscription')({
  validateSearch: (search: Record<string, unknown>): { offre?: AccessTier | null } => {
    const value = search.offre ? String(search.offre).toUpperCase() : null
    const valid = ACCESS_OFFERS.some((o) => o.tier === value)
    return { offre: valid ? (value as AccessTier) : null }
  },
  component: InscriptionPage,
  head: () => ({
    meta: [
      { title: 'Créer un compte — ALLNEEDS' },
      { name: 'description', content: 'Créez votre compte ALLNEEDS, choisissez votre secteur et votre espace métier.' },
    ],
  }),
})

const STEP_LABELS = ['Votre établissement', 'Votre contact', 'Votre créneau', 'Récapitulatif']
const APPOINTMENT_SLOTS = ['09:00 – 10:30', '10:00 – 11:30', '14:00 – 15:30', '16:00 – 17:30']

const WORKSPACE_PROFILES: Record<Sector, { value: string; label: string; description: string }[]> = {
  enseignement: [
    { value: 'ecole', label: 'École / établissement scolaire', description: 'Inscriptions, élèves, familles, équipe et paiements.' },
    { value: 'creche', label: 'Crèche / maternelle', description: 'Admissions, familles, présence, équipe et facturation.' },
    { value: 'formation', label: 'Centre de formation', description: 'Inscriptions, sessions, apprenants, formateurs et règlements.' },
  ],
  sante: [
    { value: 'cabinet', label: 'Cabinet', description: 'Patients, rendez-vous, praticiens, paiements et charges.' },
    { value: 'centre', label: 'Centre de santé', description: 'Accueil, planning multi-praticiens, équipe, paiements et suivi.' },
    { value: 'laboratoire', label: 'Laboratoire', description: 'Accueil, dossiers, équipe, encaissements et organisation.' },
  ],
  tourisme: [
    { value: 'hebergement', label: 'Hébergement', description: 'Réservations, chambres, check-in/out, ménage et paiements.' },
    { value: 'restauration', label: 'Restauration', description: 'Tables, menus, ingrédients, stock, commandes et caisse.' },
    { value: 'activites', label: 'Activités', description: 'Planning, capacités, réservations, participants et paiements.' },
    { value: 'transport', label: 'Transport', description: 'Véhicules, chauffeurs, trajets, réservations et disponibilités.' },
    { value: 'agence', label: 'Agence de voyage', description: 'Dossiers, voyageurs, hébergement, repas, activités, transport et marge.' },
  ],
}

export function InscriptionPage() {
  const { offre: offreFromUrl } = Route.useSearch()
  const navigate = useNavigate()
  const auth = useAuth()
  const { dispatch } = useDemo()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    situation: 'entreprise_existante' as 'entreprise_existante'|'creation'|'investisseur', org: '', kind: '', sector: 'enseignement' as Sector, workspaceProfile: 'ecole', city: '', size: '',
    name: '', role: '', email: '', phone: '', appointmentDate: '', appointmentSlot: APPOINTMENT_SLOTS[0], appointmentFormat: 'visio' as 'sur_site'|'visio'|'telephone', accept: false,
  })
  const [error, setError] = useState('')

  function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) { setForm((v) => ({ ...v, [key]: value })) }
  function setSector(sector: Sector) { setForm((v) => ({ ...v, sector, workspaceProfile: WORKSPACE_PROFILES[sector][0].value })) }
  function validate(current: number) {
    if (current === 0 && !form.org.trim()) return 'Indiquez le nom de votre établissement.'
    if (current === 1 && (!form.name.trim() || !form.email.includes('@'))) return 'Nom et adresse e-mail valides sont nécessaires.'
    if (current === 2 && !form.appointmentDate) return 'Choisissez la date de votre rendez-vous.'
    if (current === 3 && !form.accept) return 'Vous devez accepter les conditions.'
    return ''
  }
  function next() { const m=validate(step); if(m){setError(m);return}; setError(''); setStep((v)=>Math.min(v+1, STEP_LABELS.length-1)) }
  async function submit() {
    const m=validate(3); if(m){setError(m);return}
    await auth.logout().catch(() => undefined)
    try { sessionStorage.setItem('allneeds.demoRole', 'client') } catch {
      setError('Le parcours de démonstration nécessite le stockage de session du navigateur.')
      return
    }
    dispatch({ type: 'RESET' })
    dispatch({ type: 'REGISTRATION_SET', profile: { sector: form.sector, workspaceProfile: form.workspaceProfile, situation: form.situation, tier: null, payment: null, activated: false, orgName: form.org, contactName: form.name, appointmentDate: form.appointmentDate, appointmentSlot: form.appointmentSlot } })
    dispatch({ type: 'BOOKING_CREATE', booking: { at: `${form.appointmentDate}T${form.appointmentSlot.split(' – ')[0]}:00.000Z`, org: form.org, name: form.name, role: form.role, email: form.email, phone: form.phone, sector: form.sector, city: form.city, headcount: form.size, date: form.appointmentDate, slot: form.appointmentSlot, format: form.appointmentFormat, topic: 'Rendez-vous choisi pendant la création du compte' } })
    dispatch({ type: 'SET_ONBOARDED', value: false })
    navigate({ to: '/onboarding' })
  }

  return <AuthLayout
    title="Commençons par votre réalité."
    subtitle="Quelques repères pour préparer votre échange et vous orienter vers le bon parcours."
    footer={<>Déjà client ? <Link to="/connexion" className="font-semibold text-brand-700">Se connecter</Link></>}
  >
    <Alert tone="warning" title="Aperçu de démonstration">Cette version ne transmet pas votre demande à l’équipe et ne réserve pas réellement de rendez-vous. Les informations saisies restent dans ce navigateur.</Alert>
    <Steps steps={STEP_LABELS} current={step} className="mb-8" />
    <div className="space-y-5">
      {step===0 ? <>
        <div><p className="mb-2 text-sm font-semibold text-ink-900">Où en êtes-vous aujourd’hui ?</p><p className="mb-3 text-sm leading-6 text-ink-500">Choisissez le contexte qui ressemble le plus à votre situation.</p><div className="grid gap-3 sm:grid-cols-3">{[{value:'entreprise_existante',label:'Mon activité existe',desc:'Mieux organiser, résoudre, développer.'},{value:'creation',label:'Je prépare un projet',desc:'Poser des bases solides, étape par étape.'},{value:'investisseur',label:'J’étudie une opportunité',desc:'Évaluer le projet et les besoins.'}].map((item)=><button key={item.value} type="button" onClick={()=>set('situation',item.value as typeof form.situation)} className={cn('rounded-2xl border p-4 text-left transition',form.situation===item.value?'border-brand-600 bg-brand-50 shadow-sm':'border-ink-200 bg-white hover:border-brand-300')}><p className="text-sm font-semibold text-ink-950">{item.label}</p><p className="mt-1 text-xs leading-5 text-ink-500">{item.desc}</p></button>)}</div></div>
        <Field label="Nom de l’établissement" required><Input value={form.org} onChange={(e)=>set('org',e.target.value)} placeholder="École Al Amal" /></Field>
        <Field label="Type de structure" hint="École privée, crèche, clinique, hôtel…"><Input value={form.kind} onChange={(e)=>set('kind',e.target.value)} placeholder="École privée" /></Field>
        <div className="grid gap-5 sm:grid-cols-3">
          <Field label="Secteur"><Select value={form.sector} onChange={(e)=>setSector(e.target.value as Sector)}>{SECTOR_ORDER.map((sector)=><option key={sector} value={sector}>{SECTOR_LABEL[sector]}</option>)}</Select></Field>
          <Field label="Ville"><Input value={form.city} onChange={(e)=>set('city',e.target.value)} placeholder="Casablanca" /></Field>
          <Field label="Effectif"><Input value={form.size} onChange={(e)=>set('size',e.target.value)} placeholder="18 salariés" /></Field>
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-ink-900">Quel type d’établissement dirigez-vous ?</p>
          <p className="mb-3 text-sm leading-6 text-ink-500">Cela nous aide à adapter la conversation à votre métier.</p>
          <div className="grid gap-3 sm:grid-cols-2">{WORKSPACE_PROFILES[form.sector].map((profile)=><button key={profile.value} type="button" onClick={()=>set('workspaceProfile',profile.value)} className={cn('rounded-xl border p-4 text-left transition', form.workspaceProfile===profile.value?'border-brand-600 bg-brand-50':'border-ink-200 hover:border-ink-400')}><p className="text-sm font-semibold text-ink-950">{profile.label}</p><p className="mt-1 text-xs leading-relaxed text-ink-500">{profile.description}</p></button>)}</div>
        </div>
        <Alert tone="info">Nous ne demandons aucune donnée nominative d’élève, de patient ou de client pour ce premier échange.</Alert>
      </> : null}
      {step===1 ? <>
        <div className="grid gap-5 sm:grid-cols-2"><Field label="Votre nom" required><Input value={form.name} onChange={(e)=>set('name',e.target.value)} placeholder="Amina Bennani" /></Field><Field label="Votre fonction"><Input value={form.role} onChange={(e)=>set('role',e.target.value)} placeholder="Directrice" /></Field></div>
        <Field label="Adresse e-mail" required><Input type="email" value={form.email} onChange={(e)=>set('email',e.target.value)} placeholder="vous@etablissement.ma" /></Field>
        <Field label="Téléphone" hint="Utilisé pour les rendez-vous et WhatsApp."><Input value={form.phone} onChange={(e)=>set('phone',e.target.value)} placeholder="+212 6 ..." /></Field>
        <Alert tone="info">STARTER reste le diagnostic de lancement. CONNECT, PLUS et PRIORITÉ sont proposés séparément dans votre compte, selon les conditions de la fiche ALLNEEDS ACCÈS.</Alert>
      </> : null}
      {step===2 ? <>
        <Alert tone="info">Dans cette démonstration, le créneau est fictif et ne réserve pas de rendez-vous. Le parcours montre les informations utiles à une future prise de contact.</Alert>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Date du rendez-vous" required><Input type="date" value={form.appointmentDate} onChange={(e)=>set('appointmentDate',e.target.value)} /></Field>
          <Field label="Heure" required><Select value={form.appointmentSlot} onChange={(e)=>set('appointmentSlot',e.target.value)}>{APPOINTMENT_SLOTS.map((slot)=><option key={slot} value={slot}>{slot}</option>)}</Select></Field>
        </div>
        <Field label="Format du rendez-vous"><Select value={form.appointmentFormat} onChange={(e)=>set('appointmentFormat',e.target.value as typeof form.appointmentFormat)}><option value="visio">Visio</option><option value="sur_site">Sur site</option><option value="telephone">Téléphone</option></Select></Field>
      </> : null}
      {step===3 ? <>
        <Card className="p-5"><p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Récapitulatif</p><dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4"><dt className="text-ink-500">Situation</dt><dd className="font-medium text-ink-900">{form.situation==='creation'?'Entreprise en création':form.situation==='investisseur'?'Investisseur':'Entreprise existante'}</dd></div><div className="flex justify-between gap-4"><dt className="text-ink-500">Établissement</dt><dd className="font-medium text-ink-900">{form.org}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-500">Secteur</dt><dd className="font-medium text-ink-900">{SECTOR_LABEL[form.sector]}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-500">Espace métier</dt><dd className="text-right font-medium text-ink-900">{WORKSPACE_PROFILES[form.sector].find((x)=>x.value===form.workspaceProfile)?.label}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-500">Contact</dt><dd className="text-right font-medium text-ink-900">{form.name}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-500">Rendez-vous</dt><dd className="text-right font-medium text-ink-900">{form.appointmentDate} · {form.appointmentSlot}</dd></div>
          <div className="flex justify-between gap-4"><dt className="text-ink-500">ALLNEEDS ACCÈS</dt><dd className="text-right font-medium text-ink-900">À choisir après création du compte</dd></div>
        </dl></Card>
        {offreFromUrl ? <Alert tone="info">Vous avez consulté la formule {offreFromUrl}. Elle ne sera pas activée automatiquement : vous la confirmerez depuis votre compte.</Alert> : null}
        <Checkbox checked={form.accept} onChange={(e)=>set('accept',e.target.checked)} label="J’accepte les conditions et la politique de confidentialité." />
      </> : null}
      {error ? <Alert tone="danger">{error}</Alert> : null}
      <div className="flex items-center justify-between gap-3 border-t border-ink-100 pt-5"><Button variant="ghost" onClick={()=>setStep((v)=>Math.max(0,v-1))} disabled={step===0}>Retour</Button>{step<STEP_LABELS.length-1?<Button onClick={next}>Continuer <ArrowRight className="h-4 w-4" /></Button>:<Button onClick={submit}>Voir la démonstration <ArrowRight className="h-4 w-4" /></Button>}</div>
    </div>
  </AuthLayout>
}
