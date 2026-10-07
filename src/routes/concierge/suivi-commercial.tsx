import { useMemo, useState } from 'react'
import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, BadgeCheck, CircleHelp, CircleSlash, Lightbulb, MessageSquareText, ShieldCheck, ShoppingBag, Target } from 'lucide-react'
import { ConciergeGuard, ConciergeHeading, OrgIdentity, ScopedEmpty } from '@/features/concierge/ScopedSection'
import { conciergeScope, useDemo, type CommercialOpportunity } from '@/store/store'
import { PLANS, SECTOR_LABEL } from '@/data/catalog'
import { Badge, Button, Card, Select } from '@/components/ui'
import type { MissionOffer } from '@/types'

export const Route = createFileRoute('/concierge/suivi-commercial')({ component: ConciergeCommercial })

const statusLabels: Record<CommercialOpportunity['status'], string> = { a_qualifier: 'À qualifier avec le client', a_preparer: 'Proposition à préparer', proposee: 'Proposition présentée', interessee: 'Intérêt confirmé', acceptee: 'Acceptée', refusee: 'Sans suite' }

function ConciergeCommercial() {
  const { state, dispatch } = useDemo()
  const { orgIds, orgs } = conciergeScope(state)
  const [selectedOrg, setSelectedOrg] = useState('toutes')
  const opportunities = state.commercialOpportunities.filter((item) => orgIds.has(item.orgId))
  const candidatePlans = useMemo(() => orgs.map((org) => {
    const diagnostics = state.diagnostics.filter((item) => item.orgId === org.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    const publishedDiagnostic = diagnostics.find((item) => item.status === 'publie')
    const pendingDiagnostic = diagnostics.find((item) => item.status !== 'publie')
    const missions = state.missions.filter((item) => item.orgId === org.id).sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    const activeMission = missions.find((mission) => mission.status !== 'terminee')
    const completedMission = missions.find((mission) => mission.status === 'terminee')
    const openOpp = opportunities.find((item) => item.orgId === org.id && !['acceptee', 'refusee'].includes(item.status))
    const completedCode = completedMission?.code
    const planCode = completedCode === 'PRO' ? 'PERFORMANCE' : completedCode === 'PERFORMANCE' ? null : 'PRO'
    const offer = planCode ? PLANS[org.sector].find((plan) => plan.code === planCode) : undefined
    const blocker = !publishedDiagnostic ? pendingDiagnostic ? 'Le diagnostic doit être vérifié et restitué avant de recommander une mission.' : 'Réalisez le diagnostic avec le dirigeant : aucune piste complémentaire ne doit être déduite sans constats validés.' : activeMission ? `La mission « ${activeMission.title} » n’est pas terminée. Assurez son résultat avant d’ouvrir une vente additionnelle.` : !offer ? 'La dernière mission PERFORMANCE est terminée. Faites d’abord le bilan avec le client et attendez un nouveau besoin exprimé.' : null
    const signal = publishedDiagnostic?.priorities.slice(0, 3) ?? []
    const question = offer?.code === 'PERFORMANCE'
      ? 'Après la structuration, souhaitez-vous être accompagné pendant la mise en œuvre et le suivi des résultats ?'
      : 'Ces priorités sont-elles bien celles qui comptent maintenant ? Souhaitez-vous des outils prêts à l’emploi pour que votre équipe puisse les mettre en œuvre ?'
    return { org, publishedDiagnostic, pendingDiagnostic, activeMission, completedMission, offer, blocker, signal, question, openOpp }
  }), [orgs, state.diagnostics, state.missions, opportunities])
  const visible = candidatePlans.filter((item) => selectedOrg === 'toutes' || item.org.id === selectedOrg)
  const openCount = opportunities.filter((item) => !['acceptee', 'refusee'].includes(item.status)).length
  const presentedCount = opportunities.filter((item) => ['proposee', 'interessee'].includes(item.status)).length

  const createOpportunity = (orgId: string, offer: MissionOffer, signal: string) => dispatch({ type: 'COMMERCIAL_OPPORTUNITY_CREATE', opportunity: { orgId, offerCode: offer.code as 'PRO' | 'PERFORMANCE', offerName: offer.name, signal } })

  return <ConciergeGuard><div className="concierge-commercial-page">
    <ConciergeHeading eyebrow="Vente-conseil après le diagnostic" title="Proposer la suite qui répond au vrai besoin." description="Le suivi commercial sert à faire émerger des missions utiles à partir d’un diagnostic partagé — pas à vendre un abonnement par défaut."/>

    <section className="commercial-principles"><article><span><Target size={18}/></span><div><small>UN SIGNAL RÉEL</small><strong>Une priorité issue du diagnostic publié.</strong></div></article><article><span><Lightbulb size={18}/></span><div><small>UNE OFFRE ADAPTÉE</small><strong>PRO structure · PERFORMANCE accompagne l’exécution.</strong></div></article><article><span><ShieldCheck size={18}/></span><div><small>UNE DÉCISION LIBRE</small><strong>Qualifier, expliquer, laisser le client choisir.</strong></div></article></section>

    <section className="commercial-funnel-summary"><article><ShoppingBag size={17}/><strong>{candidatePlans.filter((item) => item.offer && !item.blocker).length}</strong><span>pistes à qualifier</span></article><article><MessageSquareText size={17}/><strong>{openCount}</strong><span>offres en suivi</span></article><article><BadgeCheck size={17}/><strong>{presentedCount}</strong><span>offres présentées</span></article><label>Entreprise<Select aria-label="Filtrer par entreprise" value={selectedOrg} onChange={(event) => setSelectedOrg(event.target.value)}><option value="toutes">Tout le portefeuille</option>{orgs.map((org) => <option value={org.id} key={org.id}>{org.name}</option>)}</Select></label></section>

    <div className="commercial-work-heading"><div><small>OPPORTUNITÉS À DISCUTER</small><h2>Une recommandation n’est pas une vente conclue</h2></div><span>Le client reste libre de poursuivre ou non.</span></div>
    <div className="commercial-candidate-list">{visible.map(({ org, publishedDiagnostic, pendingDiagnostic, activeMission, completedMission, offer, blocker, signal, question, openOpp }) => {
      const offerPrice = offer ? offer.priceLaunch ?? offer.priceNormal : null
      const opportunity = opportunities.filter((item) => item.orgId === org.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0]
      return <Card className="commercial-candidate-card" key={org.id}>
        <header><div><OrgIdentity orgId={org.id}/><p>{org.kind} · {org.city}</p></div>{opportunity ? <Badge tone={opportunity.status === 'acceptee' ? 'success' : opportunity.status === 'refusee' ? 'neutral' : 'brand'}>{statusLabels[opportunity.status]}</Badge> : blocker ? <Badge tone="warning">À préparer avant proposition</Badge> : <Badge tone="info">Piste à qualifier</Badge>}</header>

        {blocker ? <div className="commercial-hold"><CircleSlash size={18}/><div><strong>Pas de vente additionnelle à pousser maintenant</strong><p>{blocker}</p>{pendingDiagnostic ? <Link to={'/concierge/diagnostics' as any}>Terminer la restitution du diagnostic <ArrowRight size={14}/></Link> : publishedDiagnostic ? <Link to={'/concierge/entreprises/$id' as any} params={{ id: org.id } as any}>Faire le bilan de mission <ArrowRight size={14}/></Link> : <Link to={'/concierge/diagnostics' as any}>Préparer le diagnostic <ArrowRight size={14}/></Link>}</div></div> : offer && publishedDiagnostic ? <>
          <div className="commercial-evidence"><small>SIGNAL VALIDÉ AVEC L’ENTREPRISE · {publishedDiagnostic.ref}</small><strong>{signal[0] ?? 'Priorité publiée du diagnostic'}</strong><p>{publishedDiagnostic.difficulties[0] ?? 'Constat à confirmer avec le dirigeant lors de la qualification.'}</p></div>
          <div className="commercial-proposal-grid"><section><small>OFFRE COMPLÉMENTAIRE CANDIDATE</small><div className="commercial-offer-title"><h3>{offer.name} · {offer.verb}</h3><Badge tone="brand">{offer.code}</Badge></div><p>{offer.tagline}</p><p className="commercial-offer-result">{offer.intro}</p><div className="commercial-offer-meta"><strong>{new Intl.NumberFormat('fr-FR').format(offerPrice ?? 0)} DH HT</strong><span>{offer.delay}</span><span>{offer.payment}</span></div>
            <div className="commercial-offer-contents"><strong>CE QUE LE CLIENT ACHÈTE</strong><ul>{offer.deliverables.slice(0, 5).map((deliverable) => <li key={deliverable}>{deliverable}</li>)}</ul><details><summary>Voir le périmètre détaillé et les limites</summary><div className="commercial-offer-scope">{offer.included.map((group) => <section key={group.title}><strong>{group.title}</strong><ul>{group.items.slice(0, 4).map((item) => <li key={item}>{item}</li>)}</ul>{group.limit ? <p>{group.limit}</p> : null}</section>)}</div><div className="commercial-offer-exclusions"><strong>Hors périmètre</strong><ul>{offer.notIncluded.map((item) => <li key={item}>{item}</li>)}</ul></div></details></div>
            <small className="commercial-offer-limit">À présenter uniquement si le dirigeant confirme cette priorité et le périmètre proposé. Le prix et le délai doivent être repris dans le devis avant accord.</small></section><section className="commercial-qualification"><small>QUESTION À POSER</small><p>« {question} »</p><span><CircleHelp size={14}/> Écouter la réponse avant d’enregistrer une proposition.</span></section></div>
          <footer className="commercial-candidate-footer"><div><strong>Prochaine étape concierge</strong><p>{openOpp ? `Piste en cours : ${statusLabels[openOpp.status]}.` : 'Valider la priorité avec le dirigeant, puis préparer une proposition détaillée.'}</p></div>{openOpp ? <Select aria-label={`Avancement de l’opportunité ${openOpp.offerName}`} value={openOpp.status} onChange={(event) => dispatch({ type: 'COMMERCIAL_OPPORTUNITY_STATUS_SET', id: openOpp.id, status: event.target.value as CommercialOpportunity['status'] })}><option value="a_qualifier">À qualifier avec le client</option><option value="a_preparer">Proposition à préparer</option><option value="proposee">Proposition présentée</option><option value="interessee">Intérêt confirmé</option><option value="acceptee">Acceptée</option><option value="refusee">Sans suite</option></Select> : <Button size="sm" onClick={() => createOpportunity(org.id, offer, signal[0] ?? `Priorité du diagnostic ${publishedDiagnostic.ref}`)}>Ouvrir la piste <ArrowRight size={14}/></Button>}</footer>
        </> : opportunity ? <div className="commercial-opportunity-compact"><div><small>{opportunity.offerName} · {opportunity.offerCode}</small><strong>{opportunity.signal}</strong><p>Étape actuelle : {statusLabels[opportunity.status]}</p></div><Select aria-label={`Avancement de l’opportunité ${opportunity.offerName}`} value={opportunity.status} onChange={(event) => dispatch({ type: 'COMMERCIAL_OPPORTUNITY_STATUS_SET', id: opportunity.id, status: event.target.value as CommercialOpportunity['status'] })}><option value="a_qualifier">À qualifier avec le client</option><option value="a_preparer">Proposition à préparer</option><option value="proposee">Proposition présentée</option><option value="interessee">Intérêt confirmé</option><option value="acceptee">Acceptée</option><option value="refusee">Sans suite</option></Select></div> : <div className="commercial-hold"><CircleSlash size={18}/><div><strong>Aucune mission complémentaire à proposer dans le catalogue actuel.</strong><p>Faites le bilan de la dernière mission et attendez une nouvelle priorité exprimée par le client.</p></div></div>}
      </Card>
    })}{!visible.length ? <ScopedEmpty/> : null}</div>

    <details className="commercial-existing-opportunities"><summary>Historique des pistes commerciales <span>{opportunities.length} piste{opportunities.length === 1 ? '' : 's'} enregistrée{opportunities.length === 1 ? '' : 's'}</span></summary><div>{opportunities.map((item) => <article key={item.id}><div><OrgIdentity orgId={item.orgId}/><strong>{item.offerName} · {item.offerCode}</strong><small>{item.signal} · créée le {new Date(item.createdAt).toLocaleDateString('fr-FR')}</small></div><Badge tone={item.status === 'acceptee' ? 'success' : item.status === 'refusee' ? 'neutral' : 'brand'}>{statusLabels[item.status]}</Badge></article>)}{!opportunities.length ? <p>Aucune proposition n’a encore été enregistrée. Les pistes doivent d’abord être reliées à un diagnostic publié.</p> : null}</div></details>
  </div></ConciergeGuard>
}
