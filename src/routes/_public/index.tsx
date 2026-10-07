import { Link, createFileRoute } from '@tanstack/react-router'
import { ArrowDown, ArrowRight, BadgeCheck, Check, Compass, FileCheck2, GraduationCap, HeartPulse, Sparkles } from 'lucide-react'

export const Route = createFileRoute('/_public/')({
  component: Home,
  head: () => ({ meta: [
    { title: 'ALLNEEDS — Retrouver le fil, choisir la bonne priorité' },
    { name: 'description', content: 'Un premier échange offert pour dirigeants de la santé, de l’enseignement et du tourisme. Faites le point, clarifiez vos priorités et décidez librement de la suite.' },
  ] }),
})

const sectors = [
  { id: 'enseignement' as const, name: 'Enseignement', audience: 'Écoles · Crèches · Formation', icon: GraduationCap, story: 'Les demandes s’accumulent, les familles attendent, et tout remonte à la direction.', question: 'Comment rendre les admissions et le suivi plus fluides ?', color: 'bg-sky-50 text-sky-800' },
  { id: 'sante' as const, name: 'Santé', audience: 'Cabinets · Centres · Laboratoires', icon: HeartPulse, story: 'L’accueil jongle entre rendez-vous, appels et imprévus. Le temps de soin se fragmente.', question: 'Où simplifier l’organisation sans toucher aux soins ?', color: 'bg-rose-50 text-rose-800' },
  { id: 'tourisme' as const, name: 'Tourisme', audience: 'Riads · Hôtels · Restaurants', icon: Compass, story: 'Les demandes arrivent de partout, tandis que la saison, elle, n’attend pas.', question: 'Que préparer pour accueillir mieux et perdre moins d’occasions ?', color: 'bg-amber-50 text-amber-900' },
]

