export function minutesToHours(minutes: number) {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} h`
  return `${h} h ${m}`
}

export function delta(current: number, previous: number) {
  const diff = current - previous
  if (diff === 0) return { value: 0, label: 'stable', tone: 'neutral' as const }
  return {
    value: diff,
    label: `${diff > 0 ? '+' : ''}${diff} pts`,
    tone: diff > 0 ? ('success' as const) : ('warning' as const),
  }
}
