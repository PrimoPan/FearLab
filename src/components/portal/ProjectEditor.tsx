import { useEffect, useId, useRef, useState } from 'react'
import { newSection, type ProjectMaterial, type ProjectSection } from '../../lib/portal/types'
import { ImageUpload } from './ImageUpload'
import { SectionEditor } from './SectionEditor'
import { buttonClass, fieldClass, labelClass } from './portalStyles'
import { ProjectTemplates } from './ProjectTemplates'
import { SortableList, SortableItem } from './SortableList'

type ProjectEditorProps = {
  value: ProjectMaterial
  onChange: (value: ProjectMaterial) => void
  disabled?: boolean
  onBusyChange?: (busy: boolean) => void
}

const fields = [
  ['authors', 'Authors'], ['title', 'Project title'], ['subtitle', 'Project subtitle'],
  ['leader', 'Project leader'], ['supervisor', 'Supervisor']
] as const

export function ProjectEditor({ value, onChange, disabled = false, onBusyChange }: ProjectEditorProps) {
  const id = useId()
  const [uploading, setUploading] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(value.sections[0]?.id ?? null)
  const [templateNote, setTemplateNote] = useState('')
  const busyRef = useRef(onBusyChange)
  busyRef.current = onBusyChange
  const locked = disabled || uploading
  const change = (patch: Partial<ProjectMaterial>) => onChange({ ...value, ...patch })

  useEffect(() => { busyRef.current?.(uploading) }, [uploading])
  useEffect(() => () => { busyRef.current?.(false) }, [])

  function moveSection(index: number, direction: -1 | 1) {
    const sections = [...value.sections]
    ;[sections[index], sections[index + direction]] = [sections[index + direction], sections[index]]
    change({ sections })
  }
  function reorder(activeId: string, overId: string) {
    const sections = [...value.sections]
    const from = sections.findIndex(section => section.id === activeId)
    const to = sections.findIndex(section => section.id === overId)
    if (from < 0 || to < 0 || from === to) return
    sections.splice(to, 0, ...sections.splice(from, 1))
    change({ sections })
  }
  function applyTemplate(sections: ProjectSection[]) {
    const hasContent = value.sections.some(section => section.heading || section.images.some(image => image.url) || JSON.stringify(section.body).includes('"text":'))
    const existing = hasContent ? value.sections : []
    if (existing.length + sections.length > 40) { setTemplateNote('Remove a few sections before adding this template. Projects support up to 40 sections.'); return }
    change({ sections: [...existing, ...sections] }); setExpanded(null)
    setTemplateNote(hasContent ? 'Template sections added below your existing content. Open any section to customize it.' : 'Template added. Open a section to add your own text and images.')
  }

  return (
    <div className="min-w-0" aria-busy={uploading}>
      <ProjectTemplates value={value} onApply={applyTemplate} disabled={locked} />
      {templateNote && <p role="status" className="mb-8 border-l-2 border-accent pl-4 text-sm leading-relaxed text-ink-soft">{templateNote}</p>}
      <fieldset className="m-0 min-w-0 border-0 p-0" disabled={locked}>
        <legend className="mb-6 font-mono text-xs tracking-[0.12em] text-accent uppercase">Project basics</legend>
        <div className="grid grid-cols-2 gap-6 max-[700px]:grid-cols-1">
          {fields.map(([key, label]) => (
            <div key={key} className={key === 'subtitle' || key === 'title' ? 'col-span-2 max-[700px]:col-span-1' : undefined}>
              <label htmlFor={`${id}-${key}`} className={labelClass}>{label}</label>
              {key === 'subtitle'
                ? <textarea id={`${id}-${key}`} className={`${fieldClass} min-h-28 resize-y`} rows={3} maxLength={1000} value={value[key]} onChange={(event) => change({ [key]: event.target.value })} />
                : <input id={`${id}-${key}`} className={fieldClass} maxLength={400} value={value[key]} onChange={(event) => change({ [key]: event.target.value })} />}
            </div>
          ))}
        </div>
      </fieldset>
      <div className="my-9">
        <ImageUpload value={{ url: value.hero, alt: value.heroAlt, caption: '' }} label="Project hero image" showCaption={false} altMaxLength={400} disabled={locked} onBusyChange={setUploading} onChange={(image) => change({ hero: image.url, heroAlt: image.alt })} />
      </div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="m-0 text-2xl font-medium tracking-[-0.035em]">Project sections</h2>
        <div className="flex flex-wrap gap-2"><button type="button" className={buttonClass} disabled={locked || !expanded} onClick={() => setExpanded(null)}>Collapse all</button><button type="button" className={buttonClass} disabled={locked || value.sections.length >= 40} onClick={() => { const section = newSection(); change({ sections: [...value.sections, section] }); setExpanded(section.id) }}>Add section</button></div>
      </div>
      <p className="mb-6 text-sm leading-relaxed text-ink-soft">Drag a section by its handle to reorder your story. Open a section to edit its text, layout and images.</p>
      {value.sections.length === 0 && <p className="m-0 border-t border-line py-7 text-ink-soft">Add a section to introduce the project.</p>}
      <SortableList ids={value.sections.map(section => section.id)} onReorder={reorder} disabled={locked}>
        {value.sections.map((section, index) => <SortableItem key={section.id} id={section.id} label={`section ${index + 1}: ${section.heading || 'Untitled section'}`} disabled={locked}>{handle => <div className="border-t border-line bg-panel px-4">
          <div className="flex flex-wrap items-center gap-3 py-4">{handle}<span className="font-mono text-xs text-accent">{String(index + 1).padStart(2, '0')}</span><button type="button" className="min-h-11 min-w-0 flex-1 cursor-pointer border-0 bg-transparent text-left font-medium text-ink" disabled={locked} aria-expanded={expanded === section.id} onClick={() => setExpanded(expanded === section.id ? null : section.id)}>{section.heading || 'Untitled section'}<span className="mt-1 block text-xs font-normal text-ink-soft">{section.layout.replaceAll('-', ' ')} · {expanded === section.id ? 'Close editor ↑' : 'Edit section ↓'}</span></button>{expanded !== section.id && <div className="flex gap-2"><button type="button" className={buttonClass} disabled={locked || index === 0} onClick={() => moveSection(index, -1)} aria-label={`Move section ${index + 1} up`}>↑</button><button type="button" className={buttonClass} disabled={locked || index === value.sections.length - 1} onClick={() => moveSection(index, 1)} aria-label={`Move section ${index + 1} down`}>↓</button></div>}</div>
          {expanded === section.id && <SectionEditor value={section} index={index} disabled={locked} onBusyChange={setUploading} canMoveUp={index > 0} canMoveDown={index < value.sections.length - 1} onMove={(direction) => moveSection(index, direction)} onRemove={() => change({ sections: value.sections.filter((item) => item.id !== section.id) })} onChange={(next) => change({ sections: value.sections.map((item) => item.id === section.id ? next : item) })} />}
        </div>}</SortableItem>)}
      </SortableList>
    </div>
  )
}
