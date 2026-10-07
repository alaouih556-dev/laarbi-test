import { useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight, Check, FileCheck2, ShieldCheck } from 'lucide-react'
import { SECTORS } from '@/data/catalog'
import { FaqList } from '@/components/marketing'
import { Card } from '@/components/ui'
import type { Sector } from '@/types'
import { selectSector } from '@/lib/sector-filter'

const STORIES: Record<Sector, { headline: string; tension: string; symptoms: string[]; guardrail: string; faq: { q: string; a: string }[] }> = {
  enseignement: {
    headline: 'Quand les familles attendent une réponse et que tout remonte à la direction.',
    tension: 'Admissions, relances, rentrée : les sujets s’enchaînent et reposent souvent sur les mêmes personnes. Il devient difficile de savoir quelle action débloquera vraiment la situation.',
    symptoms: ['Des demandes d’information suivies dans plusieurs outils.', 'Des relances faites au dernier moment.', 'Des rôles et consignes qui manquent de clarté pour l’équipe.'],
    guardrail: 'Nous parlons d’organisation, d’admissions et d’échanges avec les familles, pas de pédagogie. Les données nominatives d’élèves restent dans votre établissement.',
    faq: [{q:'Le diagnostic porte-t-il sur la pédagogie ?',a:'Non. Il concerne l’organisation, les admissions, les échanges avec les familles, les outils et les besoins opérationnels.'},{q:'Faut-il transmettre des données d’élèves ?',a:'Non. Les processus peuvent être examinés sans recevoir de données nominatives.'},{q:'Que vais-je obtenir ?',a:'Une synthèse de la situation, les points d’appui et de blocage, puis trois priorités recommandées.'}],
  },
  sante: {
    headline: 'Quand l’accueil et l’organisation prennent le temps du soin.',
    tension: 'Appels, rendez-vous, annulations et imprévus sollicitent l’équipe toute la journée. Un regard extérieur aide à distinguer les irritants quotidiens des vrais leviers d’organisation.',
    symptoms: ['Des créneaux qui restent vides malgré les demandes.', 'Des annulations et relances difficiles à suivre.', 'Des rôles d’accueil et d’administration qui se chevauchent.'],
    guardrail: 'Le diagnostic porte sur l’organisation et l’administratif. Il ne concerne pas l’acte médical et ne nécessite aucun dossier patient nominatif.',
    faq: [{q:'Avez-vous besoin des dossiers patients ?',a:'Non. Nous travaillons à partir d’éléments d’organisation et de volumes, sans donnée patient nominative.'},{q:'Intervenez-vous sur les soins ?',a:'Non. Le diagnostic concerne l’organisation, l’accueil et les besoins opérationnels.'},{q:'Que vais-je obtenir ?',a:'Une synthèse des constats et trois priorités recommandées pour votre structure.'}],
  },
  tourisme: {
    headline: 'Quand les réservations et les messages se croisent au cœur de la saison.',
    tension: 'Les demandes arrivent sur plusieurs canaux, les réponses s’accumulent et les périodes fortes approchent. Avant d’ajouter un outil, il faut voir où les occasions se perdent.',
    symptoms: ['Des demandes dispersées entre plusieurs canaux.', 'Des réponses et relances difficiles à coordonner.', 'Une haute saison qui approche sans plan partagé.'],
    guardrail: 'Le diagnostic part de vos canaux, de votre saisonnalité et de vos outils actuels. Il n’impose pas le remplacement de votre système de réservation.',
    faq: [{q:'Devez-vous changer mon outil de réservation ?',a:'Non. Le premier échange commence par vos outils et vos habitudes actuels.'},{q:'Cela concerne-t-il la restauration et les expériences ?',a:'Oui. Les questions sont adaptées à votre activité touristique.'},{q:'Que vais-je obtenir ?',a:'Une synthèse des points de friction et trois priorités recommandées.'}],
  },
}

