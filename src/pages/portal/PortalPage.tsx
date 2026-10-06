import { useRef, useState } from 'react'
import { Link, Navigate, useLocation } from 'react-router-dom'
import { LoginForm } from '../../components/portal/AuthForms'
import { ProjectWorkspace } from '../../components/portal/ProjectWorkspace'
import { ProfileAccount } from '../../components/portal/ProfileAccount'
import { buttonClass } from '../../components/portal/portalStyles'
import { projectLabel, projectWidth } from '../../components/projects/ProjectReveal'
import { api } from '../../lib/portal/api'
import { usePortalSession } from '../../lib/portal/PortalSessionContext'
import type { WorkspaceNavigationHandle } from '../../lib/portal/useWorkspaceNavigation'
import { cn } from '../../lib/cn'
import { AdminBar } from '../../components/portal/AdminBar'
import { ProfileReviewWorkspace } from '../../components/portal/ProfileReviewWorkspace'
import { RegistrationPage } from './RegistrationPage'

export function PortalPage() {
  const path = useLocation().pathname.replace(/\/$/, '')
  if (path === '/test/reigister' || path === '/test/register') return <RegistrationPage />
  if (!['/test', '/test/profile', '/test/admin/profiles', '/test/admin/projects'].includes(path)) return <Navigate to="/test" replace />
  return <MemberPortalPage path={path} />
}

function MemberPortalPage({ path }: { path: string }) {
  const { session, setSession, error: sessionError } = usePortalSession()
  const profile = path === '/test/profile'
  const profileReview = path === '/test/admin/profiles'
  const projectReview = path === '/test/admin/projects'
  const adminRoute = profileReview || projectReview
  const [error, setError] = useState('')
  const [sessionBusy, setSessionBusy] = useState(false)
  const [passwordBusy, setPasswordBusy] = useState(false)
  const [workspaceDirty, setWorkspaceDirty] = useState(false)
  const [workspaceBusy, setWorkspaceBusy] = useState(false)
  const workspaceNavigation = useRef<WorkspaceNavigationHandle>(null)
  const sessionLocked = sessionBusy || passwordBusy
  async function logout() {
    setSessionBusy(true); setError('')
    try { await api('/auth/logout', { method: 'POST' }); setSession({ user: null, csrfToken: null }) }
    catch (error) { setError((error as Error).message) }
    finally { setSessionBusy(false) }
  }
  function requestLogout() {
    if (workspaceNavigation.current) workspaceNavigation.current.requestLeave(logout)
    else void logout()
  }
  const user = session?.user
  const title = !user ? 'Sign in' : adminRoute ? user.role !== 'admin' ? 'Administrator access' : profileReview ? 'Profile approvals' : 'Project approvals' : profile ? 'My Profile' : 'Project studio'
  return <div className={cn(projectWidth, 'relative z-[1] py-[clamp(2rem,5vw,4rem)]')}>
    <header className="mb-12 border-b border-line pb-8">
      <p className={projectLabel}>FEAR Lab · Member workspace</p>
      <div className="flex flex-wrap items-end justify-between gap-6"><h1 className="m-0 text-[clamp(2.5rem,6vw,4.5rem)] font-medium leading-none tracking-[-0.05em]">{title}<span className="text-accent">.</span></h1>
        {user ? <div className="flex flex-wrap items-center gap-3">{!profile && <span className="mr-2 text-sm text-ink-soft">{user.name}{user.role === 'admin' ? ' · Admin' : ''}</span>}{(profile || adminRoute) && <Link to="/test" className={cn(buttonClass, 'no-underline')}>Project studio</Link>}<button className={buttonClass} disabled={sessionLocked} onClick={requestLogout}>Sign out</button></div> : <Link to="/projects" className="text-sm text-ink-soft no-underline">← Back to projects</Link>}
      </div>
      {(workspaceDirty || workspaceBusy) && <p className="mb-0 mt-5 text-sm leading-relaxed text-ink-soft" role="status">{workspaceBusy ? 'An operation is in progress.' : 'You have unsaved changes. You can save or discard them when leaving this page.'}</p>}
    </header>
    {(error || sessionError) && <p role="alert" className="text-accent">{error || sessionError}</p>}
    {!session ? <p className="text-ink-soft">{sessionError ? 'Start the project service and reload this page.' : 'Loading workspace…'}</p> : !user ? <><LoginForm onSession={setSession} /><p className="mt-8 text-sm text-ink-soft">Need a member account? <Link className="text-accent underline underline-offset-4" to="/test/reigister">Register for review</Link></p></> : <>
      {user.role === 'admin' && <AdminBar />}
      {profile && <ProfileAccount user={user} disabled={sessionLocked || workspaceBusy} onSession={setSession} onBusyChange={setPasswordBusy} />}
      {adminRoute && user.role !== 'admin' ? <p className="border-y border-line py-10 text-ink-soft">Only Dongyijie Primo Pan and Mirjana Prpa can review applications. <Link to="/test" className="text-accent underline">Return to your workspace</Link>.</p> : profileReview ?
        <ProfileReviewWorkspace key={user.id} disabled={sessionBusy} onBusyChange={setWorkspaceBusy} navigationRef={workspaceNavigation} /> :
        <ProjectWorkspace key={`${user.id}:${path}`} user={user} profile={profile || projectReview} reviewMode={projectReview} disabled={sessionBusy || passwordBusy} onUnsavedChange={setWorkspaceDirty} onBusyChange={setWorkspaceBusy} navigationRef={workspaceNavigation} />}
    </>}
  </div>
}
