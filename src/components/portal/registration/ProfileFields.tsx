import { fieldClass } from '../portalStyles'
import { RegistrationField, fieldAccessibility } from './RegistrationField'
import type { RegistrationFieldProps } from './AccountFields'
import type { RegistrationFields } from './registrationForm'

export function ProfileFields({ fields, errors, setField }: RegistrationFieldProps) {
  return <section className="space-y-6 border-t border-line pt-8" aria-labelledby="registration-profile-title">
    <div><p className="mb-2 font-mono text-xs text-accent">02 / PEOPLE PROFILE</p><h2 id="registration-profile-title" className="m-0 text-2xl font-medium tracking-tight">Introduce yourself</h2><p className="mb-0 text-sm leading-relaxed text-ink-soft">These details and your photos will appear on the public People page after approval. Only your website is optional.</p></div>
    <div className="grid gap-6 sm:grid-cols-[1fr_12rem]">
      <RegistrationField name="name" label="Full name" error={errors.name}>
        <input {...fieldAccessibility('name', errors.name)} className={fieldClass} autoComplete="name" maxLength={120} required value={fields.name} onChange={event => setField('name', event.target.value)} />
      </RegistrationField>
      <RegistrationField name="position" label="Position" error={errors.position}>
        <select {...fieldAccessibility('position', errors.position)} className={fieldClass} value={fields.position} onChange={event => setField('position', event.target.value as RegistrationFields['position'])}><option value="phd">PhD</option><option value="mphil">MPhil</option><option value="ra">RA</option></select>
      </RegistrationField>
    </div>
    <RegistrationField name="emails" label="Public email addresses" hint="Up to 3 addresses. Separate them with commas or new lines." error={errors.emails}>
      <textarea {...fieldAccessibility('emails', errors.emails, true)} className={fieldClass} rows={2} autoComplete="email" autoCapitalize="none" spellCheck={false} maxLength={800} required value={fields.emails} onChange={event => setField('emails', event.target.value)} />
    </RegistrationField>
    <RegistrationField name="website" label="Website (optional)" error={errors.website}>
      <input {...fieldAccessibility('website', errors.website)} className={fieldClass} type="url" autoComplete="url" autoCapitalize="none" spellCheck={false} maxLength={2000} placeholder="https://" value={fields.website} onChange={event => setField('website', event.target.value)} />
    </RegistrationField>
    <RegistrationField name="researchInterest" label="Research interests" hint="A short description or list of your research areas." error={errors.researchInterest}>
      <textarea {...fieldAccessibility('researchInterest', errors.researchInterest, true)} className={fieldClass} rows={3} maxLength={1000} required value={fields.researchInterest} onChange={event => setField('researchInterest', event.target.value)} />
    </RegistrationField>
    <RegistrationField name="biography" label="Biography" hint="Introduce your background and current research in up to 12 paragraphs. Use a blank line between paragraphs." error={errors.biography}>
      <textarea {...fieldAccessibility('biography', errors.biography, true)} className={fieldClass} rows={7} maxLength={8000} required value={fields.biography} onChange={event => setField('biography', event.target.value)} />
    </RegistrationField>
  </section>
}
