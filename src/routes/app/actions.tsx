import { createFileRoute } from '@tanstack/react-router'
import { ArrowDown, CheckCircle2, ListOrdered, ShieldAlert } from 'lucide-react'
import { PageHeader } from '@/components/layouts'
import { useDemo } from '@/store/store'
import { buildNextActions } from '@/lib/operational'
import { NextActionCard, EmptyNextAction } from '@/components/OperationalUX'

export const Route = createFileRoute('/app/actions')({ component: ActionsPage })

function ActionsPage() {
  const { state, orgId } = useDemo()
  const actions = buildNextActions(state, orgId)
  const first = actions[0]
  const next = actions.slice(1)
  const urgentCount = actions.filter((action) => action.tone === 'attention').length

  return <>
    <PageHeader eyebrow="Plan d’action" title="Sachez par quoi commencer." description="Une feuille de route dans l’ordre conseillé : la priorité du jour, puis les étapes suivantes. Chaque rang s’appuie sur les urgences, les décisions en attente et les blocages visibles dans vos dossiers." />
    {actions.length ? <>
      <div className="action-plan-brief"><span className="action-plan-brief-icon"><ListOrdered size={19}/></span><div><strong>{urgentCount ? `${urgentCount} point${urgentCount > 1 ? 's' : ''} réclame${urgentCount > 1 ? 'nt' : ''} une vigilance particulière` : `${actions.length} prochaine${actions.length > 1 ? 's' : ''} étape${actions.length > 1 ? 's' : ''} repérée${actions.length > 1 ? 's' : ''}`}</strong><p>Commencez par la priorité 1. Les autres dossiers restent rangés dans l’ordre recommandé.</p></div><span>{actions.length} action{actions.length > 1 ? 's' : ''} en vue</span></div>
      <section className="action-plan-first"><div className="action-plan-section-title"><span>01</span><div><small>À FAIRE EN PREMIER</small><h2>Votre prochaine décision utile</h2></div></div><NextActionCard action={first} featured rank={1}/></section>
      {next.length ? <section className="action-plan-next"><div className="action-plan-section-title"><span><ArrowDown size={17}/></span><div><small>PUIS, DANS CET ORDRE</small><h2>Les étapes suivantes</h2></div></div><div className="next-action-stack wide">{next.map((action, index) => <NextActionCard key={action.id} action={action} rank={index + 2}/>)}</div></section> : <div className="action-plan-done"><CheckCircle2 size={20}/><div><strong>Une seule priorité ressort pour le moment.</strong><p>Revenez ici après l’avoir traitée : les prochains dossiers remonteront alors.</p></div></div>}
      <p className="action-plan-method"><ShieldAlert size={14}/> L’ordre est une recommandation calculée à partir des informations présentes. Il ne remplace pas votre jugement ni les échéances métier que vous devez confirmer.</p>
    </> : <EmptyNextAction/>}
  </>
}
