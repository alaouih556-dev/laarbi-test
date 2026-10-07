import { useEffect, useState } from 'react'
import type { Sector } from '@/types'

const KEY = 'allneeds-public-sector'
const EVENT = 'allneeds:sector-changed'
const VALID: Sector[] = ['enseignement', 'sante', 'tourisme']

export function readSelectedSector(): Sector | null {
  if (typeof window === 'undefined') return null
  const value = window.localStorage.getItem(KEY)
  return VALID.includes(value as Sector) ? (value as Sector) : null
}

export function selectSector(sector: Sector) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(KEY, sector)
  window.dispatchEvent(new CustomEvent(EVENT, { detail: sector }))
}

export function clearSelectedSector() {
  if (typeof window === 'undefined') return
  window.localStorage.removeItem(KEY)
  window.dispatchEvent(new CustomEvent(EVENT, { detail: null }))
}

export function useSelectedSector() {
  const [sector, setSector] = useState<Sector | null>(() => readSelectedSector())

  useEffect(() => {
    const sync = () => setSector(readSelectedSector())
    window.addEventListener('storage', sync)
    window.addEventListener(EVENT, sync as EventListener)
    return () => {
      window.removeEventListener('storage', sync)
      window.removeEventListener(EVENT, sync as EventListener)
    }
  }, [])

  return sector
}
