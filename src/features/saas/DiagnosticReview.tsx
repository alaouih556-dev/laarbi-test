import { useState } from 'react'
import { DIAGNOSTIC_GRIDS } from '@/data/grid'
import { titles, type Industry } from './model'
import './workspace.css'
export function DiagnosticReview(){
 const [refresh,setRefresh]=useState(0)
 const entries=Object.keys(localStorage).filter(k=>k.startsWith('allneeds.auto-diagnostic.v1.') && !k.endsWith('.review')).map(key=>{
 const sector=key.split('.').at(-1) as Industry
 let answers:Record<string,number>={};try{answers=JSON.parse(localStorage.getItem(key)||'{}')}catch{}
 const grid=DIAGNOSTIC_GRIDS[sector]
 return {key,sector,answers,grid}
 }).filter(e=>e.grid)
 return <div className="saas"><header className="saas-hero"><span className="saas-kicker">ALLNEEDS · REVUE INTERNE</span><h1>Diagnostics automatiques</h1><p>Relecture des autoévaluations enregistrées dans ce navigateur. Validation de démonstration.</p></header><p className="saas-notice">La validation est un avis organisationnel, sans vérification documentaire ni portée médicale. Aucun score commercial n’est transmis au client.</p>{entries.map(e=>{
 const questions=e.grid.levers.flatMap(l=>l.questions);const count=questions.filter(q=>e.answers[q.id]>=1&&e.answers[q.id]<=5).length
 let review:{status?:string;note?:string}={};try{review=JSON.parse(localStorage.getItem(e.key+'.review')||'{}')}catch{}
 return <article key={e.key} className="saas-panel" style={{marginBottom:20}}><h2>{titles[e.sector]}</h2><p>{count} / {questions.length} réponses · {review.status||'À examiner'}</p><form className="saas-form" onSubmit={event=>{event.preventDefault();const data=new FormData(event.currentTarget);localStorage.setItem(e.key+'.review',JSON.stringify({status:data.get('status'),note:data.get('note'),date:new Date().toISOString()}));setRefresh(refresh+1)}}><label>Avis de relecture<select name="status" defaultValue={review.status||'À examiner'}><option>À examiner</option><option>Compléments demandés</option><option>Revu par ALLNEEDS (démo)</option></select></label><label>Commentaire de restitution<input name="note" required defaultValue={review.note||''}/></label><button className="saas-primary">Publier l’avis</button></form></article>
 })}{!entries.length&&<div className="saas-panel">Aucune autoévaluation dans ce navigateur. Remplissez le diagnostic côté client pour tester la revue.</div>}</div>
}
