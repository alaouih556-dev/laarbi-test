import { Link, createFileRoute } from '@tanstack/react-router'
import { CheckCircle2, MapPin, Network, ShieldCheck } from 'lucide-react'
import { PageHeader } from '@/components/layouts'
import { useDemo } from '@/store/store'
import { providerReasons } from '@/lib/operational'

export const Route = createFileRoute('/app/ecosysteme')({ component: EcosystemPage })
function EcosystemPage(){
 const {state,orgId}=useDemo(); const needs=state.needs.filter(n=>n.orgId===orgId); const candidateIds=new Set(needs.flatMap(n=>n.candidateIds)); const providers=state.providers.filter(p=>candidateIds.has(p.id));
 return <><PageHeader eyebrow="Écosystème" title="Les ressources utiles, avec une raison claire." description="ALLNEEDS ne doit pas afficher une liste interminable. Cette vue montre uniquement les prestataires déjà liés à vos besoins dans les données de démonstration et explique pourquoi."/>
 <div className="ecosystem-grid">{providers.map(p=>{const need=needs.find(n=>n.candidateIds.includes(p.id)); const reasons=providerReasons(p,need); return <article key={p.id} className="ecosystem-card"><div className="ecosystem-card-head"><span><Network size={18}/></span><div><small>{p.categoryLabel}</small><h2>{p.name}</h2></div></div><p className="ecosystem-location"><MapPin size={14}/>{p.city} · délai de réponse {p.responseDelay}</p><div className="ecosystem-reasons"><strong>Pourquoi ce profil apparaît ici</strong>{reasons.map(r=><p key={r}><CheckCircle2 size={14}/>{r}</p>)}</div><div className="ecosystem-proof"><span><ShieldCheck size={14}/>{p.verification==='approfondie'?'Vérification approfondie':'Vérification de base'}</span><span>{p.reviews} avis enregistrés</span></div>{need?<Link to={`/app/besoins/${need.id}` as any}>Voir le besoin lié</Link>:null}</article>})}{!providers.length?<div className="simple-empty"><Network/><span>Aucun prestataire n’est encore relié à vos besoins actifs.</span></div>:null}</div></>
}
