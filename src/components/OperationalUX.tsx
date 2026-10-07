import { Link } from '@tanstack/react-router'
import { AlertTriangle, ArrowRight, CheckCircle2, CircleDot, Info, Target } from 'lucide-react'
import { useDemo } from '@/store/store'
import { resolveSituation, situationLabel, buildNextActions } from '@/lib/operational'
import type { NextActionItem, OperationalTone } from '@/lib/operational'
import { cn } from '@/lib/utils'

const toneMeta: Record<OperationalTone, { label: string; className: string; icon: typeof Info }> = {
  action: { label: 'Action requise', className: 'bg-blue-50 text-blue-800 ring-blue-200', icon: CircleDot },
  attention: { label: 'Attention', className: 'bg-amber-50 text-amber-800 ring-amber-200', icon: AlertTriangle },
  information: { label: 'Information', className: 'bg-slate-50 text-slate-700 ring-slate-200', icon: Info },
  resultat: { label: 'Résultat', className: 'bg-emerald-50 text-emerald-800 ring-emerald-200', icon: CheckCircle2 },
}

export function WorkflowStrip({ compact = false }: { compact?: boolean }) {
  const steps = ['Besoin', 'Diagnostic', 'Priorité', 'Décision', 'Action', 'Résultat', 'KPI', 'Optimisation']
  return (
    <div className={cn('operational-loop', compact && 'is-compact')} aria-label="Boucle opérationnelle ALLNEEDS">
      {steps.map((step, index) => (
        <div className="operational-loop-step" key={step}>
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{step}</strong>
          {index < steps.length - 1 ? <ArrowRight className="operational-loop-arrow" size={14} /> : null}
        </div>
      ))}
    </div>
  )
}

export function NextActionCard({ action, featured = false, compact = false, rank }: { action: NextActionItem; featured?: boolean; compact?: boolean; rank?: number }) {
  const meta = toneMeta[action.tone]
  const Icon = meta.icon
  const actionLabel = action.id.startsWith('need-')
    ? action.title.startsWith('Décider') ? 'Ouvrir les devis' : 'Ouvrir le besoin'
    : action.id.startsWith('mission-') ? 'Ouvrir la mission'
      : action.id === 'messages' ? 'Lire les messages'
        : action.id.startsWith('meeting-') ? 'Voir le rendez-vous'
          : action.id === 'diagnostic' ? 'Revoir le diagnostic' : 'Voir le dossier'
  return (
    <article className={cn('next-action-card', featured && 'is-featured', compact && 'is-compact')}>
      <div className="next-action-topline">
        <span className={cn('next-action-tone', meta.className)}><Icon size={13} /> {meta.label}</span>
        {typeof rank === 'number' && !compact ? <span className={cn('next-action-priority', featured && 'is-first')}><Target size={13} /> Priorité {rank}{featured ? ' · à traiter en premier' : ''}</span> : featured && !compact ? <span className="next-action-priority"><Target size={13} /> Prochaine action utile</span> : null}
      </div>
      <h3>{action.title}</h3>
      <p className="next-action-detail">{action.detail}</p>
      {!compact ? <dl className="next-action-context"><div><dt>Pourquoi maintenant</dt><dd>{action.why}</dd></div><div><dt>Ce que cela débloque</dt><dd>{action.result}</dd></div></dl> : null}
      <Link to={action.to as any} className="next-action-link">{actionLabel} <ArrowRight size={15} /></Link>
    </article>
  )
}

export function EmptyNextAction() {
  return (
    <div className="next-action-empty">
      <CheckCircle2 size={22} />
      <div><strong>Aucune action prioritaire détectée.</strong><p>Votre espace ne contient pas actuellement d’élément nécessitant une décision immédiate.</p></div>
    </div>
  )
}


export function ClientContextBar({ showNext = true }: { showNext?: boolean }) {
  const { state, orgId } = useDemo()
  const org = state.orgs.find((o) => o.id === orgId)
  const next = buildNextActions(state, orgId)[0]
  const role = state.clientWorkspaceRole === 'dirigeant' ? 'Dirigeant' : state.clientWorkspaceRole === 'manager' ? 'Manager / responsable' : 'Collaborateur'
  return (
    <section className="client-context-bar is-compact" aria-label="Contexte opérationnel ALLNEEDS">
      <div><small>CONTEXTE</small><strong>{situationLabel(resolveSituation(state))}</strong></div>
      <div><small>ENTREPRISE</small><strong>{org?.name ?? 'Entreprise'}</strong><span>{org?.sector ?? ''} · {org?.city ?? ''}</span></div>
      <div><small>VUE</small><strong>{role}</strong></div>
      {showNext ? <div className="client-context-next"><small>PROCHAINE ACTION</small><strong>{next?.title ?? 'Aucune action prioritaire'}</strong>{next ? <Link to={next.to as any}>Ouvrir <ArrowRight size={13}/></Link> : null}</div> : null}
    </section>
  )
}
