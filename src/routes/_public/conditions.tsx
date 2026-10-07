import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowRight, Check, ShieldCheck } from 'lucide-react'
import { Alert, Card } from '@/components/ui'

export const Route = createFileRoute('/_public/conditions')({
  component: ConditionsPage,
  head: () => ({ meta: [{ title: 'Notre cadre d’intervention — ALLNEEDS' }] }),
})

const rules = [
  { title: 'Le diagnostic vous appartient', detail: 'Le premier échange permet de faire un état des lieux et de recommander trois priorités. Vous restez libre de poursuivre ou non.' },
  { title: 'Tout est cadré avant accord', detail: 'Si une suite est pertinente, le périmètre, les livrables, le calendrier, le prix et les limites sont présentés dans votre espace et sur un devis écrit avant votre décision.' },
  { title: 'Aucune promesse sans mesure', detail: 'Les opportunités et les résultats attendus sont évalués à partir de la situation réelle de votre établissement.' },
  { title: 'Les prestataires restent responsables', detail: 'Pour les prestations externalisées, le contrat est conclu directement entre votre établissement et le prestataire. Toute commission éventuelle est signalée.' },
]

export function ConditionsPage() {
  return <>
    <section className="border-b border-ink-100 bg-ink-50"><div className="container-page py-16"><p className="eyebrow">Transparence & confiance</p><h1 className="display-1 mt-4 max-w-3xl">Un cadre clair avant chaque décision.</h1><p className="lede mt-5 max-w-2xl">Le diagnostic commence par votre réalité. Si vous souhaitez aller plus loin, vous connaissez le contenu, le prix et les limites avant de vous engager.</p></div></section>
    <section className="container-page grid gap-8 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:py-16">
      <Card className="h-fit p-6"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700"><ShieldCheck size={21}/></span><h2 className="mt-4 font-display text-xl font-bold text-ink-950">Vos informations restent utiles et limitées.</h2><p className="mt-3 text-sm leading-relaxed text-ink-600">Les informations transmises servent à comprendre votre demande et préparer le diagnostic. Les sujets sensibles propres à votre secteur restent protégés et cadrés avec vous.</p></Card>
      <div className="space-y-3">{rules.map((rule) => <Card key={rule.title} className="flex gap-4 p-5"><span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700"><Check size={15}/></span><div><h2 className="font-semibold text-ink-950">{rule.title}</h2><p className="mt-1 text-sm leading-relaxed text-ink-600">{rule.detail}</p></div></Card>)}</div>
    </section>
    <section className="container-page pb-16"><Alert tone="warning" title="Version de démonstration">Cette plateforme présente un prototype. Les mentions légales, les coordonnées de l’entreprise et les conditions contractuelles définitives doivent être validées avant commercialisation.</Alert><Link to="/inscription" className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-700 px-5 py-3 text-sm font-bold text-white">Prendre rendez-vous pour le diagnostic <ArrowRight size={16}/></Link></section>
  </>
}
