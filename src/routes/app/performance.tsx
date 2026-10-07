import { useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, CircleAlert, FileCheck2, Gauge, Search, Target } from 'lucide-react'
import { PageHeader } from '@/components/layouts'
import { useDemo } from '@/store/store'
import { missionProgress, buildNextActions } from '@/lib/operational'
import { NextActionCard } from '@/components/OperationalUX'
import { Badge, Input, Progress, Select, type Tone } from '@/components/ui'
import { DOC_STATUS, MISSION_STATUS, NEED_FLOW, NEED_STATUS } from '@/lib/status'

type ResultKind = 'Mission' | 'Besoin' | 'Document'
type ResultRow = { id: string; kind: ResultKind; title: string; status: string; tone: Tone; progress: number; next: string; deadline: string | null; to: string; complete: boolean; priority: number }

export const Route = createFileRoute('/app/performance')({ component: PerformancePage })

function PerformancePage() {
  const { state, orgId } = useDemo()
  const [query, setQuery] = useState('')
  const [kindFilter, setKindFilter] = useState('tous')
  const [viewFilter, setViewFilter] = useState('ouverts')
  const needs = state.needs.filter((need) => need.orgId === orgId)
  const missions = state.missions.filter((mission) => mission.orgId === orgId)
  const documents = state.documents.filter((document) => document.orgId === orgId)
  const pendingDocuments = documents.filter((document) => document.required && document.status !== 'valide')
  const openNeeds = needs.filter((need) => !['clos', 'signe'].includes(need.status))
  const activeMissions = missions.filter((mission) => mission.status !== 'terminee')
  const blockedMilestones = activeMissions.flatMap((mission) => mission.milestones.filter((milestone) => milestone.status === 'bloque').map((milestone) => ({ ...milestone, mission })))
  const actions = buildNextActions(state, orgId)
  const topAction = actions[0]
  const completedMissions = missions.filter((mission) => mission.status === 'terminee').length
  const validatedDocuments = documents.filter((document) => document.status === 'valide').length
  const averageProgress = activeMissions.length ? Math.round(activeMissions.reduce((sum, mission) => sum + missionProgress(mission), 0) / activeMissions.length) : 100
  const status = blockedMilestones.length ? 'Un jalon bloque une mission' : pendingDocuments.length ? 'Des pièces attendent votre équipe' : openNeeds.length ? 'Des dossiers restent à faire avancer' : 'Aucun blocage détecté'

  const resultRows = useMemo<ResultRow[]>(() => [
    ...missions.map((mission) => {
      const next = mission.milestones.find((milestone) => milestone.status === 'bloque') ?? mission.milestones.find((milestone) => milestone.status === 'en_cours') ?? mission.milestones.find((milestone) => milestone.status === 'a_venir')
      return { id: mission.id, kind: 'Mission', title: mission.title, status: MISSION_STATUS[mission.status].label, tone: MISSION_STATUS[mission.status].tone, progress: missionProgress(mission), next: next ? `${next.status === 'bloque' ? 'Débloquer' : 'Étape suivante'} : ${next.title}` : 'Bilan terminé', deadline: mission.targetEnd, to: `/app/missions/${mission.id}`, complete: mission.status === 'terminee', priority: next?.status === 'bloque' ? 0 : mission.status === 'terminee' ? 4 : 2 }
    }),
    ...needs.map((need) => {
      const flowIndex = NEED_FLOW.indexOf(need.status)
      const progress = ['signe', 'clos'].includes(need.status) ? 100 : flowIndex < 0 ? 0 : Math.round((flowIndex / (NEED_FLOW.length - 1)) * 100)
      const nextByStatus: Record<string, string> = { recu: 'Qualifier le besoin', analyse: 'Confirmer le périmètre', recherche: 'Identifier des prestataires', propositions: 'Examiner les propositions', devis: 'Comparer les devis', negociation: 'Valider la décision', signe: 'Suivre le démarrage', clos: 'Dossier clôturé' }
      const terminal = ['signe', 'clos'].includes(need.status)
      return { id: need.id, kind: 'Besoin', title: need.title, status: NEED_STATUS[need.status].label, tone: NEED_STATUS[need.status].tone, progress, next: nextByStatus[need.status] ?? 'Vérifier la prochaine étape', deadline: need.deadline, to: `/app/besoins/${need.id}`, complete: terminal, priority: need.urgency === 'haute' && !terminal ? 1 : terminal ? 4 : 3 }
    }),
    ...documents.map((document) => {
      const complete = document.status === 'valide'
      const next = document.status === 'demande' ? 'Fournir le document' : document.status === 'recu' ? 'Vérifier le document' : 'Document vérifié'
      return { id: document.id, kind: 'Document', title: document.name, status: DOC_STATUS[document.status].label, tone: DOC_STATUS[document.status].tone, progress: document.status === 'valide' ? 100 : document.status === 'recu' ? 65 : 20, next, deadline: null, to: '/app/documents', complete, priority: document.required && !complete ? 1 : complete ? 4 : 3 }
    }),
  ], [missions, needs, documents])
  const visibleRows = useMemo(() => resultRows
    .filter((row) => kindFilter === 'tous' || row.kind === kindFilter)
    .filter((row) => viewFilter === 'tous' || (viewFilter === 'termines' ? row.complete : !row.complete))
    .filter((row) => `${row.title} ${row.kind} ${row.status} ${row.next}`.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr')))
    .sort((a, b) => a.priority - b.priority || (a.deadline ?? '9999').localeCompare(b.deadline ?? '9999')),
  [resultRows, kindFilter, viewFilter, query])

  return <>
    <PageHeader eyebrow="Résultats & décisions" title="Voyez ce qui avance. Décidez de la suite." description="Cette page relie vos dossiers aux décisions à prendre : l’indicateur sert à agir, pas à remplir un tableau." />

    <section className={`owner-outcome-hero ${blockedMilestones.length ? 'has-blocker' : ''}`}>
      <div className="owner-outcome-heading"><span className="owner-outcome-icon">{blockedMilestones.length ? <CircleAlert size={20}/> : topAction ? <Target size={20}/> : <CheckCircle2 size={20}/>}</span><div><small>VOTRE POINT DE PILOTAGE</small><h2>{status}</h2><p>{blockedMilestones.length ? `${blockedMilestones[0].mission.title} · étape « ${blockedMilestones[0].title} » à débloquer.` : pendingDocuments.length ? `${pendingDocuments.length} pièce${pendingDocuments.length > 1 ? 's' : ''} requise${pendingDocuments.length > 1 ? 's' : ''} à compléter pour poursuivre les dossiers concernés.` : openNeeds.length ? `${openNeeds.length} besoin${openNeeds.length > 1 ? 's' : ''} actif${openNeeds.length > 1 ? 's' : ''} à suivre jusqu’à une décision ou une clôture.` : 'Les dossiers visibles ne signalent pas de décision urgente à prendre.'}</p></div></div>
      {topAction ? <NextActionCard action={topAction} featured/> : null}
    </section>

    <div className="owner-outcome-summary"><article><span><Gauge size={17}/></span><div><small>Progression des missions actives</small><strong>{activeMissions.length ? `${averageProgress}%` : 'Aucune mission active'}</strong></div><Progress value={averageProgress}/></article><article><span><FileCheck2 size={17}/></span><div><small>Documents requis</small><strong>{pendingDocuments.length ? `${pendingDocuments.length} à compléter` : 'Dossier à jour'}</strong></div><Link to="/app/documents">Voir les documents <ArrowRight size={14}/></Link></article><article><span><Target size={17}/></span><div><small>Besoins en cours</small><strong>{openNeeds.length ? `${openNeeds.length} à suivre` : 'Aucun besoin actif'}</strong></div><Link to="/app/besoins">Ouvrir les besoins <ArrowRight size={14}/></Link></article></div>

    <section className="owner-results-panel"><div className="team-section-heading"><div><h2>Tableau de suivi</h2><p>Besoins, missions et documents du dossier, triés selon l’action la plus utile.</p></div><span>{visibleRows.length} ligne{visibleRows.length === 1 ? '' : 's'}</span></div><div className="owner-results-toolbar"><label className="owner-results-search"><Search size={16}/><Input aria-label="Rechercher dans les résultats" placeholder="Rechercher un dossier…" value={query} onChange={(event) => setQuery(event.target.value)}/></label><Select aria-label="Filtrer par type" value={kindFilter} onChange={(event) => setKindFilter(event.target.value)}><option value="tous">Tous les types</option><option value="Mission">Missions</option><option value="Besoin">Besoins</option><option value="Document">Documents</option></Select><Select aria-label="Filtrer par avancement" value={viewFilter} onChange={(event) => setViewFilter(event.target.value)}><option value="ouverts">À suivre</option><option value="termines">Terminés</option><option value="tous">Tout afficher</option></Select></div><div className="owner-results-scroll"><table className="owner-results-table"><thead><tr><th>Dossier</th><th>État</th><th>Progression</th><th>Prochaine étape</th><th>Échéance</th><th></th></tr></thead><tbody>{visibleRows.map((row) => <tr key={`${row.kind}-${row.id}`}><td><small>{row.kind}</small><strong>{row.title}</strong></td><td><Badge tone={row.tone}>{row.status}</Badge></td><td><div className="owner-results-progress"><Progress value={row.progress}/><span>{row.progress}%</span></div></td><td>{row.next}</td><td>{row.deadline ? new Date(`${row.deadline}T12:00:00`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}</td><td><Link to={row.to as any}>Ouvrir <ArrowRight size={13}/></Link></td></tr>)}{!visibleRows.length ? <tr><td colSpan={6} className="owner-results-empty">Aucun résultat pour ces filtres. Essayez une autre recherche ou modifiez l’affichage.</td></tr> : null}</tbody></table></div></section>

    <details className="owner-detail-data"><summary>Voir les repères détaillés <span>Pour le suivi</span></summary><div className="performance-kpis"><div><small>Besoins enregistrés</small><strong>{needs.length}</strong><span>{needs.filter((need) => ['clos', 'signe'].includes(need.status)).length} clos ou signés</span></div><div><small>Missions</small><strong>{missions.length}</strong><span>{completedMissions} terminée{completedMissions > 1 ? 's' : ''}</span></div><div><small>Documents validés</small><strong>{validatedDocuments}/{documents.length}</strong><span>Pièces confirmées dans les dossiers</span></div><div><small>Diagnostics publiés</small><strong>{state.diagnostics.filter((diagnostic) => diagnostic.orgId === orgId && diagnostic.status === 'publie').length}</strong><span>À relier aux priorités et décisions</span></div></div></details>
  </>
}
