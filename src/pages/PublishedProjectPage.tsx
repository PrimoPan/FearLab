import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { MaterialProject } from '../components/projects/MaterialProject'
import { projectWidth } from '../components/projects/ProjectReveal'
import { api } from '../lib/portal/api'
import type { PortalProject } from '../lib/portal/types'

export function PublishedProjectPage() {
  const { id } = useParams()
  const [project, setProject] = useState<PortalProject | null>(null)
  const [error, setError] = useState('')
  useEffect(() => {
    const controller = new AbortController()
    setProject(null); setError('')
    api<{ project: PortalProject }>(`/public/projects/${id}`, { signal: controller.signal }).then(value => setProject(value.project)).catch(error => { if (!controller.signal.aborted) setError(error.message) })
    return () => controller.abort()
  }, [id])
  if (project) return <MaterialProject data={project.data} />
  return <section className={`${projectWidth} py-16`}><h1>{error ? 'Project unavailable' : 'Loading project…'}</h1>{error && <p className="text-ink-soft">{error}</p>}<Link to="/projects">← All projects</Link></section>
}
