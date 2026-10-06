import { useState } from 'react'
import type { PortalSession, PortalUser } from '../../lib/portal/types'
import { PasswordForm } from './AuthForms'
import { buttonClass } from './portalStyles'

export function ProfileAccount({ user, disabled, onSession, onBusyChange }: { user: PortalUser; disabled: boolean; onSession: (session: PortalSession) => void; onBusyChange: (busy: boolean) => void }) {
  const [passwordOpen, setPasswordOpen] = useState(false)
  return <section aria-label="Account settings" className="mb-12 border-b border-line pb-8">
    <div className="flex flex-wrap items-center justify-between gap-5">
      <div><h2 className="m-0 text-xl font-medium">{user.name}</h2><p className="mb-0 mt-2 text-sm leading-relaxed text-ink-soft">@{user.username} · {user.role === 'admin' ? 'Administrator · Review and publish all members’ proposals' : 'Member · Manage your proposals'}</p></div>
      <button className={buttonClass} disabled={disabled} aria-expanded={passwordOpen} aria-controls="profile-password" onClick={() => setPasswordOpen(value => !value)}>{passwordOpen ? 'Close password settings' : 'Change password'}</button>
    </div>
    {passwordOpen && <div id="profile-password" className="mt-8"><PasswordForm onSession={onSession} onBusyChange={onBusyChange} disabled={disabled} /></div>}
  </section>
}
