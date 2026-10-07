import { useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, BriefcaseBusiness, CheckCircle2, CircleAlert, Clock3, FileCheck2, Handshake, Search, UsersRound } from 'lucide-react'
import { ConciergeGuard, ConciergeHeading, OrgIdentity, ScopedEmpty } from '@/features/concierge/ScopedSection'
import { conciergeScope, useDemo } from '@/store/store'
import { useAuth } from '@/features/auth/AuthContext'
import { useOperationalNeeds } from '@/features/operations/useOperationalNeeds'
import { Alert, Badge, Button, Card, Progress, Select } from '@/components/ui'
import { NEED_FLOW, NEED_STATUS, URGENCY } from '@/lib/status'
import type { Need, NeedStatus } from '@/types'

export const Route = createFileRoute('/concierge/besoins')({ component: ConciergeNeeds })

type Filter = 'a_suivre' | 'urgents' | 'decision' | 'tous'

function phase(status: NeedStatus) {
  if (status === 'recu' || status === 'analyse') return 0
  if (status === 'recherche') return 1
  if (status === 'propositions' || status === 'devis' || status === 'negociation') return 2
  return 3
}

function guidance(need: Need) {
  if (need.status === 'recu') return { title: 'Clarifier la demande avec le client', detail: 'Confirmer le besoin, la date souhaitée et ce qui fera une solution adaptée.', client: 'Une demande bien cadrée, sans mauvaise surprise.', allneeds: 'Une mission cadrée que le bon prestataire peut chiffrer.', action: 'Contacter le client' }
  if (need.status === 'analyse') return { title: 'Valider le périmètre et le délai', detail: 'Vérifier que la demande et les critères de choix sont compris avant la recherche.', client: 'Des propositions qui répondent à son vrai besoin.', allneeds: 'Une comparaison plus pertinente et un meilleur suivi.', action: 'Vérifier le cadrage' }
  if (need.status === 'recherche') return { title: 'Trouver et qualifier les prestataires', detail: `${need.candidateIds.length} prestataire${need.candidateIds.length > 1 ? 's' : ''} déjà lié${need.candidateIds.length > 1 ? 's' : ''} au dossier. Vérifier la disponibilité et l’adéquation.`, client: 'Des options sérieuses et adaptées à son activité.', allneeds: 'Une mise en relation suivie, avec des critères vérifiables.', action: 'Suivre la recherche' }
  if (need.status === 'propositions') return { title: 'Présenter les options et obtenir un choix', detail: `${need.candidateIds.length} prestataire${need.candidateIds.length > 1 ? 's' : ''} proposé${need.candidateIds.length > 1 ? 's' : ''} · ${need.quoteIds.length} devis associé${need.quoteIds.length > 1 ? 's' : ''}.`, client: 'Comprendre les options avant d’engager son budget.', allneeds: 'Une décision tracée et une demande qui avance.', action: 'Faire le point sur les propositions' }
  if (need.status === 'devis') return { title: 'Aider le client à comparer les devis', detail: `${need.quoteIds.length} devis reçu${need.quoteIds.length > 1 ? 's' : ''}. Comparer périmètre, délai et coût avec les critères convenus.`, client: 'Choisir en connaissance de cause, sans comparer seulement le prix.', allneeds: 'Une décision mieux comprise et un suivi commercial clair.', action: 'Préparer la comparaison' }
  if (need.status === 'negociation') return { title: 'Sécuriser les derniers points', detail: 'Confirmer les conditions, le périmètre et la prochaine date de suivi.', client: 'Un accord clair avant de démarrer.', allneeds: 'Un dossier documenté et une transition vers l’exécution.', action: 'Suivre la négociation' }
  if (need.status === 'signe') return { title: 'Organiser le démarrage et vérifier le résultat', detail: 'Confirmer le lancement, le responsable et la première échéance.', client: 'Savoir qui intervient et à quoi s’attendre.', allneeds: 'Une mission qui tient la promesse faite au client.', action: 'Confirmer le démarrage' }
  return { title: 'Faire le bilan du dossier', detail: 'Noter le résultat et les suites éventuelles.', client: 'Une demande clôturée avec un retour clair.', allneeds: 'Un historique utile pour améliorer le service.', action: 'Consulter le bilan' }
}

