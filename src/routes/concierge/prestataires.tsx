import { createFileRoute } from '@tanstack/react-router'
import { ConciergeGuard, ConciergeHeading, ScopedEmpty } from '@/features/concierge/ScopedSection'
import { conciergeScope, useDemo } from '@/store/store'
import { Badge, Card } from '@/components/ui'

export const Route = createFileRoute('/concierge/prestataires')({ component: ConciergeProviders })
function ConciergeProviders(){
 const {state}=useDemo(); const {orgIds}=conciergeScope(state); const needs=state.needs.filter(x=>orgIds.has(x.orgId)); const ids=new Set(needs.flatMap(n=>n.candidateIds)); state.quotes.filter(q=>needs.some(n=>n.id===q.needId)).forEach(q=>ids.add(q.providerId)); const items=state.providers.filter(p=>ids.has(p.id))
 return <ConciergeGuard><ConciergeHeading eyebrow="Réseau" title="Prestataires liés au portefeuille" description="Prestataires proposés ou déjà présents dans les dossiers de vos entreprises."/><div className="mt-8 grid gap-4 lg:grid-cols-2">{items.map(item=><Card key={item.id} className="p-5"><div className="flex justify-between gap-4"><div><p className="font-semibold text-ink-950">{item.name}</p><p className="text-sm text-ink-500">{item.categoryLabel} · {item.city}</p></div><Badge tone={item.verification==='approfondie'?'success':'info'}>{item.verification}</Badge></div><p className="mt-3 text-sm text-ink-600">{item.priceHint} · réponse {item.responseDelay}</p><div className="mt-3 flex flex-wrap gap-2">{item.highlights.slice(0,3).map(x=><Badge key={x}>{x}</Badge>)}</div></Card>)}{!items.length&&<ScopedEmpty/>}</div></ConciergeGuard>
}
