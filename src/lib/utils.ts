import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

export function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function byId<T extends { id: string }>(list: T[], id: string | null | undefined): T | undefined {
  if (!id) return undefined
  return list.find((item) => item.id === id)
}

export function groupBy<T, K extends string>(list: T[], key: (item: T) => K): Record<K, T[]> {
  return list.reduce(
    (acc, item) => {
      const k = key(item)
      acc[k] = acc[k] ?? []
      acc[k].push(item)
      return acc
    },
    {} as Record<K, T[]>,
  )
}

export function sum(list: number[]) {
  return list.reduce((a, b) => a + b, 0)
}

export function percentage(part: number, total: number) {
  if (total <= 0) return 0
  return Math.round((part / total) * 100)
}