function ConciergeNeeds() {
  const { state, dispatch } = useDemo()
  const auth = useAuth()
  const operations = useOperationalNeeds(state.needs)
  const demoScope = conciergeScope(state)
  const liveOrgIds = new Set(auth.user?.orgIds ?? [])
  const { orgs } = demoScope
  const orgIds = auth.status === 'authenticated' ? liveOrgIds : demoScope.orgIds
  const [filter, setFilter] = useState<Filter>('a_suivre')
  const [query, setQuery] = useState('')
  const items = useMemo(() => operations.needs.filter((need) => orgIds.has(need.orgId)), [operations.needs, orgIds])
  const urgent = items.filter((need) => need.urgency === 'haute' && !['signe', 'clos'].includes(need.status))
  const waitingDecision = items.filter((need) => ['propositions', 'devis', 'negociation'].includes(need.status))
  const active = items.filter((need) => !['signe', 'clos'].includes(need.status))
  const visible = useMemo(() => items.filter((need) => {
    if (filter === 'a_suivre' && ['signe', 'clos'].includes(need.status)) return false
    if (filter === 'urgents' && need.urgency !== 'haute') return false
    if (filter === 'decision' && !['propositions', 'devis', 'negociation'].includes(need.status)) return false
    const company = orgs.find((org) => org.id === need.orgId)?.name ?? ''
    return `${company} ${need.title} ${need.categoryLabel}`.toLowerCase().includes(query.toLowerCase())
  }).sort((a, b) => Number(b.urgency === 'haute') - Number(a.urgency === 'haute') || phase(b.status) - phase(a.status) || a.submittedAt.localeCompare(b.submittedAt)), [items, filter, query, orgs])

  return <ConciergeGuard><div className="concierge-needs-page">
    <ConciergeHeading eyebrow="Votre rôle : faire le lien" title="De la demande client à une solution suivie." description="Votre travail ne s’arrête pas au changement de statut : vous cadrez, coordonnez et relancez jusqu’à une décision puis un démarrage clair."/>

    {operations.live ? <Alert tone="info" className="mb-4" title="Dossiers synchronisés">Les besoins et changements d’étape sont partagés avec l’entreprise et l’administration. Les prestataires, devis et missions restent à raccorder.</Alert> : null}
    {operations.loading ? <Alert tone="info" className="mb-4" title="Actualisation de la file">Chargement des dossiers du serveur…</Alert> : null}
    {operations.error ? <Alert tone="danger" className="mb-4" title="Chargement des besoins impossible">{operations.error}</Alert> : null}
    <section className="concierge-value-chain"><article><span><UsersRound size={18}/></span><div><small>POUR LE CLIENT</small><strong>Une demande comprise et suivie</strong><p>Il sait où en est son besoin, quelles options existent et quel est le prochain pas.</p></div></article><i><ArrowRight size={16}/></i><article><span><BriefcaseBusiness size={18}/></span><div><small>VOTRE RÔLE</small><strong>Coordonner et débloquer</strong><p>Vous gardez le lien, vérifiez les étapes et alertez quand une décision manque.</p></div></article><i><ArrowRight size={16}/></i><article><span><CheckCircle2 size={18}/></span><div><small>POUR ALLNEEDS</small><strong>Un service qui tient sa promesse</strong><p>Les besoins avancent, les décisions sont tracées et la relation client reste claire.</p></div></article></section>

    <section className="concierge-needs-summary"><article className={urgent.length ? 'is-alert' : ''}><CircleAlert size={18}/><strong>{urgent.length}</strong><span>besoin{urgent.length === 1 ? '' : 's'} urgent{urgent.length === 1 ? '' : 's'}</span></article><article><Handshake size={18}/><strong>{waitingDecision.length}</strong><span>en attente d’une décision</span></article><article><Clock3 size={18}/><strong>{active.length}</strong><span>à accompagner jusqu’au résultat</span></article><div><FileCheck2 size={16}/><span>Objectif concierge : une prochaine étape claire pour chaque dossier ouvert.</span></div></section>

    <div className="concierge-needs-toolbar"><div><small>VOTRE FILE DE SUIVI</small><h2>À traiter dans cet ordre</h2><p>Urgence déclarée d’abord, puis dossiers proches d’une décision.</p></div><div className="concierge-needs-search"><Search size={16}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Entreprise ou besoin" aria-label="Rechercher une entreprise ou un besoin"/></div></div>
    <div className="concierge-needs-filters">{([['a_suivre', 'À suivre'], ['urgents', `Urgents (${urgent.length})`], ['decision', `Décision (${waitingDecision.length})`], ['tous', `Tous (${items.length})`]] as const).map(([key, label]) => <button type="button" key={key} className={filter === key ? 'is-active' : ''} onClick={() => setFilter(key)}>{label}</button>)}</div>

    <div className="concierge-needs-list">{visible.map((item) => {
      const company = orgs.find((org) => org.id === item.orgId)
      const status = NEED_STATUS[item.status]
      const urgency = URGENCY[item.urgency]
      const next = guidance(item)
      const index = phase(item.status)
      return <Card key={item.id} className={`concierge-need-card ${item.urgency === 'haute' && !['signe','clos'].includes(item.status) ? 'is-urgent' : ''}`}>
        <div className="concierge-need-head"><div><OrgIdentity orgId={item.orgId}/><h3>{item.title}</h3><p>{item.categoryLabel} · {item.location}</p></div><div className="concierge-need-badges"><Badge tone={urgency.tone}>{urgency.label === 'Haute' && !['signe','clos'].includes(item.status) ? 'À traiter en priorité' : urgency.label}</Badge><Badge tone={status.tone}>{status.label}</Badge></div></div>
        <div className="concierge-need-flow" aria-label="Avancement de la demande">{['Cadrer', 'Rechercher', 'Choisir', 'Démarrer'].map((step, stepIndex) => <div key={step} className={stepIndex < index ? 'is-done' : stepIndex === index ? 'is-current' : ''}><span>{stepIndex < index ? <CheckCircle2 size={13}/> : String(stepIndex + 1).padStart(2, '0')}</span><small>{step}</small></div>)}</div>
        <div className="concierge-need-work"><div className="concierge-next-work"><small>VOTRE PROCHAIN GESTE</small><strong>{next.title}</strong><p>{next.detail}</p></div><div className="concierge-outcome-pair"><div><small>LE CLIENT Y GAGNE</small><p>{next.client}</p></div><div><small>ALLNEEDS Y GAGNE</small><p>{next.allneeds}</p></div></div></div>
        <div className="concierge-need-footer"><div><strong>{company?.contactName ?? 'Contact à confirmer'}</strong><small>{item.assignedTo ? `Suivi interne : ${item.assignedTo}` : 'Suivi interne à attribuer'}</small><small>{operations.live ? 'Prestataires et devis à raccorder' : `${item.candidateIds.length} prestataire${item.candidateIds.length === 1 ? '' : 's'} · ${item.quoteIds.length} devis`}</small></div><div className="concierge-need-actions"><Select aria-label={`Mettre à jour l’étape de ${item.title}`} value={item.status} onChange={(event) => { const status = event.target.value as NeedStatus; const label = `Étape mise à jour par le concierge : ${NEED_STATUS[status].label}`; if (auth.status === 'authenticated') void operations.setStatus(item.id, status, label).catch((cause) => dispatch({ type: 'TOAST_ADD', toast: { title: 'Étape non enregistrée', description: cause instanceof Error ? cause.message : 'Réessayez.', tone: 'warning' } })); else dispatch({ type: 'NEED_SET_STATUS', id: item.id, status, label }) }}>{[...NEED_FLOW, 'clos' as const].map((value) => <option key={value} value={value}>{NEED_STATUS[value].label}</option>)}</Select><Link to={'/concierge/entreprises/$id' as any} params={{ id: item.orgId } as any}>{next.action} <ArrowRight size={14}/></Link></div></div>
      </Card>
    })}{!visible.length ? <ScopedEmpty/> : null}</div>
  </div></ConciergeGuard>
}
