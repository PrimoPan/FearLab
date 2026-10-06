import { NavLink } from 'react-router-dom'
import { buttonClass } from './portalStyles'
import { cn } from '../../lib/cn'

export function AdminBar() {
  return <nav aria-label="Administration" className="mb-10 flex flex-wrap items-center gap-3 border-y border-line py-4">
    <span className="mr-3 font-mono text-xs tracking-widest text-ink-soft uppercase">Admin</span>
    <NavLink to="/test/admin/profiles" className={cn(buttonClass, 'no-underline aria-[current=page]:border-accent aria-[current=page]:text-accent')}>Profile approvals</NavLink>
    <NavLink to="/test/admin/projects" className={cn(buttonClass, 'no-underline aria-[current=page]:border-accent aria-[current=page]:text-accent')}>Project approvals</NavLink>
  </nav>
}
