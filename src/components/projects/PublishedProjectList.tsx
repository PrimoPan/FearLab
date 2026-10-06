import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../../lib/portal/api'
import type { PortalProject } from '../../lib/portal/types'
import { projectLabel } from './ProjectReveal'

export function PublishedProjectList() {
  const [projects, setProjects] = useState<PortalProject[]>([])
  useEffect(() => {
    const controller = new AbortController()
    api<{ projects: PortalProject[] }>('/public/projects', { signal: controller.signal }).then(result => setProjects(result.projects)).catch(() => { /* The static research page remains available without the optional studio service. */ })
    return () => controller.abort()
  }, [])
  return <>{projects.map(project => <Link key={project.id} to={`/projects/research/${project.id}`} className="group grid grid-cols-[224px_minmax(0,1fr)_auto] items-center gap-x-8 gap-y-4 border-b border-line py-7 text-inherit no-underline focus-visible:outline-2 focus-visible:outline-accent max-[700px]:grid-cols-[112px_minmax(0,1fr)] max-[700px]:gap-x-5">
    <div className="relative aspect-[3/2] overflow-hidden bg-panel max-[700px]:aspect-[4/3]"><img src={project.data.hero} alt={project.data.heroAlt} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transform-none" loading="lazy" /></div>
    <div className="min-w-0"><p className={`${projectLabel} mt-0`}>Research project</p><h2 className="m-0 break-words text-[clamp(1.4rem,2.5vw,2rem)] font-medium leading-tight tracking-tight group-hover:text-accent">{project.data.title}</h2><p className="mb-0 mt-3 text-sm leading-relaxed text-ink-soft max-[700px]:hidden">{project.data.subtitle}</p><p className="mb-0 mt-3 text-xs text-ink-soft">{project.data.leader}</p></div>
    <span className="text-2xl max-[700px]:hidden" aria-hidden="true">↗</span>
  </Link>)}</>
}
