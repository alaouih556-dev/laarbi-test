import { createFileRoute } from '@tanstack/react-router'
import { ConciergeGuard, ConciergeHeading, OrgIdentity, ScopedEmpty } from '@/features/concierge/ScopedSection'
import { conciergeScope, useDemo } from '@/store/store'
import { Badge, Card, Select } from '@/components/ui'
import { dateTime } from '@/lib/format'

export const Route = createFileRoute('/concierge/rendez-vous')({ component: ConciergeMeetings })
function ConciergeMeetings(){
 const {state,dispatch}=useDemo(); const {orgIds}=conciergeScope(state); const items=state.meetings.filter(x=>orgIds.has(x.orgId)).sort((a,b)=>b.at.localeCompare(a.at))
 return <ConciergeGuard><ConciergeHeading eyebrow="Agenda" title="Rendez-vous" description="Tous les rendez-vous liés aux entreprises qui vous sont attribuées."/><div className="mt-8 space-y-3">{items.map(item=><Card key={item.id} className="p-5"><div className="flex flex-wrap justify-between gap-4"><div><OrgIdentity orgId={item.orgId}/><p className="mt-2 font-semibold text-ink-950">{item.title}</p><p className="text-sm text-ink-500">{dateTime(item.at)} · {item.kind}</p></div><div className="flex items-center gap-2"><Badge tone={item.status==='confirme'?'success':item.status==='annule'?'danger':'warning'}>{item.status}</Badge><Select value={item.status} onChange={(e)=>dispatch({type:'MEETING_SET_STATUS',id:item.id,status:e.target.value as any})} className="w-36"><option value="propose">Proposé</option><option value="confirme">Confirmé</option><option value="realise">Réalisé</option><option value="annule">Annulé</option></Select></div></div></Card>)}{!items.length&&<ScopedEmpty/>}</div></ConciergeGuard>
}
