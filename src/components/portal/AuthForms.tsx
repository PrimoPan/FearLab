import { useEffect, useState, type FormEvent } from 'react'
import { api, acceptSession } from '../../lib/portal/api'
import type { PortalSession } from '../../lib/portal/types'
import { fieldClass, labelClass, primaryClass } from './portalStyles'

export function LoginForm({ onSession }: { onSession: (session: PortalSession) => void }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function login(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError('')
    try { onSession(acceptSession(await api<PortalSession>('/auth/login', { method: 'POST', body: { username, password } }))) }
    catch (error) { setError((error as Error).message) }
    finally { setBusy(false) }
  }
  return <form onSubmit={login} className="max-w-md space-y-6">
    <div><label htmlFor="username" className={labelClass}>Given name</label><input id="username" autoComplete="username" autoCapitalize="none" spellCheck={false} className={fieldClass} value={username} onChange={event => setUsername(event.target.value)} required /><p className="mb-0 text-sm text-ink-soft">Your name is not case-sensitive.</p></div>
    <div><label htmlFor="password" className={labelClass}>Password</label><input id="password" type="password" autoComplete="current-password" className={fieldClass} value={password} onChange={event => setPassword(event.target.value)} required /></div>
    {error && <p role="alert" className="text-accent">{error}</p>}
    <button className={primaryClass} disabled={busy}>{busy ? 'Signing in…' : 'Sign in'} <span aria-hidden="true">↗</span></button>
  </form>
}

export function PasswordForm({ onSession, disabled = false, onBusyChange }: { onSession: (session: PortalSession) => void; disabled?: boolean; onBusyChange?: (busy: boolean) => void }) {
  const [currentPassword, setCurrent] = useState('')
  const [newPassword, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  useEffect(() => { onBusyChange?.(busy); return () => onBusyChange?.(false) }, [busy, onBusyChange])
  async function change(event: FormEvent) {
    event.preventDefault()
    if (disabled || busy) return
    setError(''); setMessage('')
    if (confirm !== newPassword) { setError('The new passwords do not match.'); return }
    setBusy(true)
    try {
      onSession(acceptSession(await api<PortalSession>('/auth/password', { method: 'POST', body: { currentPassword, newPassword } })))
      setCurrent(''); setNext(''); setConfirm(''); setMessage('Password changed.')
    } catch (error) { setError((error as Error).message) }
    finally { setBusy(false) }
  }
  return <form onSubmit={change} className="max-w-md space-y-5">
    <h2 className="text-2xl font-medium">Change password</h2>
    <p className="text-sm leading-relaxed text-ink-soft">Use at least 10 characters for your new password.</p>
    {[{ id: 'current-password', label: 'Current password', value: currentPassword, setter: setCurrent }, { id: 'new-password', label: 'New password', value: newPassword, setter: setNext }, { id: 'confirm-password', label: 'Confirm new password', value: confirm, setter: setConfirm }].map(field => <div key={field.id}><label htmlFor={field.id} className={labelClass}>{field.label}</label><input id={field.id} className={fieldClass} type="password" autoComplete={field.id === 'current-password' ? 'current-password' : 'new-password'} minLength={field.id === 'current-password' ? 1 : 10} maxLength={128} disabled={disabled || busy} required value={field.value} onChange={event => field.setter(event.target.value)} /></div>)}
    {error && <p role="alert" className="text-accent">{error}</p>}
    {message && <p role="status">{message}</p>}
    <button className={primaryClass} disabled={disabled || busy}>{busy ? 'Saving…' : 'Save password'}</button>
  </form>
}
