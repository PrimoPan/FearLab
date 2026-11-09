import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { CoursePasswordPage } from '../../pages/CoursePasswordPage'
import type { CourseContent } from './types'

type CourseAccess = { content: CourseContent; lock: () => Promise<void> }
const CourseAccessContext = createContext<CourseAccess | null>(null)
const unavailable = 'Course access is temporarily unavailable. Please try again.'

export function CourseAccessBoundary() {
  const [content, setContent] = useState<CourseContent | null>(null)
  const [checking, setChecking] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const generation = useRef(0)
  const { pathname } = useLocation()

  const refresh = useCallback(async () => {
    const request = ++generation.current
    setChecking(true)
    setError('')
    try {
      const response = await fetch('/api/course/content', { credentials: 'same-origin', cache: 'no-store' })
      if (request !== generation.current) return
      if (response.status === 401) { setContent(null); return }
      if (!response.ok) throw new Error(unavailable)
      const data: CourseContent = await response.json()
      if (request === generation.current) setContent(data)
    } catch {
      if (request === generation.current) { setContent(null); setError(unavailable) }
    } finally {
      if (request === generation.current) { setChecking(false); setBusy(false) }
    }
  }, [])

  useEffect(() => {
    void refresh()
    const onFocus = () => { void refresh() }
    const onPageShow = (event: PageTransitionEvent) => { if (event.persisted) void refresh() }
    window.addEventListener('focus', onFocus)
    window.addEventListener('pageshow', onPageShow)
    return () => {
      generation.current += 1
      window.removeEventListener('focus', onFocus)
      window.removeEventListener('pageshow', onPageShow)
    }
  }, [pathname, refresh])

  useEffect(() => {
    if (!content) return
    const timer = window.setTimeout(() => {
      generation.current += 1
      setContent(null)
      setChecking(false)
      setError('Your course session has expired. Enter the password to continue.')
    }, Math.max(0, content.expiresAt - Date.now()))
    return () => window.clearTimeout(timer)
  }, [content])

  async function unlock(password: string) {
    const request = ++generation.current
    setBusy(true)
    setError('')
    try {
      const response = await fetch('/api/course/login', {
        method: 'POST', credentials: 'same-origin', cache: 'no-store',
        headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error([400, 401, 429].includes(response.status) ? data.error : unavailable)
      if (request === generation.current) setContent(data)
    } catch (reason) {
      if (request === generation.current) setError(reason instanceof Error && !(reason instanceof TypeError) && !(reason instanceof SyntaxError) ? reason.message : unavailable)
    } finally {
      if (request === generation.current) { setBusy(false); setChecking(false) }
    }
  }

  async function lock() {
    const response = await fetch('/api/course/logout', {
      method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: '{}',
    })
    if (!response.ok) throw new Error('Could not lock the course. Please try again.')
    generation.current += 1
    setContent(null)
    setError('')
    setChecking(false)
  }

  if (checking || !content) return <CoursePasswordPage checking={checking} busy={busy} error={error} onUnlock={unlock} onRetry={refresh} />
  return <CourseAccessContext.Provider value={{ content, lock }}><Outlet /></CourseAccessContext.Provider>
}

export function useCourseAccess() {
  const access = useContext(CourseAccessContext)
  if (!access) throw new Error('Course content requires an authenticated course session.')
  return access
}

export function useCourseContent() {
  return useCourseAccess().content
}
