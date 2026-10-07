import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { ConciergeGuard, ConciergeHeading, OrgIdentity, ScopedEmpty } from '@/features/concierge/ScopedSection'
import { conciergeScope, useDemo } from '@/store/store'
import { Badge, Button, Card, Input } from '@/components/ui'

export const Route = createFileRoute('/concierge/messages')({ component: ConciergeMessages })
function ConciergeMessages(){
 const {state,dispatch,user}=useDemo(); const {orgIds}=conciergeScope(state); const threads=state.threads.filter(x=>orgIds.has(x.orgId)); const [drafts,setDrafts]=useState<Record<string,string>>({})
 return <ConciergeGuard><ConciergeHeading eyebrow="Communication" title="Messages" description="Conversations des entreprises suivies. Les échanges des autres comptes restent invisibles."/><div className="mt-8 space-y-4">{threads.map(thread=>{const msgs=state.messages.filter(m=>m.threadId===thread.id);const last=msgs.at(-1);const draft=drafts[thread.id]||'';return <Card key={thread.id} className="p-5"><div className="flex flex-wrap justify-between gap-4"><div><OrgIdentity orgId={thread.orgId}/><p className="mt-2 font-semibold text-ink-950">{thread.subject}</p><p className="mt-1 text-sm text-ink-600">{last?.body ?? 'Aucun message.'}</p></div>{thread.unread?<Badge tone="info">{thread.unread} non lu(s)</Badge>:<Badge>À jour</Badge>}</div><form className="mt-4 flex gap-2" onSubmit={(e)=>{e.preventDefault();if(!draft.trim())return;dispatch({type:'MESSAGE_SEND',threadId:thread.id,body:draft.trim(),author:'allneeds',authorName:user.name,orgId:thread.orgId});setDrafts(d=>({...d,[thread.id]:''}))}}><Input value={draft} onChange={(e)=>setDrafts(d=>({...d,[thread.id]:e.target.value}))} placeholder="Répondre au client…"/><Button type="submit">Envoyer</Button></form></Card>})}{!threads.length&&<ScopedEmpty/>}</div></ConciergeGuard>
}