export function SectorPage({ sector }: { sector: Sector }) {
  useEffect(() => { selectSector(sector) }, [sector])
  const content = SECTORS[sector]
  const story = STORIES[sector]

  return <div className="bg-white">
    <section className="relative isolate overflow-hidden bg-[#f8fbff]">
      <div aria-hidden="true" className="absolute inset-y-0 right-0 -z-10 w-1/2 bg-[radial-gradient(ellipse_at_80%_35%,#ddecff,transparent_70%)]"/>
      <div className="container-page grid items-center gap-12 py-16 sm:py-20 lg:min-h-[540px] lg:grid-cols-[1fr_.8fr] lg:py-24">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-700">Une réalité métier · {content.name}</p><h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.1] tracking-[-.04em] sm:text-5xl">{story.headline}</h1><p className="mt-6 max-w-2xl text-lg leading-8 text-ink-600">{story.tension}</p><div className="mt-8 flex flex-wrap gap-3"><Link to="/inscription" className="inline-flex min-h-14 items-center gap-2 rounded-full bg-brand-700 px-7 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-800">Faire le point gratuitement <ArrowRight className="h-4 w-4"/></Link><a href="#methode" className="inline-flex min-h-14 items-center rounded-full px-5 text-sm font-semibold text-ink-700 hover:bg-white">Découvrir l’approche</a></div><p className="mt-4 text-sm text-ink-500">Environ 2h15 · sans obligation de poursuivre</p></div>
        <Card className="rounded-[1.75rem] border-white bg-white/90 p-6 shadow-[0_30px_80px_rgba(22,47,85,.10)] sm:p-8"><p className="text-xs font-bold uppercase tracking-[.16em] text-ink-400">Peut-être que vous vivez cela</p><h2 className="mt-3 font-display text-2xl font-semibold leading-snug">Les symptômes sont visibles. La bonne priorité l’est moins.</h2><div className="mt-6 space-y-3">{story.symptoms.map((item)=><div key={item} className="flex items-start gap-3 rounded-xl bg-[#f8fafc] p-4"><span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-brand-700"><Check className="h-3.5 w-3.5"/></span><p className="text-sm leading-6 text-ink-700">{item}</p></div>)}</div></Card>
      </div>
    </section>

    <section id="methode" className="container-page py-20 sm:py-24"><div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-700">Le diagnostic, sans jargon</p><h2 className="mt-4 font-display text-4xl font-semibold tracking-[-.035em] sm:text-5xl">Comprendre avant d’ajouter une solution.</h2><p className="mt-5 text-base leading-7 text-ink-600">Un échange guidé pour transformer une impression de surcharge en prochaines étapes compréhensibles.</p></div><div className="mt-12 grid gap-4 md:grid-cols-3">{[['01','On écoute','Votre activité, vos objectifs et les échéances qui approchent.'],['02','On met à plat','Les faits, les points d’appui et les difficultés sont examinés ensemble.'],['03','On priorise','Vous validez trois priorités et choisissez la suite qui vous convient.']].map(([n,title,desc])=><article key={n} className="rounded-[1.5rem] border border-ink-100 bg-white p-7"><span className="font-display text-3xl font-semibold text-brand-700">{n}</span><h3 className="mt-5 font-display text-2xl font-semibold">{title}</h3><p className="mt-3 text-sm leading-7 text-ink-600">{desc}</p></article>)}</div></section>

    <section className="bg-[#f7f9fc] py-20 sm:py-24"><div className="container-page grid items-start gap-10 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-700">Vous repartez avec</p><h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-.035em]">De la clarté, même si vous vous arrêtez là.</h2><p className="mt-5 text-base leading-7 text-ink-600">La valeur du diagnostic ne dépend pas d’une mission ensuite. Vous repartez avec une lecture utile pour décider.</p><Link to="/inscription" className="mt-7 inline-flex items-center gap-2 font-bold text-brand-700">Choisir mon créneau <ArrowRight className="h-4 w-4"/></Link></div><div className="grid gap-4 sm:grid-cols-3">{[{icon:FileCheck2,title:'Un état des lieux',detail:'La situation observée, résumée clairement.'},{icon:ShieldCheck,title:'Les points à éclaircir',detail:'Ce qui fonctionne et ce qui mérite attention.'},{icon:Check,title:'3 priorités',detail:'Des axes à valider ensemble avant toute suite.'}].map(({icon:Icon,title,detail})=><Card key={title} className="p-6"><span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><Icon className="h-5 w-5"/></span><h3 className="mt-5 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-ink-600">{detail}</p></Card>)}</div></div></section>

    <section className="container-page py-20 sm:py-24"><div className="mx-auto max-w-3xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-700">Un cadre qui respecte votre métier</p><h2 className="mt-4 font-display text-4xl font-semibold tracking-[-.035em]">Votre activité reste au centre. Vos limites aussi.</h2><p className="mt-5 text-base leading-7 text-ink-600">{story.guardrail}</p><div className="mt-8 grid gap-3 sm:grid-cols-2"><div className="rounded-2xl border border-ink-100 p-5"><p className="font-semibold">Pas de vente forcée</p><p className="mt-2 text-sm leading-6 text-ink-600">Une suite n’est proposée que si elle répond à un besoin validé.</p></div><div className="rounded-2xl border border-ink-100 p-5"><p className="font-semibold">Tout est cadré avant accord</p><p className="mt-2 text-sm leading-6 text-ink-600">Périmètre, livrables, calendrier et prix sont présentés avant toute mission.</p></div></div><div className="mt-12"><FaqList items={story.faq}/></div></div></section>

    <section className="container-page pb-20 sm:pb-24"><div className="rounded-[2rem] bg-ink-950 px-7 py-10 text-white sm:px-12 sm:py-14"><div className="flex flex-col gap-7 lg:flex-row lg:items-center lg:justify-between"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-sky-300">Le premier pas</p><h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">Votre situation mérite un vrai temps de recul.</h2><p className="mt-4 text-base leading-7 text-ink-200">Réservez un échange offert d’environ 2h15. Vous gardez la liberté de décider après.</p></div><Link to="/inscription" className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 font-bold text-ink-950 transition hover:bg-brand-50">Choisir mon créneau <ArrowRight className="h-4 w-4"/></Link></div></div></section>
  </div>
}
