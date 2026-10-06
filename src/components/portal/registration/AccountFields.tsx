import { fieldClass } from '../portalStyles'
import { RegistrationField, fieldAccessibility } from './RegistrationField'
import type { RegistrationErrors, RegistrationFields } from './registrationForm'

export type RegistrationFieldProps = {
  fields: RegistrationFields
  errors: RegistrationErrors
  setField: <K extends keyof RegistrationFields>(name: K, value: RegistrationFields[K]) => void
}

export function AccountFields({ fields, errors, setField }: RegistrationFieldProps) {
  return <section className="space-y-6" aria-labelledby="registration-account-title">
    <div><p className="mb-2 font-mono text-xs text-accent">01 / ACCOUNT</p><h2 id="registration-account-title" className="m-0 text-2xl font-medium tracking-tight">Your sign-in details</h2></div>
    <RegistrationField name="username" label="Given-name username" hint="Not case-sensitive. Start with a letter; use 3–40 letters, numbers, underscores or hyphens." error={errors.username}>
      <input {...fieldAccessibility('username', errors.username, true)} className={fieldClass} autoComplete="username" autoCapitalize="none" spellCheck={false} maxLength={40} required value={fields.username} onChange={event => setField('username', event.target.value)} />
    </RegistrationField>
    <div className="grid gap-6 sm:grid-cols-2">
      <RegistrationField name="password" label="Password" hint="Use 10–128 characters." error={errors.password}>
        <input {...fieldAccessibility('password', errors.password, true)} className={fieldClass} type="password" autoComplete="new-password" maxLength={128} required value={fields.password} onChange={event => setField('password', event.target.value)} />
      </RegistrationField>
      <RegistrationField name="confirmPassword" label="Confirm password" error={errors.confirmPassword}>
        <input {...fieldAccessibility('confirmPassword', errors.confirmPassword)} className={fieldClass} type="password" autoComplete="new-password" maxLength={128} required value={fields.confirmPassword} onChange={event => setField('confirmPassword', event.target.value)} />
      </RegistrationField>
    </div>
  </section>
}
