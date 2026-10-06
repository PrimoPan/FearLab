import type { ReactNode } from 'react'
import { labelClass } from '../portalStyles'

export function RegistrationField({ name, label, hint, error, children }: {
  name: string; label: string; hint?: string; error?: string; children: ReactNode
}) {
  return <div className="min-w-0">
    <label className={labelClass} htmlFor={`registration-${name}`}>{label}</label>
    {children}
    {hint && <p id={`registration-${name}-hint`} className="mb-0 mt-2 text-sm leading-relaxed text-ink-soft">{hint}</p>}
    {error && <p id={`registration-${name}-error`} className="mb-0 mt-2 text-sm leading-relaxed text-accent">{error}</p>}
  </div>
}

export function fieldAccessibility(name: string, error?: string, hint = false) {
  return {
    id: `registration-${name}`,
    'aria-invalid': Boolean(error),
    'aria-describedby': [hint && `registration-${name}-hint`, error && `registration-${name}-error`].filter(Boolean).join(' ') || undefined
  }
}
