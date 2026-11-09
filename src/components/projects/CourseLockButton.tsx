import { useState } from 'react'
import { useCourseAccess } from '../../lib/course/CourseAccessContext'

export function CourseLockButton() {
  const { lock } = useCourseAccess()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  return <div className="text-right">
    <button type="button" disabled={busy} onClick={async () => {
      setBusy(true)
      setError('')
      try { await lock() } catch { setError('Could not lock the course. Please try again.'); setBusy(false) }
    }} className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line bg-panel px-4 text-sm text-ink-soft hover:border-accent hover:text-ink disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">{busy ? 'Locking…' : 'Lock course'}</button>
    {error && <p role="alert" className="mb-0 mt-2 max-w-64 text-sm text-ink">{error}</p>}
  </div>
}
