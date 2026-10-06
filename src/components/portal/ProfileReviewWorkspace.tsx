import { useCallback, useEffect, useImperativeHandle, useState, type Ref } from 'react'
import { api } from '../../lib/portal/api'
import { useDiscardNavigation } from '../../lib/portal/useDiscardNavigation'
import type { WorkspaceNavigationHandle } from '../../lib/portal/useWorkspaceNavigation'
import { positionLabels, type RegistrationReview } from '../../lib/portal/profileReviews'
import { DiscardChangesDialog } from './DiscardChangesDialog'
import { ProfileReviewDetail } from './ProfileReviewDetail'
import { buttonClass } from './portalStyles'

type Props = { navigationRef?: Ref<WorkspaceNavigationHandle>; onBusyChange: (value: boolean) => void; disabled?: boolean }
export function ProfileReviewWorkspace({ navigationRef, onBusyChange, disabled = false }: Props) {
  const [applications, setApplications] = useState<RegistrationReview[]>([])
  const [selected, setSelected] = useState<RegistrationReview | null>(null)
  const [feedback, setFeedback] = useState('')
  const [history, setHistory] = useState(false)
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const load = useCallback(async (signal?: AbortSignal) => {
    setApplications((await api<{ registrations: RegistrationReview[] }>('/registrations', { signal })).registrations)
  }, [])
  useEffect(() => {
    const abort = new AbortController()
    load(abort.signal).catch(error => { if (!abort.signal.aborted) setError(error.message) }).finally(() => { if (!abort.signal.aborted) setLoading(false) })
    return () => abort.abort()
  }, [load])
  useEffect(() => { onBusyChange(busy); return () => onBusyChange(false) }, [busy, onBusyChange])
  const navigation = useDiscardNavigation({ dirty: Boolean(feedback.trim()), busy: busy || disabled, title: 'Discard this review note?', message: 'This review note has not been submitted. Discard it and leave this page?' })
  useImperativeHandle(navigationRef, () => ({ requestLeave: navigation.requestLeave }), [navigation.requestLeave])
  async function review(decision: 'approve' | 'reject') {
    if (!selected || busy || disabled) return
    setBusy(true); setError(''); setNotice('')
    try {
      const { registration } = await api<{ registration: RegistrationReview }>(`/registrations/${selected.id}/review`, { method: 'POST', body: { decision, feedback, version: selected.version } })
      setApplications(current => current.map(item => item.id === registration.id ? registration : item))
      setSelected(registration); setFeedback('')
      setNotice(decision === 'approve' ? `${registration.profile.name} can now sign in and appears on People.` : 'Application rejected. No account or public profile was created.')
    } catch (error) { setError((error as Error).message) }
    finally { setBusy(false) }
  }
  const visible = applications.filter(item => history ? item.status !== 'pending' : item.status === 'pending')
  return <section>
    <DiscardChangesDialog {...navigation.dialog} />
    {error && <p className="mb-6 border-l-2 border-accent pl-4 text-accent" role="alert">{error}</p>}
    {notice && <p className="mb-6 text-ink-soft" role="status">{notice}</p>}
    {selected ? <ProfileReviewDetail application={selected} feedback={feedback} onFeedback={setFeedback} busy={busy || disabled} onReview={review} onBack={() => navigation.requestLeave(() => { setSelected(null); setFeedback(''); setError('') })} /> : <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-5"><h2 className="m-0 text-3xl font-medium tracking-tight">Registration applications</h2><button className={buttonClass} disabled={loading || busy} onClick={async () => { setLoading(true); setError(''); try { await load() } catch (error) { setError((error as Error).message) } finally { setLoading(false) } }}>Refresh</button></div>
      <div className="mb-6 flex gap-3" role="group" aria-label="Application status"><button className={buttonClass} aria-pressed={!history} onClick={() => setHistory(false)}>Pending ({applications.filter(item => item.status === 'pending').length})</button><button className={buttonClass} aria-pressed={history} onClick={() => setHistory(true)}>Reviewed</button></div>
      {loading ? <p role="status" className="py-8 text-ink-soft">Loading applications…</p> : !visible.length ? <p className="border-y border-line py-10 text-ink-soft">{history ? 'No reviewed applications yet.' : 'No pending applications.'}</p> : <ul className="list-none p-0">{visible.map(application => <li key={application.id} className="flex items-center gap-5 border-t border-line py-6 last:border-b max-[500px]:flex-wrap">
        <img src={application.profile.idPhoto} alt="" className="h-20 w-16 shrink-0 object-cover bg-panel" />
        <div className="min-w-0 flex-1"><p className="m-0 font-mono text-xs uppercase text-accent">{positionLabels[application.profile.position]} · {application.status}</p><h3 className="mb-1 mt-2 break-words text-xl font-medium">{application.profile.name}</h3><p className="m-0 text-sm text-ink-soft">@{application.username}</p></div>
        <button className={buttonClass} onClick={() => { setSelected(application); setFeedback(''); setError(''); setNotice('') }} aria-label={`Review profile: ${application.profile.name}`}>{application.status === 'pending' ? 'Review profile' : 'View decision'}</button>
      </li>)}</ul>}
    </>}
  </section>
}
