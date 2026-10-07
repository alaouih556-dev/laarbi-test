import { useEffect, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { DIAGNOSTIC_GRIDS } from '@/data/grid'
import { useDemo } from '@/store/store'
import { titles, type Industry } from './model'
import './workspace.css'
import { Diagnostic360 } from '@/features/health360/Diagnostic360'
type Answers=Record<string,number>
export function Diagnostic(){
 const {user,state}=useDemo()
 const sector=useMemo<Industry>(()=>{
   if (state.registrationProfile?.sector) return state.registrationProfile.sector as Industry
   const org=state.orgs.find(item=>item.id===user.orgId)
   return (org?.sector as Industry|undefined) ?? 'enseignement'
 },[state.orgs,state.registrationProfile,user.orgId])
 return <Diagnostic360 sector={sector}/> /* v5.1 pour tous les secteurs : moteur partagé, variantes sectorielles via packs */
 return <div className="saas"><header className="saas-hero"><span className="saas-kicker">ALLNEEDS · DIAGNOSTIC AUTOMATIQUE</span><h1>Comprendre aujourd’hui.<br/>Mieux agir demain.</h1><p>Évaluez vos pratiques, repérez vos priorités et construisez votre prochain plan d’action.</p><div className="saas-sector"><span aria-label={`Secteur actif : ${titles[sector]}`}>{titles[sector]}</span></div></header><p className="saas-notice">Autoévaluation organisationnelle dédiée à votre secteur. Aucune donnée de patient, d’élève ou de voyageur n’est nécessaire. Résultat automatique à confirmer avec ALLNEEDS.</p><Questionnaire key={sector+String(user.orgId)} sector={sector} org={String(user.orgId||'demo')}/></div>
}
function Questionnaire({sector,org}:{sector:Industry;org:string}){
 const key=`allneeds.auto-diagnostic.v1.${org}.${sector}`
 const [answers,setAnswers]=useState<Answers>(()=>{try{return JSON.parse(localStorage.getItem(key)||'{}')}catch{return {}}})
 const [step,setStep]=useState(0)
 const [result,setResult]=useState(false)
 const [saveError,setSaveError]=useState('')
 function updateAnswers(next:Answers){setAnswers(next);try{localStorage.removeItem(key+'.review')}catch{}}
 const grid=DIAGNOSTIC_GRIDS[sector]
 const questions=grid.levers.flatMap(l=>l.questions)
 const completed=questions.filter(q=>Number.isInteger(answers[q.id])&&answers[q.id]>=1&&answers[q.id]<=5).length
 const complete=completed===questions.length
 useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(answers));setSaveError('')}catch{setSaveError('Le navigateur ne permet pas la sauvegarde. Gardez cet onglet ouvert.')}},[answers,key])
 let review:{status?:string;note?:string}={};try{review=JSON.parse(localStorage.getItem(key+'.review')||'{}')}catch{}
 const lever=grid.levers[step]
 const scores=grid.levers.map(l=>({...l,score:l.questions.reduce((n,q)=>n+(answers[q.id]||0),0),complete:l.questions.every(q=>answers[q.id]>=1&&answers[q.id]<=5)}))
 const priorities=questions.filter(q=>answers[q.id]&&answers[q.id]<=3).sort((a,b)=>answers[a.id]-answers[b.id]).slice(0,3)
 function exportReport(){const report={sector,date:new Date().toISOString(),status:'automatique_non_valide',scores:scores.map(l=>({axe:l.name,score:l.complete?l.score:null,max:l.questions.length*5})),answers:questions.map(q=>({question:q.text,score:answers[q.id]??null})),priorities:priorities.map(q=>q.text)};const url=URL.createObjectURL(new Blob([JSON.stringify(report,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`diagnostic-${sector}.json`;a.click();URL.revokeObjectURL(url)}
 return <div className="saas-panel" style={{marginTop:20}}>{saveError&&<p role="alert">{saveError}</p>}<div className="saas-toolbar"><strong>{completed} / {questions.length} questions renseignées</strong><span className="saas-muted">{saveError?'Sauvegarde indisponible':'Brouillon enregistré dans ce navigateur'}</span></div><div className="saas-progress"><div style={{width:`${completed/questions.length*100}%`}}/></div>
 {!result?<><p className="saas-kicker" style={{color:'#075985'}}>AXE {step+1} / {grid.levers.length}</p><h2>{lever.name}</h2><p className="saas-muted">Questions de la grille STARTER existante. Pour chaque point, évaluez votre niveau de maîtrise : 1 = point faible majeur · 3 = correct mais non structuré · 5 = maîtrisé. Une question non renseignée reste non évaluée.</p>{lever.questions.map(q=><div key={q.id} className="saas-question"><p>{q.text}</p><div className="saas-rating" role="group" aria-label={q.text}>{[1,2,3,4,5].map(n=><button key={n} aria-pressed={answers[q.id]===n} onClick={()=>updateAnswers({...answers,[q.id]:n})}>{n}</button>)}<button onClick={()=>{const next={...answers};delete next[q.id];updateAnswers(next)}}>Non évalué</button></div></div>)}<div className="saas-footer-actions"><button disabled={step===0} onClick={()=>setStep(step-1)}>← Précédent</button>{step<grid.levers.length-1?<button className="saas-primary" onClick={()=>setStep(step+1)}>Continuer →</button>:<button className="saas-primary" onClick={()=>setResult(true)}>Voir mon bilan</button>}</div></>:<><h2>Votre bilan organisationnel</h2>{review.status&&<div className="saas-result"><strong>{review.status}</strong><p>{review.note}</p></div>}<p className="saas-muted">{complete?'Autoévaluation complète':'Bilan partiel : complétez les questions restantes pour obtenir le score global.'} · Résultat automatique non validé.</p><div className="saas-stats"><article><span>Score global</span><strong>{complete?scores.reduce((n,l)=>n+l.score,0)+' / '+questions.length*5:'À compléter'}</strong></article><article><span>Axes renseignés</span><strong>{scores.filter(l=>l.complete).length} / {scores.length}</strong></article></div>{scores.map(l=><div className="saas-result" key={l.id}><strong>{l.name}</strong><p>{l.complete?`${l.score} / ${l.questions.length*5}`:'Axe incomplet · score non calculé'}</p>{l.complete&&<progress value={l.score} max={l.questions.length*5}/>}</div>)}<h3>Vos prochaines priorités</h3>{priorities.length?priorities.map((q,i)=><div className="saas-result" key={q.id}><strong>{i+1}. {q.text}</strong><p>Votre niveau déclaré : {answers[q.id]} / 5. Documentez la situation, nommez un responsable et définissez une action mesurable pour les 30 prochains jours.</p></div>):<p>{complete?'Aucun point faible déclaré. Consolidez les pratiques maîtrisées et suivez les résultats.':'Renseignez les questions pour identifier les priorités.'}</p>}<h3>Suite recommandée</h3><p>{!complete?'Complétez l’autoévaluation puis échangez avec ALLNEEDS pour confirmer les besoins.':priorities.length?'Un cadrage STARTER peut confirmer ces constats. Une mission PRO peut ensuite structurer les processus prioritaires, selon votre contexte.':'Échangez avec ALLNEEDS sur les opportunités d’amélioration continue et les besoins de prestataires.'} La proposition finale dépend de votre organisation et de vos objectifs.</p><div className="saas-footer-actions"><button onClick={()=>setResult(false)}>Modifier mes réponses</button><button onClick={exportReport}>Exporter le bilan JSON</button><button onClick={()=>window.print()}>Imprimer / PDF</button><Link to="/app/espace-metier">Ouvrir mon espace métier →</Link></div></>}
 </div>
}
