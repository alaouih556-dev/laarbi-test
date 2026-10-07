import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowRight, CheckCircle2, LockKeyhole, Rocket, Upload } from 'lucide-react'
import { useDemo } from '@/store/store'
import { AuthLayout } from '@/components/AuthLayout'
import { Alert, Button, Card, Progress, Steps, Textarea, Field } from '@/components/ui'
import { SECTOR_LABEL } from '@/data/catalog'

const STEP_LABELS = ['Contexte', 'Pièces utiles', 'Accès']
export const Route = createFileRoute('/onboarding')({ component: OnboardingPage, head:()=>({meta:[{title:'Onboarding — ALLNEEDS'}]}) })

export function OnboardingPage(){
 const navigate=useNavigate(); const {state,dispatch}=useDemo(); const [step,setStep]=useState(0); const [priority,setPriority]=useState(''); const [difficulty,setDifficulty]=useState(''); const [documents,setDocuments]=useState<string[]>([])
 const profile=state.registrationProfile
 const docs=['Organigramme et répartition des rôles','Grille tarifaire en vigueur','Historique des demandes (Excel, mail, cahier)','Contrats de charges et assurances','Comptes des réseaux sociaux']
 function finish(){dispatch({type:'SET_ONBOARDED',value:true});dispatch({type:'TOAST_ADD',toast:{title:'Onboarding terminé',description:'Votre espace client est prêt.',tone:'success'}});navigate({to:'/app'})}
 return <AuthLayout title="Bienvenue. Trois étapes, et c’est parti." subtitle="Nous préparons uniquement l’espace correspondant à votre activité." footer={<button type="button" onClick={()=>navigate({to:'/app'})} className="text-xs font-semibold text-ink-400 hover:text-ink-700">Passer cette étape pour l’instant</button>}>
  <Progress value={Math.round(((step+1)/STEP_LABELS.length)*100)} className="mb-6" />
  {step===0?<div className="space-y-5"><Alert tone="info" title="Onboarding progressif">Votre identité, activité, ville et situation ont déjà été demandées à l’inscription. Ici, nous demandons seulement la difficulté principale et l’objectif prioritaire : aucune information inutile au démarrage.</Alert><Field label="Quelle est votre principale difficulté aujourd’hui ?" hint="Une phrase courte suffit."><Textarea rows={3} value={difficulty} onChange={(e)=>setDifficulty(e.target.value)} placeholder="Ex. : trop de demandes dispersées, manque de visibilité, recrutement…" /></Field><Field label="Quel résultat voulez-vous obtenir en priorité ?" hint="L’objectif guide les actions proposées ensuite."><Textarea rows={3} value={priority} onChange={(e)=>setPriority(e.target.value)} placeholder="Ex. : augmenter les ventes, recruter, réduire les charges…" /></Field></div>:null}
  {step===1?<div className="space-y-4"><p className="text-sm text-ink-600">Sélectionnez les éléments que vous pourrez transmettre. Rien n’est envoyé à cette étape.</p><div className="space-y-2">{docs.map((doc)=>{const selected=documents.includes(doc);return <button key={doc} type="button" onClick={()=>setDocuments((v)=>selected?v.filter((x)=>x!==doc):[...v,doc])} className={`flex w-full items-center justify-between gap-3 rounded-lg border px-4 py-3 text-left text-sm transition ${selected?'border-brand-600 bg-brand-50 text-brand-900':'border-ink-200 hover:border-ink-400'}`}>{doc}{selected?<CheckCircle2 className="h-4 w-4 text-brand-700"/>:<Upload className="h-4 w-4 text-ink-300"/>}</button>})}</div></div>:null}
  {step===2?<div className="space-y-5"><Card className="p-5"><div className="flex items-start gap-3"><LockKeyhole className="mt-0.5 h-5 w-5 text-brand-700"/><div><p className="text-sm font-semibold text-ink-950">Espace métier {profile?SECTOR_LABEL[profile.sector]:'ALLNEEDS'}</p><p className="mt-1 text-xs leading-relaxed text-ink-500">Le SaaS de votre secteur sera visible mais verrouillé jusqu’à activation par ALLNEEDS. Les autres secteurs ne seront pas affichés.</p></div></div></Card><Card className="p-5"><p className="text-sm font-semibold text-ink-950">ALLNEEDS ACCÈS reste optionnel à ce stade</p><p className="mt-2 text-xs leading-relaxed text-ink-500">CONNECT, PLUS et PRIORITÉ seront disponibles dans votre compte avec les quotas, délais et services prévus dans la fiche. Aucun abonnement n’est activé automatiquement à l’inscription.</p></Card></div>:null}
  <div className="mt-8 flex items-center justify-between gap-3"><Button variant="ghost" onClick={()=>setStep((v)=>Math.max(0,v-1))} disabled={step===0}>Retour</Button>{step<2?<Button onClick={()=>setStep((v)=>v+1)}>Continuer <ArrowRight className="h-4 w-4"/></Button>:<Button onClick={finish}><Rocket className="h-4 w-4"/>Terminer</Button>}</div><Steps steps={STEP_LABELS} current={step} className="mt-8"/>
 </AuthLayout>
}
