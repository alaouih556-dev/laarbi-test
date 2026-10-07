import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export interface AuthUser {
  id: string
  email: string
  role: 'admin' | 'concierge' | 'dirigeant' | 'manager' | 'collaborateur' | string
  orgIds: string[]
  name: string
  active?: boolean
}

type AuthState = {
  status: 'loading' | 'anonymous' | 'authenticated'
  user: AuthUser | null
  login: (email: string, password: string) => Promise<AuthUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthState | null>(null)

async function readError(response: Response) {
  const body = await response.json().catch(() => ({})) as { error?: string }
  return body.error || 'La connexion a échoué. Réessayez.'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthState['status']>('loading')
  const [user, setUser] = useState<AuthUser | null>(null)

  const refresh = useCallback(async () => {
    try {
      const response = await fetch('/api/me', { credentials: 'same-origin', cache: 'no-store' })
      if (!response.ok) throw new Error('Session absente')
      setUser(await response.json() as AuthUser)
      setStatus('authenticated')
    } catch {
      setUser(null)
      setStatus('anonymous')
    }
  }, [])

  useEffect(() => {
    void refresh()
    const recheck = () => { if (document.visibilityState === 'visible') void refresh() }
    window.addEventListener('focus', recheck)
    document.addEventListener('visibilitychange', recheck)
    return () => {
      window.removeEventListener('focus', recheck)
      document.removeEventListener('visibilitychange', recheck)
    }
  }, [refresh])

  const login = useCallback(async (email: string, password: string) => {
    let response: Response
    try {
      response = await fetch('/api/auth/login', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
    } catch {
      throw new Error('Le service de connexion est indisponible. Démarrez le serveur ALLNEEDS puis réessayez.')
    }
    if (!response.ok) throw new Error(await readError(response))
    const result = await response.json() as { user: AuthUser }
    setUser(result.user)
    setStatus('authenticated')
    try { sessionStorage.removeItem('allneeds.demoRole') } catch { /* stockage navigateur indisponible */ }
    return result.user
  }, [])

  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
    } finally {
      setUser(null)
      setStatus('anonymous')
      try { sessionStorage.removeItem('allneeds.demoRole') } catch { /* stockage navigateur indisponible */ }
    }
  }, [])

  const value = useMemo(() => ({ status, user, login, logout }), [status, user, login, logout])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider')
  return context
}
