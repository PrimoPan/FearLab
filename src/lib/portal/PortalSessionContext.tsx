import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { acceptSession, api } from './api'
import type { PortalSession } from './types'

type SessionContext = {
  session: PortalSession | null
  error: string
  setSession: (session: PortalSession) => void
}

const PortalSessionContext = createContext<SessionContext | null>(null)

export function PortalSessionProvider({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  const active = pathname === '/test' || pathname.startsWith('/test/')
  const [session, updateSession] = useState<PortalSession | null>(null)
  const [error, setError] = useState('')
  const setSession = useCallback((value: PortalSession) => updateSession(acceptSession(value)), [])
  useEffect(() => {
    if (!active) return
    const controller = new AbortController()
    setError('')
    api<PortalSession>('/auth/session', { signal: controller.signal })
      .then(value => { if (!controller.signal.aborted) setSession(value) })
      .catch(error => { if (!controller.signal.aborted) { updateSession(null); setError(error.message) } })
    return () => controller.abort()
  }, [active, setSession])
  return <PortalSessionContext.Provider value={{ session, error, setSession }}>{children}</PortalSessionContext.Provider>
}

export function usePortalSession() {
  const context = useContext(PortalSessionContext)
  if (!context) throw new Error('Portal session provider is missing.')
  return context
}
