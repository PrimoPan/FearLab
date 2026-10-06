import { Link } from 'react-router-dom'
import type { PortalProject, PortalUser } from '../../lib/portal/types'
import { buttonClass, primaryClass, statusLabels } from './portalStyles'

type ProjectQueueProps = {
  projects: PortalProject[]
  user: PortalUser
  busy: boolean
  onOpen: (project: PortalProject) => void
  onCreate: () => void
  onOrder: (index: number, direction: number) => void
  onApprove?: (project: PortalProject) => void
  profile?: boolean
  reviewMode?: boolean
}

const savedDateFormat = new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' })

function SavedDate({ value }: { value: string }) {
  const date = new Date(value)
  return <span>Last saved: {Number.isNaN(date.getTime()) ? 'Date unavailable' : <time dateTime={date.toISOString()}>{savedDateFormat.format(date)}</time>}</span>
}

export function ProjectQueue({ projects, user, busy, onOpen, onCreate, onOrder, onApprove, profile = false, reviewMode = false }: ProjectQueueProps) {
  const admin = user.role === 'admin' && reviewMode
  const heading = profile ? (admin ? 'All proposals' : 'Your proposals') : (admin ? 'Projects & review queue' : 'Your projects')

  return (
    <section>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <h2 className="m-0 text-3xl font-medium tracking-tight">{heading}</h2>
        {!admin && <button type="button" className={primaryClass} onClick={onCreate} disabled={busy}>+ New project</button>}
      </div>
      <p className="mb-8 mt-0 max-w-[70ch] text-sm leading-relaxed text-ink-soft">
        {admin ? 'Review submitted proposals, refine their pages, then publish. Use the arrows to set their order on Projects.' : 'Build a draft, preview its page, then submit it for review.'}
        {' '}Dongyijie Primo Pan and Mirjana Prpa can both review every proposal.
      </p>
      {!projects.length && <p className="m-0 border-y border-line py-12 text-ink-soft">No {profile ? 'proposals' : 'projects'} yet. Start with an author, a cover image and a title.</p>}
      <ul className="m-0 list-none p-0">
        {projects.map((project, index) => {
          const title = project.data.title || 'Untitled project'
          return (
            <li key={project.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-8 gap-y-5 border-t border-line py-7 last:border-b max-[800px]:grid-cols-1">
              <div className="min-w-0">
                <p className="m-0 font-mono text-xs leading-relaxed text-accent">
                  {statusLabels[project.status]}
                  {project.publishedAt && project.status !== 'approved' && <span className="text-ink-soft"> · Previous version live</span>}
                </p>
                <h3 className="mb-2 mt-3 break-words text-xl font-medium leading-tight tracking-[-0.025em]">
                  <button type="button" className="cursor-pointer border-0 bg-transparent p-0 font-sans text-left text-inherit transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-50" onClick={() => onOpen(project)} disabled={busy}>{title}</button>
                </h3>
                <p className="m-0 break-words text-sm leading-relaxed text-ink-soft">{project.data.authors || 'Authors to be added'}</p>
                <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs leading-relaxed text-ink-soft">
                  <SavedDate value={project.updatedAt} />
                  {project.publishedAt && <Link to={`/projects/research/${encodeURIComponent(project.id)}`} className="inline-flex min-h-8 items-center gap-2 text-sm text-ink underline decoration-accent underline-offset-4 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent aria-disabled:opacity-50" aria-disabled={busy} tabIndex={busy ? -1 : undefined} onClick={(event) => { if (busy) event.preventDefault() }}>Published page <span aria-hidden="true">↗</span></Link>}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {admin && <>
                  <button type="button" className={buttonClass} onClick={() => onOrder(index, -1)} disabled={busy || index === 0} aria-label={`Move ${title} up in Projects`}>↑</button>
                  <button type="button" className={buttonClass} onClick={() => onOrder(index, 1)} disabled={busy || index === projects.length - 1} aria-label={`Move ${title} down in Projects`}>↓</button>
                </>}
                <button type="button" className={buttonClass} onClick={() => onOpen(project)} disabled={busy} aria-label={`${admin ? 'Review and edit' : 'Edit proposal'}: ${title}`}>{admin ? 'Review & edit' : 'Edit proposal'}</button>
                {admin && project.status === 'submitted' && onApprove && <button type="button" className={primaryClass} disabled={busy} onClick={() => onApprove(project)} aria-label={`Approve ${title}`}>Approve</button>}
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
