import {
  createContext,
  useContext,
  useEffect,
  useId,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from 'react'
import { X } from 'lucide-react'
import { cn, initials as toInitials } from '@/lib/utils'

/* ------------------------------------------------------------------ */
/* Button                                                              */
/* ------------------------------------------------------------------ */

type Variant = 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger' | 'dark'
type Size = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary:
    'rounded-full bg-brand-700 text-white hover:bg-brand-800 active:scale-[0.98] shadow-lg shadow-brand-900/15',
  secondary: 'rounded-full bg-brand-50 text-brand-800 hover:bg-brand-100',
  outline: 'rounded-full border border-ink-200 bg-white text-ink-800 hover:border-ink-400 hover:bg-ink-50',
  ghost: 'rounded-full text-ink-600 hover:bg-ink-100 hover:text-ink-950',
  danger: 'rounded-full bg-red-600 text-white hover:bg-red-700',
  dark: 'rounded-full bg-ink-950 text-white hover:bg-ink-900',
}

const SIZES: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-[0.95rem] gap-2.5',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
}

export function Button({ className, variant = 'primary', size = 'md', fullWidth, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-semibold transition-colors duration-150 disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  )
}

/* ------------------------------------------------------------------ */
/* Card                                                                */
/* ------------------------------------------------------------------ */

export function Card({ className, children, ...props }: { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('allneeds-card rounded-3xl border border-ink-100 bg-white shadow-[0_20px_45px_-18px_rgba(16,42,74,.18)] transition hover:shadow-[0_26px_60px_-20px_rgba(16,42,74,.22)]', className)} {...props}>
      {children}
    </div>
  )
}

export function CardHeader({ title, description, action, className }: { title: ReactNode; description?: ReactNode; action?: ReactNode; className?: string }) {
  return (
    <div className={cn('flex items-start justify-between gap-4 border-b border-ink-100 px-5 py-4', className)}>
      <div>
        <h3 className="text-sm font-semibold text-ink-950">{title}</h3>
        {description ? <p className="mt-0.5 text-xs text-ink-500">{description}</p> : null}
      </div>
      {action}
    </div>
  )
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>
}

export function CardFooter({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('flex items-center gap-3 border-t border-ink-100 bg-ink-50/60 px-5 py-3', className)}>{children}</div>
}

/* ------------------------------------------------------------------ */
/* Badge                                                               */
/* ------------------------------------------------------------------ */

export type Tone = 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | 'info' | 'violet'

const TONES: Record<Tone, string> = {
  neutral: 'bg-ink-100 text-ink-700 ring-ink-200',
  brand: 'bg-brand-50 text-brand-800 ring-brand-200',
  success: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  warning: 'bg-amber-50 text-amber-800 ring-amber-200',
  danger: 'bg-red-50 text-red-700 ring-red-200',
  info: 'bg-sky-50 text-sky-700 ring-sky-200',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200',
}

export function Badge({
  tone = 'neutral',
  className,
  children,
}: {
  tone?: Tone
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2 py-0.5 text-[0.68rem] font-semibold uppercase tracking-wide ring-1 ring-inset',
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Dot({ tone = 'neutral', className }: { tone?: Tone; className?: string }) {
  const colors: Record<Tone, string> = {
    neutral: 'bg-ink-300',
    brand: 'bg-brand-500',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
    info: 'bg-sky-500',
    violet: 'bg-violet-500',
  }
  return <span className={cn('inline-block h-1.5 w-1.5 shrink-0 rounded-full', colors[tone], className)} />
}

/* ------------------------------------------------------------------ */
/* Form fields                                                         */
/* ------------------------------------------------------------------ */

export function Field({
  label,
  hint,
  error,
  required,
  children,
  className,
}: {
  label?: string
  hint?: string
  error?: string
  required?: boolean
  children: ReactNode
  className?: string
}) {
  return (
    <label className={cn('block', className)}>
      {label ? (
        <span className="mb-1.5 flex items-center gap-1 text-xs font-semibold text-ink-700">
          {label}
          {required ? <span className="text-red-500">*</span> : null}
        </span>
      ) : null}
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs text-red-600">{error}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-ink-500">{hint}</span>
      ) : null}
    </label>
  )
}

const CONTROL =
  'w-full rounded-lg border border-ink-200 bg-white px-3 text-sm text-ink-900 placeholder:text-ink-400 transition focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100 disabled:bg-ink-50 disabled:text-ink-400'

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(CONTROL, 'h-10', className)} {...props} />
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(CONTROL, 'py-2.5 leading-relaxed', className)} {...props} />
}

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select className={cn(CONTROL, 'h-10 appearance-none bg-[length:0] pr-8', className)} {...props}>
      {children}
    </select>
  )
}

