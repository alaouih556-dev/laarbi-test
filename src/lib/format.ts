const DH = new Intl.NumberFormat('fr-MA', {
  style: 'currency',
  currency: 'MAD',
  maximumFractionDigits: 0,
})

const NUM = new Intl.NumberFormat('fr-FR')

export function money(value: number) {
  return DH.format(value).replace(/\u00a0/g, ' ')
}

export function num(value: number) {
  return NUM.format(value)
}

export function pct(value: number) {
  return `${Math.round(value)} %`
}

/** Date complète et lisible : 12 mars 2026 */
export function longDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Date courte : 12 mars */
export function shortDate(iso: string) {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
  })
}

/** Date + heure : 12 mars, 14:30 */
export function dateTime(iso: string) {
  return `${shortDate(iso)} · ${timeOnly(iso)}`
}

export function timeOnly(iso: string) {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

/** « il y a 3 jours » */
export function relative(iso: string, now = Date.now()) {
  const diff = now - new Date(iso).getTime()
  const min = Math.round(diff / 60000)
  if (min < 1) return "à l'instant"
  if (min < 60) return `il y a ${min} min`
  const hours = Math.round(min / 60)
  if (hours < 24) return `il y a ${hours} h`
  const days = Math.round(hours / 24)
  if (days < 31) return `il y a ${days} j`
  const months = Math.round(days / 30)
  if (months < 12) return `il y a ${months} mois`
  return longDate(iso)
}

/** Nombre de jours restants (peut être négatif) */
export function daysUntil(iso: string, now = Date.now()) {
  return Math.ceil((new Date(iso).getTime() - now) / 86400000)
}

export function addDays(iso: string, days: number) {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export function plural(count: number, singular: string, plural_?: string) {
  return `${num(count)} ${count > 1 ? (plural_ ?? `${singular}s`) : singular}`
}