function Home() {
  return <div className="overflow-hidden bg-white text-ink-950">
    <section className="relative isolate">
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_65%_at_90%_12%,#e3f1ff,transparent_70%)]" />
      <div className="container-page grid items-center gap-14 py-16 sm:py-20 lg:min-h-[620px] lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:py-24">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-100 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-800 shadow-sm"><Sparkles className="h-4 w-4" /> Pour les dirigeants qui portent beaucoup</div>
          <h1 className="mt-7 font-display text-[2.8rem] font-semibold leading-[1.06] tracking-[-0.045em] sm:text-6xl lg:text-[4.25rem]">Quand tout devient prioritaire, il est temps de <span className="text-brand-700">retrouver le fil.</span></h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-ink-600">Vous gérez les urgences, l’équipe, les clients et les décisions. ALLNEEDS vous aide à prendre du recul, repérer le vrai sujet et choisir une prochaine étape utile.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/inscription" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full bg-brand-700 px-7 text-base font-bold text-white shadow-[0_12px_30px_rgba(15,88,207,.22)] transition hover:-translate-y-0.5 hover:bg-brand-800">Faire le point gratuitement <ArrowRight className="h-4 w-4" /></Link>
            <Link to="/diagnostic" className="inline-flex min-h-14 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-ink-700 transition hover:bg-white">Voir comment ça se passe <ArrowDown className="h-4 w-4" /></Link>
          </div>
          <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-sm text-ink-500"><span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600"/> 2h15 pour y voir clair</span><span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600"/> Trois priorités écrites</span><span className="inline-flex items-center gap-1.5"><Check className="h-4 w-4 text-emerald-600"/> Vous décidez de la suite</span></div>
        </div>
        <div className="relative mx-auto w-full max-w-[540px] lg:mr-0">
          <div className="absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-to-br from-brand-100/80 via-sky-50 to-white blur-2xl" />
          <div className="rounded-[2rem] border border-white bg-white p-5 shadow-[0_35px_100px_rgba(22,47,85,.14)] sm:p-7">
            <div className="flex items-start justify-between gap-4 border-b border-ink-100 pb-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-brand-700">Le point de départ</p><h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">Votre situation, mise à plat.</h2></div><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-50 text-brand-700"><FileCheck2 className="h-6 w-6"/></div></div>
            <div className="mt-5 space-y-3">
              {[['01','Ce qui fonctionne','Vos forces et les ressources déjà en place.'],['02','Ce qui vous freine','Les irritants qui coûtent du temps ou de l’énergie.'],['03','Ce qui vient ensuite','Trois priorités, puis une décision qui vous appartient.']].map(([n,title,desc],i)=><div key={n} className={`flex gap-4 rounded-2xl p-4 ${i===2?'bg-brand-50/80':'bg-ink-50/70'}`}><span className={`font-display text-lg font-semibold ${i===2?'text-brand-700':'text-ink-400'}`}>{n}</span><div><p className="font-semibold text-ink-900">{title}</p><p className="mt-1 text-sm leading-6 text-ink-600">{desc}</p></div></div>)}
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4"><BadgeCheck className="h-5 w-5 shrink-0 text-emerald-700"/><p className="text-sm leading-6 text-emerald-950">Le diagnostic sert à décider. Il ne vous oblige pas à acheter une mission.</p></div>
            <p className="mt-4 text-center text-xs leading-5 text-ink-400">Exemple de restitution · les constats dépendent de votre situation réelle.</p>
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-2xl border border-ink-100 bg-white px-5 py-4 shadow-lg sm:block"><p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Le résultat</p><p className="mt-1 font-semibold text-ink-900">Une prochaine étape, pas du flou.</p></div>
        </div>
      </div>
    </section>

    <section className="border-y border-ink-100 bg-[#f8fafc]">
      <div className="container-page grid gap-8 py-7 sm:grid-cols-3 sm:gap-10 sm:py-9">
        {[['2h15','un échange cadré'],['3','priorités à valider ensemble'],['0','obligation de poursuivre']].map(([big,small])=><div key={big} className="flex items-baseline gap-3 sm:block"><span className="font-display text-3xl font-semibold tracking-tight text-ink-950">{big}</span><span className="text-sm text-ink-500 sm:mt-1 sm:block">{small}</span></div>)}
      </div>
    </section>

    <section className="container-page py-20 sm:py-28">
      <div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-700">Vous n’avez pas à tout résoudre seul</p><h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-.035em] sm:text-5xl">On connaît le poids des journées qui débordent.</h2><p className="mt-5 text-lg leading-8 text-ink-600">Une demande oubliée, une équipe qui attend une décision, une saison qui approche. Ce n’est pas toujours un manque d’effort : parfois, il manque juste un regard extérieur et un ordre clair.</p></div>
      <div className="mt-12 grid gap-4 md:grid-cols-3">
        {sectors.map(({id,name,audience,icon:Icon,story,question,color})=><Link key={id} to="/secteurs/$sector" params={{sector:id}} className="group flex min-h-[300px] flex-col rounded-[1.75rem] border border-ink-100 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[0_24px_60px_rgba(22,47,85,.10)] sm:p-8"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${color}`}><Icon className="h-6 w-6"/></span><p className="mt-6 text-xs font-bold uppercase tracking-[.14em] text-ink-400">{audience}</p><h3 className="mt-2 font-display text-2xl font-semibold">{name}</h3><p className="mt-3 text-sm leading-6 text-ink-600">{story}</p><p className="mt-auto border-t border-ink-100 pt-5 text-sm font-semibold leading-6 text-ink-800">{question}</p><span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-brand-700">Voir notre approche <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1"/></span></Link>)}
      </div>
    </section>

    <section className="bg-ink-950 text-white">
      <div className="container-page grid gap-12 py-20 sm:py-24 lg:grid-cols-[.9fr_1.1fr] lg:items-center">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-sky-300">Un parcours simple et humain</p><h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-.035em] sm:text-5xl">D’abord comprendre. Ensuite seulement, agir.</h2><p className="mt-5 max-w-xl text-base leading-7 text-ink-200">Le diagnostic crée un espace pour parler de votre réalité, pas pour vous vendre une réponse toute faite.</p><Link to="/diagnostic" className="mt-7 inline-flex items-center gap-2 font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">Découvrir le déroulé <ArrowRight className="h-4 w-4"/></Link></div>
        <div className="space-y-3">{[['01','On écoute le terrain','Votre activité, vos échéances, ce qui coince et ce qui compte.'],['02','On fait apparaître le vrai sujet','Les faits et les pistes sont distingués ; les priorités se valident avec vous.'],['03','Vous choisissez la suite','Vous repartez avec une synthèse. Toute mission éventuelle est cadrée et chiffrée avant accord.']].map(([n,title,desc],i)=><div key={n} className="grid grid-cols-[3.5rem_1fr] gap-4 rounded-2xl border border-white/10 bg-white/[.045] p-5 sm:p-6"><span className={`font-display text-2xl font-semibold ${i===2?'text-sky-300':'text-white/40'}`}>{n}</span><div><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-ink-200">{desc}</p></div></div>)}</div>
      </div>
    </section>

    <section className="container-page py-20 sm:py-24">
      <div className="grid gap-12 lg:grid-cols-[.72fr_1.28fr]">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-700">Une relation saine dès le début</p><h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-.035em]">Vous gardez la main.</h2><p className="mt-5 text-base leading-7 text-ink-600">Le premier échange permet de comprendre et de prioriser. Si un accompagnement est pertinent, vous en connaissez le contenu et le prix avant de décider.</p><Link to="/a-propos" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-700">Nos engagements <ArrowRight className="h-4 w-4"/></Link></div>
        <div className="grid gap-3 sm:grid-cols-2">{[['Pas de catalogue plaqué','Votre contexte vient avant la solution.'],['Pas de promesse magique','Les recommandations partent de faits à vérifier.'],['Un périmètre lisible','Livrables, limites et prix sont précisés avant toute mission.'],['Une décision libre','Vous choisissez de continuer ou de vous arrêter après le diagnostic.']].map(([title,detail])=><article key={title} className="rounded-2xl border border-ink-100 bg-[#fbfcfe] p-6"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Check className="h-5 w-5"/></span><h3 className="mt-4 font-semibold">{title}</h3><p className="mt-2 text-sm leading-6 text-ink-600">{detail}</p></article>)}</div>
      </div>
    </section>

    <section className="container-page pb-20 sm:pb-28"><div className="relative overflow-hidden rounded-[2rem] bg-brand-50 px-7 py-10 sm:px-12 sm:py-14"><div aria-hidden="true" className="absolute -right-20 -top-28 h-72 w-72 rounded-full bg-white/70 blur-2xl"/><div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-800">Votre prochain pas peut être simple</p><h2 className="mt-3 font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Commençons par une conversation utile.</h2><p className="mt-4 text-base leading-7 text-ink-700">Un diagnostic offert d’environ 2h15. Trois priorités écrites. Puis vous décidez, sans pression, si vous voulez aller plus loin.</p></div><Link to="/inscription" className="inline-flex min-h-14 shrink-0 items-center justify-center gap-2 rounded-full bg-brand-700 px-7 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-brand-800">Choisir mon créneau <ArrowRight className="h-4 w-4"/></Link></div></div></section>
  </div>
}