export function Checkbox({
  label,
  description,
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; description?: string }) {
  const id = useId()
  return (
    <div className={cn('flex gap-2.5', className)}>
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink-300 text-brand-700 focus:ring-brand-500"
        {...props}
      />
      <label htmlFor={id} className="text-sm leading-snug text-ink-700">
        {label}
        {description ? <span className="mt-0.5 block text-xs text-ink-500">{description}</span> : null}
      </label>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Stats, progress, meters                                             */
/* ------------------------------------------------------------------ */

export function Stat({
  label,
  value,
  hint,
  tone = 'neutral',
  icon,
}: {
  label: string
  value: ReactNode
  hint?: ReactNode
  tone?: Tone
  icon?: ReactNode
}) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <p className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-500">{label}</p>
        {icon ? <span className={cn('rounded-lg p-1.5', TONES[tone])}>{icon}</span> : null}
      </div>
      <p className="mt-2 font-display text-3xl leading-none tracking-tight text-ink-950">{value}</p>
      {hint ? <p className="mt-2 text-xs text-ink-500">{hint}</p> : null}
    </div>
  )
}

export function Progress({
  value,
  max = 100,
  tone = 'brand',
  className,
  label,
}: {
  value: number
  max?: number
  tone?: 'brand' | 'emerald' | 'amber' | 'red' | 'ink'
  className?: string
  label?: string
}) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100))
  const colors = {
    brand: 'bg-brand-600',
    emerald: 'bg-emerald-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    ink: 'bg-ink-700',
  }
  return (
    <div className={cn('w-full', className)}>
      {label ? (
        <div className="mb-1.5 flex items-center justify-between text-xs text-ink-600">
          <span>{label}</span>
          <span className="font-semibold text-ink-800">{pct} %</span>
        </div>
      ) : null}
      <div className="h-2 w-full overflow-hidden rounded-full bg-ink-100">
        <div className={cn('h-full rounded-full transition-all duration-500', colors[tone])} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

export function Meter({ value }: { value: number }) {
  const tone = value < 50 ? 'red' : value < 70 ? 'amber' : 'emerald'
  const colors = {
    brand: 'bg-brand-500',
    amber: 'bg-amber-500',
    red: 'bg-red-500',
    emerald: 'bg-emerald-500',
  }
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-ink-100">
        <div className={cn('h-full rounded-full', colors[tone])} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-semibold tabular-nums text-ink-700">{value}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Layout helpers                                                      */
/* ------------------------------------------------------------------ */

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
  children,
}: {
  eyebrow?: string
  title: ReactNode
  description?: ReactNode
  align?: 'left' | 'center'
  className?: string
  children?: ReactNode
}) {
  return (
    <div className={cn(align === 'center' && 'mx-auto max-w-2xl text-center', className)}>
      {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
      <h2 className="display-2">{title}</h2>
      {description ? <p className={cn('lede mt-4', align === 'center' && 'mx-auto')}>{description}</p> : null}
      {children ? <div className="mt-6">{children}</div> : null}
    </div>
  )
}

export function EmptyState({ icon, title, description, action }: { icon?: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-ink-50/50 px-6 py-12 text-center">
      {icon ? <div className="mb-3 rounded-xl bg-white p-3 text-ink-400 shadow-sm">{icon}</div> : null}
      <p className="text-sm font-semibold text-ink-800">{title}</p>
      {description ? <p className="mt-1.5 max-w-sm text-sm text-ink-500">{description}</p> : null}
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  )
}

export function Alert({
  tone = 'info',
  title,
  children,
  icon,
  className,
}: {
  tone?: 'info' | 'success' | 'warning' | 'danger'
  title?: ReactNode
  children?: ReactNode
  icon?: ReactNode
  className?: string
}) {
  const tones = {
    info: 'bg-sky-50 text-sky-900 border-sky-200',
    success: 'bg-emerald-50 text-emerald-900 border-emerald-200',
    warning: 'bg-amber-50 text-amber-900 border-amber-200',
    danger: 'bg-red-50 text-red-900 border-red-200',
  }
  return (
    <div className={cn('flex gap-3 rounded-xl border px-4 py-3 text-sm', tones[tone], className)}>
      {icon ? <span className="mt-0.5 shrink-0">{icon}</span> : null}
      <div className="min-w-0">
        {title ? <p className="font-semibold">{title}</p> : null}
        {children ? <div className={cn('leading-relaxed', title && 'mt-1')}>{children}</div> : null}
      </div>
    </div>
  )
}

export function Avatar({ name, className, size = 'md' }: { name: string; className?: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-7 w-7 text-[0.65rem]', md: 'h-9 w-9 text-xs', lg: 'h-12 w-12 text-sm' }
  return (
    <span
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-ink-950 font-semibold uppercase text-white',
        sizes[size],
        className,
      )}
    >
      {toInitials(name)}
    </span>
  )
}

