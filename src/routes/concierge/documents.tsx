import { createFileRoute } from '@tanstack/react-router'
import { ConciergeGuard, ConciergeHeading, OrgIdentity, ScopedEmpty } from '@/features/concierge/ScopedSection'
import { conciergeScope, useDemo } from '@/store/store'
import { Badge, Card, Select } from '@/components/ui'

export const Route = createFileRoute('/concierge/documents')({ component: ConciergeDocuments })
function ConciergeDocuments(){
 const {state,dispatch}=useDemo(); const {orgIds}=conciergeScope(state); const items=state.documents.filter(x=>orgIds.has(x.orgId))
 return <ConciergeGuard><ConciergeHeading eyebrow="Documents" title="Documents du portefeuille" description="Pièces demandées, reçues et validées, uniquement pour vos entreprises."/><div className="mt-8 space-y-3">{items.map(item=><Card key={item.id} className="p-5"><div className="flex flex-wrap justify-between gap-4"><div><OrgIdentity orgId={item.orgId}/><p className="mt-2 font-semibold text-ink-950">{item.name}</p><p className="text-xs text-ink-500">Mis à jour le {new Date(item.updatedAt).toLocaleDateString('fr-FR')}</p>{item.comment?<p className="mt-2 text-sm text-ink-600">{item.comment}</p>:null}</div><div className="flex items-center gap-2"><Badge tone={item.status==='valide'?'success':item.status==='recu'?'info':'warning'}>{item.status}</Badge><Select value={item.status} onChange={(e)=>dispatch({type:'DOC_SET_STATUS',id:item.id,status:e.target.value as any})} className="w-36"><option value="demande">Demandé</option><option value="recu">Reçu</option><option value="valide">Validé</option></Select></div></div></Card>)}{!items.length&&<ScopedEmpty/>}</div></ConciergeGuard>
}
