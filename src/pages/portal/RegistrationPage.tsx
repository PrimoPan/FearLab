import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { AccountFields } from '../../components/portal/registration/AccountFields'
import { ProfileFields } from '../../components/portal/registration/ProfileFields'
import { PhotoField } from '../../components/portal/registration/PhotoField'
import { RegistrationField, fieldAccessibility } from '../../components/portal/registration/RegistrationField'
import { useRegistration } from '../../components/portal/registration/useRegistration'
import { DiscardChangesDialog } from '../../components/portal/DiscardChangesDialog'
import { buttonClass, fieldClass, primaryClass } from '../../components/portal/portalStyles'
import { projectLabel, projectWidth } from '../../components/projects/ProjectReveal'
import { useDiscardNavigation } from '../../lib/portal/useDiscardNavigation'
import { cn } from '../../lib/cn'

export function RegistrationPage() {
  const registration = useRegistration()
  const { fields, errors, error, busy, receipt, dirty, portrait, lifePhoto, errorSummary, setField, setPhoto, setPhotoError, submit } = registration
  const navigation = useDiscardNavigation({ dirty, busy, title: 'Discard application?', message: 'Your application has not been submitted. Leaving now will discard the details and photos you entered.' })
  const hasErrors = Object.values(errors).some(Boolean)
  const receiptTitle = useRef<HTMLHeadingElement>(null)
  useEffect(() => { if (receipt) receiptTitle.current?.focus() }, [receipt])

  return <div className={cn(projectWidth, 'relative z-[1] py-[clamp(2rem,5vw,4rem)]')}>
    <DiscardChangesDialog {...navigation.dialog} />
    <header className="mb-10 border-b border-line pb-8">
      <p className={projectLabel}>FEAR Lab · Member registration</p>
      <div className="flex flex-wrap items-end justify-between gap-5">
        <h1 className="m-0 text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.05em]">{receipt ? 'Application received' : 'Member registration'}<span className="text-accent">.</span></h1>
        <Link to="/test" className={cn(buttonClass, 'no-underline')}>Back to sign in</Link>
      </div>
    </header>
    {receipt ? <section className="max-w-2xl" aria-labelledby="registration-receipt-title">
      <p className={projectLabel}>Awaiting approval</p>
      <h2 ref={receiptTitle} tabIndex={-1} id="registration-receipt-title" className="text-3xl font-medium tracking-tight outline-none">Thank you, {fields.name}.</h2>
      <p className="leading-relaxed text-ink-soft">Your application is now with Dongyijie Primo Pan and Mirjana Prpa for review. Once an administrator approves it, your profile will appear on People and you can sign in to create project proposals.</p>
      <dl className="my-8 space-y-4 border-y border-line py-6"><div><dt className="text-sm text-ink-soft">Username</dt><dd className="m-0 mt-1 break-all text-lg">{receipt.username}</dd></div><div><dt className="text-sm text-ink-soft">Application reference</dt><dd className="m-0 mt-1 break-all font-mono text-xs">{receipt.id}</dd></div></dl>
      <p className="text-sm leading-relaxed text-ink-soft">Keep your username and password. Your account is pending approval, so it cannot sign in yet.</p>
      <Link to="/test" className={cn(primaryClass, 'mt-3 no-underline')}>Return to sign in <span aria-hidden="true">↗</span></Link>
    </section> : <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_16rem] xl:gap-16">
      <form noValidate onSubmit={submit} className="min-w-0" aria-busy={busy}>
        {(hasErrors || error) && <div ref={errorSummary} tabIndex={-1} role="alert" className="mb-8 border-l-2 border-accent bg-panel p-5 text-sm leading-relaxed outline-none focus:ring-1 focus:ring-accent">
          {error ? <p className="m-0 text-accent">{error}</p> : <p className="m-0 text-accent">Please check the highlighted fields before submitting.</p>}
          {hasErrors && <ul className="mb-0 mt-3 space-y-2 pl-5">{Object.entries(errors).filter(([, value]) => value).map(([name, message]) => <li key={name}><a href={`#registration-${name}`} className="text-ink underline underline-offset-4" onClick={event => { event.preventDefault(); document.getElementById(`registration-${name}`)?.focus() }}>{message}</a></li>)}</ul>}
          {error && <p className="mb-0 mt-3 text-ink-soft">Your details and selected photos are still here. You can correct them and try again.</p>}
        </div>}
        <fieldset disabled={busy} className="m-0 min-w-0 space-y-10 border-0 p-0">
          <AccountFields fields={fields} errors={errors} setField={setField} />
          <ProfileFields fields={fields} errors={errors} setField={setField} />
          <section className="space-y-6 border-t border-line pt-8" aria-labelledby="registration-photos-title">
            <div><p className="mb-2 font-mono text-xs text-accent">03 / PHOTOS</p><h2 id="registration-photos-title" className="m-0 text-2xl font-medium tracking-tight">Profile photos</h2><p className="mb-0 text-sm leading-relaxed text-ink-soft">Add a portrait and a photo of life outside your research. JPEG, PNG or WebP; up to 8 MB each.</p></div>
            <div className="grid items-start gap-6 sm:grid-cols-2">
              <PhotoField name="portrait" label="Portrait" hint="A clear photo for your People directory entry." file={portrait} error={errors.portrait} onChange={file => setPhoto('portrait', file)} onError={message => setPhotoError('portrait', message)} />
              <PhotoField name="lifePhoto" label="Life photo" hint="A personal photo for your full profile." file={lifePhoto} error={errors.lifePhoto} onChange={file => setPhoto('lifePhoto', file)} onError={message => setPhotoError('lifePhoto', message)} />
            </div>
            <RegistrationField name="lifePhotoAlt" label="Life photo description" hint="Briefly describe what is in the photo for people using screen readers." error={errors.lifePhotoAlt}>
              <input {...fieldAccessibility('lifePhotoAlt', errors.lifePhotoAlt, true)} className={fieldClass} maxLength={300} required value={fields.lifePhotoAlt} onChange={event => setField('lifePhotoAlt', event.target.value)} />
            </RegistrationField>
          </section>
          <div className="border-t border-line pt-8"><p className="mb-5 mt-0 text-sm leading-relaxed text-ink-soft">Please check your public profile information and photos before submitting. An administrator will review your application.</p><button type="submit" className={primaryClass} disabled={busy}>{busy ? 'Submitting application…' : 'Submit for approval'}<span aria-hidden="true">↗</span></button><p className="mb-0 mt-4 text-sm text-ink-soft" role="status">{busy ? 'Uploading your photos and sending your application. Please keep this page open.' : 'Your account becomes available after approval.'}</p></div>
        </fieldset>
      </form>
      <aside className="border-t border-line pt-6 lg:sticky lg:top-28" aria-labelledby="registration-next-title">
        <h2 id="registration-next-title" className="m-0 text-lg font-medium">What happens next</h2>
        <ol className="mt-5 space-y-5 pl-5 text-sm leading-relaxed text-ink-soft"><li>Send your account details, biography and photos.</li><li>Dongyijie Primo Pan or Mirjana Prpa reviews your application.</li><li>After approval, your profile joins People and you can submit projects from this workspace.</li></ol>
        <p className="mb-0 mt-6 border-t border-line pt-5 text-sm leading-relaxed text-ink-soft">Already have an account? <Link to="/test" className="text-ink underline underline-offset-4">Sign in here.</Link></p>
      </aside>
    </div>}
  </div>
}