export function Divider({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-ink-100', className)} />
}

export function KeyValue({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-xs text-ink-500">{label}</span>
      <span className="text-right text-sm font-medium text-ink-900">{children}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Tabs                                                                */
/* ------------------------------------------------------------------ */

export function Tabs({
  tabs,
  value,
  onChange,
  className,
}: {
  tabs: { value: string; label: string; count?: number }[]
  value: string
  onChange: (value: string) => void
  className?: string
}) {
  return (
    <div className={cn('no-scrollbar flex gap-1 overflow-x-auto border-b border-ink-100', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            '-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors',
            value === tab.value
              ? 'border-brand-700 text-brand-800'
              : 'border-transparent text-ink-500 hover:border-ink-200 hover:text-ink-800',
          )}
        >
          {tab.label}
          {typeof tab.count === 'number' ? (
            <span className="ml-2 rounded-full bg-ink-100 px-1.5 py-0.5 text-[0.65rem] tabular-nums text-ink-600">
              {tab.count}
            </span>
          ) : null}
        </button>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Table                                                               */
/* ------------------------------------------------------------------ */

export function TableWrap({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full min-w-[640px] border-collapse text-sm">{children}</table>
    </div>
  )
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th className={cn('border-b border-ink-100 px-4 py-3 text-left text-[0.68rem] font-semibold uppercase tracking-wider text-ink-500', className)}>
      {children}
    </th>
  )
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn('border-b border-ink-50 px-4 py-3 align-middle text-ink-800', className)}>{children}</td>
}

export function Tr({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <tr className={cn(onClick && 'cursor-pointer transition hover:bg-ink-50/70', className)} onClick={onClick}>
      {children}
    </tr>
  )
}

/* ------------------------------------------------------------------ */
/* Modal                                                               */
/* ------------------------------------------------------------------ */

const ModalContext = createContext<{ close: () => void } | null>(null)

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  const widths = { sm: 'max-w-md', md: 'max-w-xl', lg: 'max-w-3xl' }

  return (
    <ModalContext.Provider value={{ close: onClose }}>
      <div className="fixed inset-0 z-50 flex items-end justify-center overflow-y-auto bg-ink-950/50 p-0 backdrop-blur-sm sm:items-center sm:p-6">
        <div className={cn('absolute inset-0', '')} onClick={onClose} aria-hidden />
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            'relative z-10 w-full animate-fade-up rounded-t-2xl bg-white shadow-lift sm:rounded-2xl',
            widths[size],
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-ink-100 px-6 py-4">
            <div>
              <h2 className="text-base font-semibold text-ink-950">{title}</h2>
              {description ? <p className="mt-1 text-sm text-ink-500">{description}</p> : null}
            </div>
            <button type="button" onClick={onClose} className="rounded-lg p-1.5 text-ink-400 transition hover:bg-ink-100 hover:text-ink-700">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>
        </div>
      </div>
    </ModalContext.Provider>
  )
}

export function useModal() {
  return useContext(ModalContext)
}

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

export function Steps({ steps, current, className }: { steps: string[]; current: number; className?: string }) {
  return (
    <ol className={cn('flex flex-wrap items-center gap-2', className)}>
      {steps.map((step, i) => {
        const done = i < current
        const active = i === current
        return (
          <li key={step} className="flex items-center gap-2">
            <span
              className={cn(
                'flex h-6 w-6 items-center justify-center rounded-full text-[0.7rem] font-bold',
                done && 'bg-brand-700 text-white',
                active && 'bg-brand-100 text-brand-800 ring-2 ring-brand-600',
                !done && !active && 'bg-ink-100 text-ink-500',
              )}
            >
              {done ? '✓' : i + 1}
            </span>
            <span className={cn('text-xs font-medium', active ? 'text-ink-950' : 'text-ink-500')}>{step}</span>
            {i < steps.length - 1 ? <span className="mx-1 h-px w-6 bg-ink-200 sm:w-10" /> : null}
          </li>
        )
      })}
    </ol>
  )
}

/* ------------------------------------------------------------------ */
/* Misc                                                                */
/* ------------------------------------------------------------------ */

export function PriceTag({ amount, note, className }: { amount: number | null; note?: string; className?: string }) {
  return (
    <div className={className}>
      <p className="font-display text-3xl leading-none tracking-tight text-ink-950">
        {amount === null ? 'Offert' : `${new Intl.NumberFormat('fr-FR').format(amount)} DH`}
      </p>
      {note ? <p className="mt-1.5 text-xs text-ink-500">{note}</p> : null}
    </div>
  )
}

export function useToggle(initial = false) {
  const [on, setOn] = useState(initial)
  return [on, () => setOn((v) => !v), setOn] as const
}

export function useDisclosure(initial = false) {
  const [open, setOpen] = useState(initial)
  return { open, openFn: () => setOpen(true), close: () => setOpen(false), toggle: () => setOpen((v) => !v) }
}
