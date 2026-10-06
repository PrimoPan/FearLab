import type { RegistrationReview } from '../../lib/portal/profileReviews'
import { positionLabels } from '../../lib/portal/profileReviews'
import { buttonClass, fieldClass, labelClass, primaryClass } from './portalStyles'

type Props = { application: RegistrationReview; feedback: string; onFeedback: (value: string) => void; busy: boolean; onReview: (decision: 'approve' | 'reject') => void; onBack: () => void }
export function ProfileReviewDetail({ application, feedback, onFeedback, busy, onReview, onBack }: Props) {
  const profile = application.profile
  return <article className="min-w-0">
    <button className={buttonClass} onClick={onBack}>← Applications</button>
    <div className="my-8 flex flex-wrap items-end justify-between gap-5">
      <div><p className="font-mono text-xs uppercase text-accent">{application.status} · {positionLabels[profile.position]}</p><h2 className="m-0 break-words text-4xl font-medium tracking-tight">{profile.name}</h2><p className="mb-0 text-ink-soft">Username: {application.username}</p></div>
      {application.status === 'approved' && <a href={`/people?member=member-${encodeURIComponent(application.username)}`} className="text-accent underline underline-offset-4">View public profile ↗</a>}
    </div>
    <div className="grid grid-cols-[minmax(8rem,1fr)_minmax(0,2fr)] gap-5 max-[600px]:grid-cols-1">
      <figure className="m-0"><img className="aspect-[3/4] w-full object-contain bg-panel" src={profile.idPhoto} alt={`Portrait of ${profile.name}`} /><figcaption className="mt-2 text-sm text-ink-soft">Portrait</figcaption></figure>
      <figure className="m-0"><img className="aspect-[4/3] w-full object-contain bg-panel" src={profile.lifePhoto} alt={profile.lifePhotoAlt} /><figcaption className="mt-2 break-words text-sm text-ink-soft">{profile.lifePhotoAlt}</figcaption></figure>
    </div>
    <dl className="my-9 grid grid-cols-[10rem_minmax(0,1fr)] gap-x-6 gap-y-4 border-y border-line py-6 text-sm max-[600px]:grid-cols-1 max-[600px]:gap-y-2">
      <dt className="text-ink-soft">Public email</dt><dd className="m-0 break-words">{profile.emails.join(', ')}</dd>
      <dt className="text-ink-soft">Website</dt><dd className="m-0 break-all">{profile.website ? <a href={profile.website} target="_blank" rel="noreferrer" className="text-accent underline">{profile.website}</a> : 'Not provided'}</dd>
      <dt className="text-ink-soft">Research interests</dt><dd className="m-0 break-words">{profile.researchInterest}</dd>
    </dl>
    <section className="max-w-3xl"><h3 className="text-xl font-medium">Biography</h3>{profile.bioParagraphs.map((text, index) => <p key={index} className="break-words text-base leading-relaxed text-ink-soft">{text}</p>)}</section>
    {application.status === 'pending' ? <section className="mt-10 border-t border-line pt-7">
      <h3 className="mt-0 text-xl font-medium">Review decision</h3>
      <p className="max-w-3xl text-sm leading-relaxed text-ink-soft">Approval creates a member account and publishes this profile on People. The applicant can then sign in and create projects.</p>
      <label className={labelClass} htmlFor="registration-feedback">Review note (required to reject)</label>
      <textarea id="registration-feedback" className={fieldClass} rows={3} maxLength={4000} disabled={busy} value={feedback} onChange={event => onFeedback(event.target.value)} />
      <div className="mt-5 flex flex-wrap gap-3"><button className={primaryClass} disabled={busy} onClick={() => onReview('approve')}>{busy ? 'Saving decision…' : 'Approve & add to People'}</button><button className={buttonClass} disabled={busy || !feedback.trim()} onClick={() => onReview('reject')}>Reject application</button></div>
    </section> : <p className="mt-8 border-t border-line pt-6 text-ink-soft">{application.feedback || 'This application has been reviewed.'}</p>}
  </article>
}
