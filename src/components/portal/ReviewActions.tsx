import { useState } from 'react'
import type { PortalProject } from '../../lib/portal/types'
import { fieldClass, labelClass, buttonClass, primaryClass } from './portalStyles'

export function ReviewActions({ project, busy, dirty, onReview }: { project: PortalProject; busy: boolean; dirty: boolean; onReview: (decision: 'approve' | 'changes', feedback: string) => void }) {
  const [feedback, setFeedback] = useState(project.feedback ?? '')
  return <section className="my-10 border-y border-line py-8">
    <h2 className="mt-0 text-2xl font-medium">Admin review</h2>
    <p className="text-sm leading-relaxed text-ink-soft">{dirty ? 'Save your edits before making a review decision.' : 'Approval publishes this version to Projects. The author can revise and submit later changes for a new review.'}</p>
    <label htmlFor="review-feedback" className={labelClass}>Feedback to the author</label><textarea id="review-feedback" rows={3} className={fieldClass} disabled={busy} value={feedback} onChange={event => setFeedback(event.target.value)} />
    <div className="mt-5 flex flex-wrap gap-3"><button className={primaryClass} disabled={busy || dirty} onClick={() => onReview('approve', feedback)}>Approve & publish</button><button className={buttonClass} disabled={busy || dirty || !feedback.trim()} onClick={() => onReview('changes', feedback)}>Request changes</button></div>
  </section>
}
