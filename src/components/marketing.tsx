import { useState, type ReactNode } from 'react'
import { Link, type LinkProps } from '@tanstack/react-router'
import {
  ArrowRight,
  Check,
  ChevronDown,
  GraduationCap,
  HeartPulse,
  Menu,
  Minus,
  Plane,
  X,
} from 'lucide-react'
import { LAUNCH_OFFER, SECTORS, SECTOR_LABEL, SECTOR_ORDER } from '@/data/catalog'
import { cn } from '@/lib/utils'
import { clearSelectedSector, useSelectedSector } from '@/lib/sector-filter'
import { Badge, Button, Card } from '@/components/ui'
import type { FeatureRow, MissionCode, Sector } from '@/types'

/* ------------------------------------------------------------------ */
/* Banner                                                              */
/* ------------------------------------------------------------------ */

export function LaunchBanner() {
  return (
    <div className="bg-ink-950 text-white">
      <div className="container-page flex min-h-10 flex-wrap items-center justify-center gap-x-2 gap-y-1 py-2 text-center text-xs">
        <span className="font-semibold text-sand-300">Premier échange offert</span>
        <span className="text-ink-300">·</span>
        <span className="text-ink-200">2h15 pour clarifier vos priorités, sans engagement</span>
        <Link to="/inscription" className="ml-1 inline-flex items-center gap-1 font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
          Choisir un créneau <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Header                                                              */
/* ------------------------------------------------------------------ */

const BASE_PUBLIC_LINKS = [
  { label: 'Nos secteurs', to: '/secteurs' },
  { label: 'Le diagnostic', to: '/diagnostic' },
  { label: 'À propos', to: '/a-propos' },
  { label: 'FAQ', to: '/faq' },
] as const

export function PublicHeader() {
  const [open, setOpen] = useState(false)
  const selectedSector = useSelectedSector()
  const publicLinks = [
    { label: 'Accueil', to: '/' as const },
    ...(selectedSector ? [{ label: SECTOR_LABEL[selectedSector], to: `/secteurs/${selectedSector}` as const }] : []),
    ...BASE_PUBLIC_LINKS,
  ]

  return (
    <header className="public-sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur">
      <div className="container-page flex h-[4.5rem] items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/allneeds-logo.svg" alt="allneeds — Find it. Get it. Fast." className="h-10 w-auto" />
        </Link>

        <nav className="hidden items-center gap-1.5 lg:flex">
          {publicLinks.map((link) => (
            <PublicNavigationLink
              key={link.to}
              to={link.to} sector={selectedSector}

              className="rounded-full px-3.5 py-2.5 text-sm font-medium text-ink-600 transition hover:bg-ink-50 hover:text-ink-950"
              activeProps={{ className: 'bg-ink-50 text-ink-950' }}
            >
              {link.label}
            </PublicNavigationLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/connexion">
            <Button variant="ghost" size="sm">
              Connexion
            </Button>
          </Link>
          <Link to="/inscription">
            <Button size="sm">
              Diagnostic offert
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-ink-700 transition hover:bg-ink-100 lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-ink-100 bg-white lg:hidden">
          <div className="container-page space-y-1 py-4">
            {publicLinks.map((link) => (
              <PublicNavigationLink
                key={link.to}
                to={link.to} sector={selectedSector}

                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-ink-700 hover:bg-ink-50"
              >
                {link.label}
              </PublicNavigationLink>
            ))}
            <div className="grid gap-2 pt-3">
              <Link to="/inscription" onClick={() => setOpen(false)}>
                <Button fullWidth size="sm">
                  Commencer
                </Button>
              </Link>
              <Link to="/connexion" onClick={() => setOpen(false)}>
                <Button fullWidth size="sm" variant="outline">
                  Connexion
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function PublicFooter() {
  const selectedSector = useSelectedSector()
  return (
    <footer className="mt-24 border-t border-ink-100 bg-ink-50">
      <div className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(4,minmax(0,1fr))]">
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <img src="/allneeds-logo.svg" alt="allneeds — Find it. Get it. Fast." className="h-10 w-auto" />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-600">
              Votre réseau de solutions pour entreprises et établissements. Nous partons de votre situation, pas d’un
              catalogue.
            </p>
            <p className="mt-4 text-xs text-ink-500">
              Un premier échange pour clarifier vos priorités et décider de la suite.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Secteurs</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {(selectedSector ? [selectedSector] : SECTOR_ORDER).map((sector) => (
                <li key={sector}>
                  <Link to="/secteurs/$sector" params={{ sector }} className="text-ink-600 transition hover:text-ink-950">
                    {SECTOR_LABEL[sector]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Diagnostic offert</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/inscription" className="text-ink-600 transition hover:text-ink-950">
                  Diagnostic offert
                </Link>
              </li>
              <li>
                <Link to="/inscription" className="text-ink-600 transition hover:text-ink-950">
                  Comprendre votre situation
                </Link>
              </li>
              <li>
                <Link to="/inscription" className="text-ink-600 transition hover:text-ink-950">
                  Définir les prochaines étapes
                </Link>
              </li>
              <li>
                <Link to="/inscription" className="text-ink-600 transition hover:text-ink-950">
                  Réserver un échange
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">Ressources</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/inscription" className="text-ink-600 transition hover:text-ink-950">
                  Diagnostic offert
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-ink-600 transition hover:text-ink-950">
                  FAQ
                </Link>
              </li>

              <li>
                <Link to="/inscription" className="text-ink-600 transition hover:text-ink-950">
                  Réserver un diagnostic
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-ink-400">ALLNEEDS</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link to="/a-propos" className="text-ink-600 transition hover:text-ink-950">
                  Qui sommes-nous
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-ink-600 transition hover:text-ink-950">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/conditions" className="text-ink-600 transition hover:text-ink-950">
                  Conditions de l’offre
                </Link>
              </li>
              <li>
                <Link to="/inscription" className="text-ink-600 transition hover:text-ink-950">
                  Créer un compte
                </Link>
              </li>
            </ul>
            <div className="mt-5 space-y-1 text-xs text-ink-500">
              <p>Contact et informations légales disponibles avant toute souscription.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ink-200 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ALLNEEDS · Santé · Enseignement · Tourisme</p>
          <p>
            ALLNEEDS ne fournit pas de conseil juridique, fiscal ou comptable et ne négocie pas pour le compte du
            membre.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/* Sector switcher                                                     */
/* ------------------------------------------------------------------ */

const SECTOR_ICONS: Record<Sector, ReactNode> = {
  enseignement: <GraduationCap className="h-4 w-4" />,
  sante: <HeartPulse className="h-4 w-4" />,
  tourisme: <Plane className="h-4 w-4" />,
}

export function SectorTabs({ active }: { active?: Sector }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      {SECTOR_ORDER.map((sector) => (
        <Link
          key={sector}
          to="/secteurs/$sector"
          params={{ sector }}
          className={cn(
            'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition',
            active === sector
              ? 'border-ink-950 bg-ink-950 text-white'
              : 'border-ink-200 bg-white text-ink-600 hover:border-ink-400 hover:text-ink-950',
          )}
        >
          {SECTOR_ICONS[sector]}
          {SECTOR_LABEL[sector]}
        </Link>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Mission tabs                                                        */
/* ------------------------------------------------------------------ */

export function MissionTabs({ active, sector }: { active?: MissionCode; sector?: Sector }) {
  const codes: MissionCode[] = ['STARTER', 'PRO', 'PERFORMANCE']
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {codes.map((code) => (
        <Link
          key={code}
          to="/inscription"
          className={cn(
            'rounded-xl border px-4 py-3 transition',
            active === code
              ? 'border-brand-600 bg-brand-50 shadow-sm'
              : 'border-ink-200 bg-white hover:border-ink-400',
          )}
        >
          <p className={cn('text-sm font-bold', active === code ? 'text-brand-800' : 'text-ink-900')}>{code}</p>
          <p className="mt-0.5 text-xs text-ink-500">
            {code === 'STARTER' ? 'Comprendre' : code === 'PRO' ? 'Structurer' : 'Agir'}
          </p>
        </Link>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Comparison table                                                    */
/* ------------------------------------------------------------------ */

function Cell({ value }: { value: string | null }) {
  if (value === null) return <span className="text-ink-300">—</span>
  if (value === '✓') return <Check className="mx-auto h-4 w-4 text-emerald-600" />
  return <span className="text-ink-800">{value}</span>
}

export function ComparisonTable({ rows, caption }: { rows: FeatureRow[]; caption?: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-ink-50">
              <th className="w-[38%] border-b border-ink-100 px-5 py-4 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-ink-500">
                {caption ?? 'Comparatif des formules'}
              </th>
              {(['STARTER', 'PRO', 'PERFORMANCE'] as MissionCode[]).map((code) => (
                <th key={code} className="border-b border-ink-100 px-5 py-4 text-center text-xs font-bold text-ink-900">
                  {code}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.filter((row) => !/^prix/i.test(row.label)).map((row) => (
              <tr key={row.label} className="transition hover:bg-ink-50/60">
                <td className="border-b border-ink-50 px-5 py-3 text-ink-700">{row.label}</td>
                <td className="border-b border-ink-50 px-5 py-3 text-center">
                  <Cell value={row.values[0]} />
                </td>
                <td className="border-b border-ink-50 bg-brand-50/40 px-5 py-3 text-center">
                  <Cell value={row.values[1]} />
                </td>
                <td className="border-b border-ink-50 px-5 py-3 text-center">
                  <Cell value={row.values[2]} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* FAQ                                                                 */
/* ------------------------------------------------------------------ */

export function FaqList({ items, className }: { items: { q: string; a: string }[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div className={cn('divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white', className)}>
      {items.map((item, i) => {
        const isOpen = open === i
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              className="flex w-full items-start justify-between gap-4 px-5 py-4 text-left transition hover:bg-ink-50/60"
            >
              <span className="text-sm font-semibold text-ink-900">{item.q}</span>
              {isOpen ? <Minus className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" /> : <ChevronDown className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" />}
            </button>
            {isOpen ? <p className="animate-fade-in px-5 pb-5 text-sm leading-relaxed text-ink-600">{item.a}</p> : null}
          </div>
        )
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Sections                                                            */
/* ------------------------------------------------------------------ */

export function ReasonCards({ reasons }: { reasons: { title: string; detail: string }[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {reasons.map((reason, i) => (
        <Card key={reason.title} className="p-6">
          <span className="font-display text-3xl text-sand-400">0{i + 1}</span>
          <h3 className="mt-3 text-base font-semibold text-ink-950">{reason.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-600">{reason.detail}</p>
        </Card>
      ))}
    </div>
  )
}

export function LeverGrid({ levers }: { levers: { id: string; name: string; detail: string }[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {levers.map((lever) => (
        <Card key={lever.id} className="group p-5 transition hover:-translate-y-0.5 hover:shadow-lift">
          <h3 className="text-sm font-semibold text-ink-950">{lever.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-500">{lever.detail}</p>
        </Card>
      ))}
    </div>
  )
}

export function StepBlocks({ steps }: { steps: { code: MissionCode; title: string; detail: string }[] }) {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {steps.map((step, i) => (
        <div key={step.code} className="relative">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink-950 font-display text-lg text-sand-300">
              {i + 1}
            </span>
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-wider text-brand-700">{step.code}</p>
              <p className="text-sm font-semibold text-ink-950">{step.title.split('(')[0].trim()}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-ink-600">{step.detail}</p>
        </div>
      ))}
    </div>
  )
}

export function OneLiners({ lines, links }: { lines: Record<MissionCode, string>; links: Record<MissionCode, string> }) {
  const codes: MissionCode[] = ['STARTER', 'PRO', 'PERFORMANCE']
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {codes.map((code) => (
        <Card key={code} className="flex flex-col p-6">
          <Badge tone="brand">{code}</Badge>
          <p className="mt-4 flex-1 font-display text-xl leading-snug text-ink-900">{lines[code]}</p>
          <Link
            to="/inscription"
            
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition hover:text-brand-900"
          >
            {links[code]}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </Card>
      ))}
    </div>
  )
}

export function CtaBand({
  title,
  description,
  primary = { label: 'Commencer par le diagnostic', to: '/diagnostic' },
  secondary = { label: 'Contacter notre équipe', to: '/contact' },
}: {
  title: string
  description: string
  primary?: { label: string; to: LinkProps['to'] }
  secondary?: { label: string; to: LinkProps['to'] } | null
}) {
  return (
    <section className="container-page py-6">
      <div className="relative overflow-hidden rounded-3xl bg-ink-950 px-6 py-14 text-white sm:px-12">
        <div className="grid-fade pointer-events-none absolute inset-0 opacity-20" />
        <div className="relative max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sand-300">
            {LAUNCH_OFFER.label} · {LAUNCH_OFFER.deadline}
          </p>
          <h2 className="mt-4 font-display text-3xl leading-tight tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-4 text-base leading-relaxed text-ink-200">{description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={primary.to}>
              <Button size="lg" className="bg-sand-400 text-ink-950 hover:bg-sand-300">
                {primary.label}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            {secondary ? <Link to={secondary.to}>
              <Button size="lg" variant="outline" className="border-white/25 bg-white/5 text-white hover:bg-white/10">
                {secondary.label}
              </Button>
            </Link> : null}
          </div>
          <p className="mt-5 text-xs text-ink-400">
            Offre de lancement jusqu’au {LAUNCH_OFFER.deadline} {LAUNCH_OFFER.condition}, selon la première échéance.
          </p>
        </div>
      </div>
    </section>
  )
}

export function HighlightGrid({ items }: { items: { title: string; detail: string }[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item.title} className="border-l-2 border-sand-300 pl-4">
          <p className="text-sm font-semibold text-ink-950">{item.title}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{item.detail}</p>
        </div>
      ))}
    </div>
  )
}

export function sectorName(sector: Sector) {
  return SECTORS[sector].name
}

function PublicNavigationLink({to,sector,children,className,onClick,activeProps}:{to:string;sector:Sector|null;children:ReactNode;className?:string;onClick?:()=>void;activeProps?:{className:string}}){
 const handleClick=()=>{
  if(to==='/') clearSelectedSector()
  onClick?.()
 }
 const props={children,className,onClick:handleClick,activeProps}
 return <Link to={to as LinkProps['to']} {...props}/>
}
