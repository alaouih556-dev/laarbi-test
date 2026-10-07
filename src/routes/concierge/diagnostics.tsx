import { useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, BadgeCheck, Check, CheckCircle2, CircleAlert, ClipboardCheck, FileSearch, Handshake, MessageCircle, Target } from 'lucide-react'
import { ConciergeGuard, ConciergeHeading, OrgIdentity, ScopedEmpty } from '@/features/concierge/ScopedSection'
import { conciergeScope, useDemo } from '@/store/store'
import { Badge, Button, Card, Checkbox, Meter } from '@/components/ui'
import { LEVER_LABEL } from '@/lib/status'
import type { InternalDiagnostic } from '@/types'

export const Route = createFileRoute('/concierge/diagnostics')({ component: ConciergeDiagnostics })

type Filter = 'a_travailler' | 'a_restituer' | 'partages' | 'tous'

function ConciergeDiagnostics() {
  const { state, dispatch } = useDemo()
  const { orgIds, orgs } = conciergeScope(state)
  const [filter, setFilter] = useState<Filter>('a_travailler')
  const [readyToShare, setReadyToShare] = useState<Record<string, boolean>>({})
  const items = useMemo(() => state.diagnostics.filter((item) => orgIds.has(item.orgId)), [state.diagnostics, orgIds])
  const reviewCount = items.filter((item) => item.status !== 'publie').length
  const sharedCount = items.filter((item) => item.status === 'publie').length
  const visible = items.filter((item) => filter === 'tous' || filter === 'partages' && item.status === 'publie' || filter === 'a_restituer' && item.status === 'en_revue' || filter === 'a_travailler' && item.status !== 'publie').sort((a, b) => a.status === 'en_revue' && b.status !== 'en_revue' ? -1 : a.status !== 'en_revue' && b.status === 'en_revue' ? 1 : b.createdAt.localeCompare(a.createdAt))

  return <ConciergeGuard><div className="concierge-diagnostics-page">
    <ConciergeHeading eyebrow="La base du suivi concierge" title="Comprendre. Prioriser. Restituer. Faire avancer." description="Le diagnostic donne le cap du travail : il met en regard les faits, les points d’appui et les difficultés, puis prépare une décision avec le dirigeant."/>

    <section className="diagnostic-concierge-purpose"><div className="diagnostic-purpose-icon"><Target size={21}/></div><div><strong>Le score seul ne sert pas le client.</strong><p>Votre valeur est de vérifier ce qu’il révèle, de le traduire en priorités compréhensibles et de relier la décision à un besoin ou à une mission utile.</p></div><div className="diagnostic-value-chips"><span><MessageCircle size={14}/> Client : comprend quoi traiter</span><span><Handshake size={14}/> ALLNEEDS : sait quoi accompagner</span></div></section>

    <section className="diagnostic-concierge-steps"><article><span>01</span><div><strong>Lire les faits</strong><small>Forces, difficultés, opportunités</small></div></article><ArrowRight size={16}/><article><span>02</span><div><strong>Choisir 3 priorités</strong><small>À valider avec le dirigeant</small></div></article><ArrowRight size={16}/><article><span>03</span><div><strong>Restituer et décider</strong><small>Partager après vérification</small></div></article><ArrowRight size={16}/><article><span>04</span><div><strong>Suivre la mise en œuvre</strong><small>Besoins, prestataires, missions</small></div></article></section>

    <div className="diagnostic-concierge-kpis"><article><FileSearch size={17}/><strong>{reviewCount}</strong><span>à analyser ou restituer</span></article><article><BadgeCheck size={17}/><strong>{sharedCount}</strong><span>partagé{sharedCount === 1 ? '' : 's'} au client</span></article><p>Un diagnostic partagé doit ouvrir sur une décision de suivi, pas rester un rapport isolé.</p></div>

    <div className="diagnostic-concierge-toolbar"><div><small>VOTRE TRAVAIL DE DIAGNOSTIC</small><h2>Quelle est la prochaine étape ?</h2></div><div>{([['a_travailler', 'À travailler'], ['a_restituer', 'À restituer'], ['partages', 'Partagés'], ['tous', `Tous (${items.length})`]] as const).map(([key, label]) => <button type="button" key={key} className={filter === key ? 'is-active' : ''} onClick={() => setFilter(key)}>{label}</button>)}</div></div>

    <div className="concierge-diagnostic-list">{visible.map((item) => {
      const org = orgs.find((company) => company.id === item.orgId)
      const sortedScores = [...item.scores].sort((a, b) => a.score - b.score)
      const leadLever = sortedScores[0]
      const reviewed = item.status === 'en_revue'
      const accepted = Boolean(readyToShare[item.id])
      return <Card key={item.id} className="concierge-diagnostic-card">
        <header className="concierge-diagnostic-header"><div><OrgIdentity orgId={item.orgId}/><h3>{item.ref}</h3><small>Réalisé par {item.author} · {new Date(item.createdAt).toLocaleDateString('fr-FR')}</small></div><Badge tone={item.status === 'publie' ? 'success' : reviewed ? 'warning' : 'neutral'}>{item.status === 'publie' ? 'Partagé au client' : reviewed ? 'À restituer' : 'Brouillon'}</Badge></header>

        <div className="diagnostic-readout"><div className="diagnostic-main-finding"><small>POINT À EXAMINER EN PREMIER</small><strong>{leadLever ? LEVER_LABEL[leadLever.lever] ?? leadLever.lever : 'Constats du diagnostic'}</strong><p>{item.difficulties[0] ?? 'Aucune difficulté documentée.'}</p><span>Indice de maturité déclaré : {leadLever?.score ?? '—'}/100 · à interpréter avec les faits, pas comme une conclusion seule.</span></div><div className="diagnostic-scores-mini">{sortedScores.map((score) => <div key={score.lever}><span>{LEVER_LABEL[score.lever] ?? score.lever}</span><strong>{score.score}</strong><Meter value={score.score}/></div>)}</div></div>

        <div className="diagnostic-evidence-grid"><section><h4><CheckCircle2 size={15}/> Points d’appui</h4>{item.strengths.length ? <ul>{item.strengths.slice(0, 3).map((point) => <li key={point}>{point}</li>)}</ul> : <p>À compléter pendant l’entretien.</p>}</section><section><h4><CircleAlert size={15}/> Difficultés observées</h4>{item.difficulties.length ? <ul>{item.difficulties.slice(0, 3).map((point) => <li key={point}>{point}</li>)}</ul> : <p>À compléter pendant l’entretien.</p>}</section><section><h4><Target size={15}/> Opportunités à valider</h4>{item.opportunities.length ? <ul>{item.opportunities.slice(0, 3).map((point) => <li key={point}>{point}</li>)}</ul> : <p>À préciser avec le dirigeant.</p>}</section></div>

        <section className="diagnostic-priorities"><div className="diagnostic-priority-heading"><div><small>RECOMMANDATIONS À DISCUTER, PAS À IMPOSER</small><h4>Trois priorités pour guider la restitution</h4></div><span>ordre proposé</span></div><ol>{item.priorities.slice(0, 3).map((priority, index) => <li key={`${item.id}-${priority}`}><span>{index + 1}</span><div><strong>{priority}</strong><small>À confirmer avec le dirigeant : urgence, responsable et premier résultat attendu.</small></div></li>)}</ol></section>

        {item.notes ? <aside className="diagnostic-review-note"><CircleAlert size={16}/><div><strong>Point de contrôle avant partage</strong><p>{item.notes}</p></div></aside> : null}

        <footer className="diagnostic-concierge-footer"><div><strong>Après la restitution</strong><p>Reliez chaque décision à un besoin suivi, un prestataire pertinent ou une mission avec un responsable et une prochaine échéance.</p></div>{reviewed ? <div className="diagnostic-publish-controls"><Checkbox label="Constats vérifiés, informations sensibles anonymisées et restitution préparée avec le dirigeant" checked={accepted} onChange={(event) => setReadyToShare((current) => ({ ...current, [item.id]: event.target.checked }))}/><Button size="sm" disabled={!accepted} onClick={() => dispatch({ type: 'DIAGNOSTIC_PUBLISH', id: item.id })}><BadgeCheck size={15}/> Partager au client</Button></div> : item.status === 'publie' ? <Link to={'/concierge/entreprises/$id' as any} params={{ id: item.orgId } as any}>Suivre la mise en œuvre <ArrowRight size={15}/></Link> : <span className="diagnostic-draft-hint"><ClipboardCheck size={15}/> Compléter la grille avant restitution</span>}</footer>
      </Card>
    })}{!visible.length ? <ScopedEmpty/> : null}</div>
  </div></ConciergeGuard>
}
