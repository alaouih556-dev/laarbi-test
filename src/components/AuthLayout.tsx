import type { ReactNode } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft, ClipboardCheck, Network, ShieldCheck } from 'lucide-react'
import { LaunchBanner, PublicHeader } from '@/components/marketing'

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  wide = false,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
  wide?: boolean
}) {
  return (
    <>
      <LaunchBanner />
      <PublicHeader />
      <div className="grid min-h-screen bg-[#f8fafc] lg:grid-cols-[1.05fr_.95fr]">
        <div className="flex flex-col justify-center px-4 py-12 sm:px-8 lg:px-14 xl:px-20">
          <div className={`mx-auto w-full ${wide ? 'max-w-2xl' : 'max-w-md'}`}>
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/allneeds-icon.svg" alt="" className="h-9 w-9 rounded-lg" />
              <span className="font-display text-lg font-extrabold tracking-tight text-ink-950">all<span className="text-brand-700">needs</span></span>
            </Link>

            <h1 className="mt-10 font-display text-4xl font-semibold leading-tight tracking-[-.04em] text-ink-950 sm:text-5xl">{title}</h1>
            <p className="mt-3 max-w-lg text-base leading-7 text-ink-600">{subtitle}</p>

            <div className="mt-8">{children}</div>

            {footer ? <div className="mt-8 text-center text-sm text-ink-500">{footer}</div> : null}

            <Link
              to="/"
              className="mt-10 inline-flex items-center gap-1.5 text-xs font-semibold text-ink-400 transition hover:text-ink-700"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Retour au site
            </Link>
          </div>
        </div>

        <div className="relative hidden overflow-hidden bg-ink-950 lg:block">
          <div className="grid-fade pointer-events-none absolute inset-0 opacity-20" />
          <div className="relative mx-auto flex h-full max-w-2xl flex-col justify-center px-8 py-12 text-white xl:px-14">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-cyan-200"><span className="h-1.5 w-1.5 rounded-full bg-cyan-300"/>Une plateforme · trois secteurs</div>
            <p className="mt-7 max-w-xl font-display text-4xl font-semibold leading-tight tracking-[-.035em] xl:text-5xl">En 2h15, passons du trop-plein à un cap clair.</p>
            <p className="mt-4 max-w-lg text-base leading-7 text-ink-200">Votre premier échange sert à comprendre votre quotidien, faire émerger trois priorités et vous laisser décider de la suite.</p>

            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              {[
                { icon: ClipboardCheck, title: 'On écoute', detail: 'Votre activité, vos échéances, vos irritants.' },
                { icon: Network, title: 'On met à plat', detail: 'Les faits et les priorités à valider ensemble.' },
                { icon: ShieldCheck, title: 'Vous décidez', detail: 'Aucune mission sans votre accord.' },
              ].map(({ icon: Icon, title, detail }) => <div key={title} className="rounded-2xl border border-white/10 bg-white/[0.055] p-4"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-cyan-300"><Icon size={18}/></span><p className="mt-3 text-sm font-semibold text-white">{title}</p><p className="mt-1 text-xs leading-relaxed text-ink-200">{detail}</p></div>)}
            </div>

            <div className="mt-7 flex flex-wrap gap-2">{['Santé','Enseignement','Tourisme'].map((sector) => <span key={sector} className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-ink-100">{sector}</span>)}</div>
            <p className="mt-8 text-[11px] text-ink-400">Aperçu de démonstration · les comptes et données affichés sont fictifs.</p>
          </div>
        </div>
      </div>
    </>
  )
}
