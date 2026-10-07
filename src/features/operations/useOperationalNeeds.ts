import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/features/auth/AuthContext'
import type { Need, NeedStatus } from '@/types'

type NewNeed = Pick<Need, 'orgId' | 'title' | 'category' | 'categoryLabel' | 'description' | 'location' | 'budgetMax' | 'urgency' | 'deadline'>

async function responseError(response: Response) {
  const body = await response.json().catch(() => ({})) as { error?: string }
  return body.error || `Erreur serveur (${response.status})`
}

export function useOperationalNeeds(demoNeeds: Need[]) {
  const { status } = useAuth()
  const live = status === 'authenticated'
  const [records, setRecords] = useState<Need[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    if (!live) return
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/needs', { credentials: 'same-origin', cache: 'no-store' })
      if (!response.ok) throw new Error(await responseError(response))
      setRecords(await response.json() as Need[])
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Impossible de charger les besoins.')
    } finally { setLoading(false) }
  }, [live])

  useEffect(() => { void refresh() }, [refresh])

  useEffect(() => {
    if (!live) return
    const refreshWhenVisible = () => { if (document.visibilityState === 'visible') void refresh() }
    window.addEventListener('focus', refreshWhenVisible)
    document.addEventListener('visibilitychange', refreshWhenVisible)
    return () => {
      window.removeEventListener('focus', refreshWhenVisible)
      document.removeEventListener('visibilitychange', refreshWhenVisible)
    }
  }, [live, refresh])

  const create = useCallback(async (input: NewNeed) => {
    const response = await fetch('/api/needs', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(input),
    })
    if (!response.ok) throw new Error(await responseError(response))
    const record = await response.json() as Need
    setRecords((current) => [record, ...current])
    setError('')
    return record
  }, [])

  const setStatus = useCallback(async (id: string, next: NeedStatus, label?: string) => {
    const response = await fetch(`/api/needs/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ status: next, label }),
    })
    if (!response.ok) throw new Error(await responseError(response))
    const record = await response.json() as Need
    setRecords((current) => current.map((item) => item.id === id ? record : item))
    setError('')
  }, [])

  return { needs: live ? records : demoNeeds, live, loading: live && loading, error, refresh, create, setStatus }
}
