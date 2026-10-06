import { useCallback, useEffect, useRef, useState } from 'react'
import { api } from './api'
import { newMaterial, type PortalProject, type PortalUser, type ProjectMaterial } from './types'

export function useProjectWorkspace(user: PortalUser) {
  const [projects, setProjects] = useState<PortalProject[]>([])
  const [selected, setSelected] = useState<PortalProject | null>(null)
  const [value, setValue] = useState<ProjectMaterial>(newMaterial(user.name))
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [saveError, setSaveError] = useState('')
  const saving = useRef<Promise<boolean> | null>(null)
  const [notice, setNotice] = useState('')
  const dirty = Boolean(selected && JSON.stringify(value) !== JSON.stringify(selected.data))
  const load = useCallback(async () => { setProjects((await api<{ projects: PortalProject[] }>('/projects')).projects) }, [])
  useEffect(() => { load().catch(error => setError(error.message)) }, [load])
  function adopt(project: PortalProject) {
    const data = { ...project.data, sections: project.data.sections.map(section => ({ ...section, images: section.images.map(image => ({ ...image, id: image.id ?? crypto.randomUUID() })) })) }
    const normalized = { ...project, data }
    setSelected(normalized); setValue(data); setSaveError('')
    return normalized
  }
  async function run(action: () => Promise<void>) {
    setBusy(true); setError(''); setNotice('')
    try { await action() } catch (error) { setError((error as Error).message) } finally { setBusy(false) }
  }
  function create() { return run(async () => { adopt((await api<{ project: PortalProject }>('/projects', { method: 'POST', body: { project: newMaterial(user.name) } })).project); await load() }) }
  function save(): Promise<boolean> {
    if (saving.current) return saving.current
    if (!selected || !dirty) { setSaveError(''); return Promise.resolve(true) }
    setBusy(true); setError(''); setSaveError(''); setNotice('')
    const savedMessage = selected.status === 'submitted' && user.role !== 'admin'
      ? 'Changes saved as a draft. Submit again when your revised proposal is ready for review.'
      : selected.status === 'submitted' ? 'Changes saved. This version is ready for review.' : 'Draft saved.'
    const operation = Promise.resolve().then(async () => {
      let persisted: PortalProject
      try {
        persisted = (await api<{ project: PortalProject }>(`/projects/${selected.id}`, { method: 'PATCH', body: { project: value, version: selected.version } })).project
      } catch (cause) {
        const message = cause instanceof Error ? cause.message : 'Could not save the project. Please try again.'
        setSaveError(message); setError(message)
        return false
      }
      const fresh = adopt(persisted)
      setProjects(current => current.some(item => item.id === fresh.id)
        ? current.map(item => item.id === fresh.id ? fresh : item)
        : [...current, fresh])
      setNotice(savedMessage)
      try { await load() } catch {
        setNotice(`${savedMessage} The project list could not be refreshed; your changes are saved.`)
      }
      return true
    }).finally(() => { saving.current = null; setBusy(false) })
    saving.current = operation
    return operation
  }
  function submit() { return run(async () => {
    if (!selected || dirty) return
    adopt((await api<{ project: PortalProject }>(`/projects/${selected.id}/submit`, { method: 'POST', body: { version: selected.version } })).project)
    setNotice('Submitted for review.'); await load()
  }) }
  function review(decision: 'approve' | 'changes', feedback: string) { return run(async () => {
    if (!selected || dirty) return
    adopt((await api<{ project: PortalProject }>(`/projects/${selected.id}/review`, { method: 'POST', body: { decision, feedback, version: selected.version } })).project)
    setNotice(decision === 'approve' ? 'Published to Projects.' : 'Changes requested.'); await load()
  }) }
  function approve(project: PortalProject) { return run(async () => {
    try {
      await api(`/projects/${project.id}/review`, { method: 'POST', body: { decision: 'approve', feedback: '', version: project.version } })
      setNotice(`“${project.data.title}” is now published on Projects.`)
    } finally { await load() }
  }) }
  function order(index: number, direction: number) { return run(async () => {
    const ids = projects.map(project => project.id)
    ;[ids[index], ids[index + direction]] = [ids[index + direction], ids[index]]
    setProjects((await api<{ projects: PortalProject[] }>('/projects/order', { method: 'PATCH', body: { ids } })).projects)
  }) }
  function open(project: PortalProject) { return run(async () => {
    const fresh = (await api<{ project: PortalProject }>(`/projects/${project.id}`)).project
    adopt(fresh)
    setProjects(current => current.map(item => item.id === fresh.id ? fresh : item))
  }) }
  function discard() {
    if (!selected) return
    setValue(selected.data); setError(''); setSaveError(''); setNotice('Unsaved changes discarded. Your last saved version is restored.')
  }
  function close() {
    setSelected(null); setError(''); setSaveError(''); setNotice('')
  }
  return { projects, selected, value, setValue, busy, error, saveError, notice, dirty, create, save, submit, review, approve, order, open, close, discard }
}
