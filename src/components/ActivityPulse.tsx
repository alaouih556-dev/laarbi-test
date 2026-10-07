import { ArrowRight, BarChart3, Check, CircleDot, MessageSquareText, Sparkles } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { DemoActivity } from '@/store/store'

const visual = {
  analyse: { label: 'Analyse', icon: BarChart3, tone: 'bg-violet-50 text-violet-700' },
  action: { label: 'Action', icon: Sparkles, tone: 'bg-sky-50 text-sky-700' },
  progression: { label: 'Avancement', icon: CircleDot, tone: 'bg-emerald-50 text-emerald-700' },
  decision: { label: 'Décision', icon: Check, tone: 'bg-amber-50 text-amber-800' },
} as const

function timeLabel(value: string) {
  const at = new Date(value)
  if (Number.isNaN(at.getTime())) return 'Récemment'
  return at.toLocaleString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function ActivityPulse({ activities, orgIds, title = 'Les dossiers bougent', href = '/app/actions' }: { activities: DemoActivity[]; orgIds?: Set<string>; title?: string; href?: string }) {
  const visible = activities.filter((item) => !orgIds || orgIds.has(item.orgId)).slice(0, 5)
  return <section className="mt-6 overflow-hidden rounded-[1.5rem] border border-ink-100 bg-white shadow-[0_12px_36px_rgba(14,41,78,.045)]" aria-label="Fil d’activité">
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 px-5 py-4 sm:px-6"><div><p className="text-[0.68rem] font-bold uppercase tracking-[.16em] text-brand-700">Analyse · actions · évolution</p><h2 className="mt-1 text-lg font-semibold text-ink-950">{title}</h2></div><span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500"/>Démo active</span></header>
    {visible.length ? <div className="divide-y divide-ink-50">{visible.map((item) => { const entry = visual[item.type]; const Icon = entry.icon; return <article key={item.id} className="flex gap-3 px-5 py-4 transition hover:bg-slate-50/70 sm:px-6"><span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${entry.tone}`}><Icon className="h-4 w-4"/></span><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-x-2 gap-y-1"><strong className="text-sm text-ink-950">{item.actor}</strong><span className="text-xs text-ink-400">{item.role}</span><span className="ml-auto text-xs tabular-nums text-ink-400">{timeLabel(item.at)}</span></div><p className="mt-1 text-sm leading-6 text-ink-700">{item.text}</p><p className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-ink-400"><MessageSquareText className="h-3 w-3"/>{item.organization} · {entry.label}</p></div></article> })}</div> : <div className="px-6 py-8 text-center"><p className="font-semibold text-ink-800">Le fil attend sa première action.</p><p className="mt-1 text-sm text-ink-500">Les analyses, décisions et avancées de vos dossiers apparaîtront ici.</p></div>}
    <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-ink-100 bg-slate-50/60 px-5 py-3 sm:px-6"><span className="text-xs text-ink-500">Les changements effectués dans la démo alimentent ce fil.</span><Link to={href as any} className="inline-flex items-center gap-1 text-xs font-bold text-brand-700">Suivre les prochaines étapes <ArrowRight className="h-3.5 w-3.5"/></Link></footer>
  </section>
}
