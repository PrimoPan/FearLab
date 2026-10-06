import { useEffect, useImperativeHandle, useRef, useState, type Ref } from 'react'
import { Link } from 'react-router-dom'
import type { PortalUser } from '../../lib/portal/types'
import { useProjectWorkspace } from '../../lib/portal/useProjectWorkspace'
import { useWorkspaceNavigation, type WorkspaceNavigationHandle } from '../../lib/portal/useWorkspaceNavigation'
import { MaterialProject } from '../projects/MaterialProject'
import { ProjectEditor } from './ProjectEditor'
import { ProjectQueue } from './ProjectQueue'
import { ReviewActions } from './ReviewActions'
import { UnsavedChangesDialog } from './UnsavedChangesDialog'
import { buttonClass, primaryClass, statusLabels } from './portalStyles'

type ProjectWorkspaceProps = {
  user: PortalUser
  disabled?: boolean
  profile?: boolean
  reviewMode?: boolean
  onUnsavedChange?: (dirty: boolean) => void
  onBusyChange?: (busy: boolean) => void
  navigationRef?: Ref<WorkspaceNavigationHandle>
}

export function ProjectWorkspace({ user, disabled = false, profile = false, reviewMode = false, onUnsavedChange, onBusyChange, navigationRef }: ProjectWorkspaceProps) {
  const work = useProjectWorkspace(user)
  const [preview, setPreview] = useState(false)
  const [uploading, setUploading] = useState(false)
  const locked = disabled || work.busy || uploading
  const callbacks = useRef({ onUnsavedChange, onBusyChange })
  callbacks.current = { onUnsavedChange, onBusyChange }
  const revisingSubmission = work.selected?.status === 'submitted' && user.role !== 'admin'
  const reviewing = reviewMode && user.role === 'admin'
  const projects = reviewing ? work.projects : work.projects.filter(project => project.ownerId === user.id)
  const navigation = useWorkspaceNavigation({ dirty: work.dirty, busy: locked, save: work.save, discard: work.discard, saveError: work.saveError })
  useImperativeHandle(navigationRef, () => ({ requestLeave: navigation.requestLeave }), [navigation.requestLeave])

  useEffect(() => { callbacks.current.onUnsavedChange?.(work.dirty) }, [work.dirty])
  useEffect(() => { callbacks.current.onBusyChange?.(locked) }, [locked])
  useEffect(() => () => {
    callbacks.current.onUnsavedChange?.(false)
    callbacks.current.onBusyChange?.(false)
  }, [])

  return <div>
    <UnsavedChangesDialog {...navigation.dialog} submitted={revisingSubmission} />
    {work.error && <p role="alert" className="mb-6 border-l-2 border-accent py-3 pl-4 text-accent">{work.error}</p>}
    {work.notice && <p role="status" className="mb-6 text-ink-soft">{work.notice}</p>}
    {!work.selected ? <ProjectQueue projects={projects} user={user} reviewMode={reviewing} busy={locked} profile={profile} onOpen={work.open} onCreate={work.create} onOrder={work.order} onApprove={reviewing ? work.approve : undefined} /> : <>
      <div className="sticky top-[var(--sticky-header-offset)] z-20 mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-line bg-site-layer/95 py-4 backdrop-blur-xl">
        <button className={buttonClass} onClick={() => navigation.requestLeave(() => { work.close(); setPreview(false) })}>← {profile ? 'Proposals' : 'Project list'}</button>
        <p className="m-0 font-mono text-xs text-accent">{statusLabels[work.selected.status]}{work.dirty ? ' · Unsaved changes' : ''}</p>
        <div className="flex flex-wrap gap-2"><button className={buttonClass} onClick={() => setPreview(value => !value)} disabled={locked}>{preview ? 'Back to editor' : 'Preview page'}</button><button className={buttonClass} disabled={locked || !work.dirty} onClick={work.discard}>Discard changes</button><button className={primaryClass} disabled={locked || !work.dirty} onClick={work.save}>{uploading ? 'Uploading…' : work.busy ? 'Saving…' : revisingSubmission ? 'Save revised draft' : work.selected.status === 'submitted' ? 'Save changes' : 'Save draft'}</button></div>
      </div>
      {work.selected.feedback && <div className="mb-8 border-l-2 border-accent pl-5"><p className="font-mono text-xs text-accent">Review feedback</p><p className="whitespace-pre-wrap text-ink-soft">{work.selected.feedback}</p></div>}
      {revisingSubmission && <p className="mb-8 border-l-2 border-accent pl-5 text-sm leading-relaxed text-ink-soft">You can continue editing this proposal. Saving returns it to Draft and pauses review. Submit the revised version when you are ready.</p>}
      {work.selected.publishedAt && <p className="mb-8 text-sm leading-relaxed text-ink-soft"><Link to={`/projects/research/${work.selected.id}`} className="text-accent underline underline-offset-4">View published project ↗</Link><span className="ml-3">Your published version stays live while revisions are reviewed.</span></p>}
      {preview ? <MaterialProject data={work.value} preview /> : <ProjectEditor value={work.value} onChange={work.setValue} disabled={locked} onBusyChange={setUploading} />}
      {reviewing && work.selected.status === 'submitted' ? <ReviewActions key={work.selected.id} project={work.selected} busy={locked} dirty={work.dirty} onReview={work.review} /> : ['draft', 'changes'].includes(work.selected.status) && <div className="mt-10 flex flex-wrap items-center gap-5 border-t border-line pt-8"><button className={primaryClass} onClick={work.submit} disabled={locked || work.dirty}>Submit for review ↗</button><p className="m-0 text-sm text-ink-soft">{work.dirty ? 'Save your changes before submitting.' : 'Dongyijie Primo Pan or Mirjana Prpa will review this version before it appears publicly.'}</p></div>}
    </>}
  </div>
}
