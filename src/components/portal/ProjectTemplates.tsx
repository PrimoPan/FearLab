import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ProjectMaterial, ProjectSection } from '../../lib/portal/types'
import { createTemplatePreview, createTemplateSections, projectTemplates, type ProjectTemplate } from '../../lib/portal/templates'
import { cn } from '../../lib/cn'
import { MaterialProject } from '../projects/MaterialProject'
import { buttonClass, primaryClass } from './portalStyles'

type ProjectTemplatesProps = { value: ProjectMaterial; onApply: (sections: ProjectSection[]) => void; disabled?: boolean }

function TemplateMiniature({ template }: { template: ProjectTemplate }) {
  const lines = <div className="flex flex-1 flex-col justify-center gap-1"><span className="h-1.5 w-3/4 bg-ink/45" /><span className="h-1 w-full bg-ink/15" /><span className="h-1 w-5/6 bg-ink/15" /></div>
  const image = <div className="min-h-6 flex-1 border border-accent/30 bg-accent/15" />
  return <div aria-hidden="true" className="flex aspect-[4/3] flex-col gap-2 overflow-hidden border border-line bg-panel p-4">
    <div className="flex h-[30%] shrink-0 flex-col justify-end gap-1.5 bg-ink/85 p-3"><span className="h-2 w-3/5 bg-panel/90" /><span className="h-1 w-2/5 bg-panel/50" /></div>
    {template.sections.map((section, index) => <div className="flex min-h-0 flex-1 gap-2" key={index}>
      {section.layout === 'gallery' ? <>{image}{image}</> : section.layout === 'image-left' ? <>{image}{lines}</> : section.layout === 'image-right' ? <>{lines}{image}</> : lines}
    </div>)}
  </div>
}

function PreviewPage({ data, mobile, onClose }: { data: ProjectMaterial; mobile: boolean; onClose: () => void }) {
  const [mount, setMount] = useState<HTMLElement | null>(null)
  useEffect(() => {
    if (!mount) return
    const doc = mount.ownerDocument
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); onClose() } }
    doc.addEventListener('keydown', closeOnEscape)
    return () => doc.removeEventListener('keydown', closeOnEscape)
  }, [mount, onClose])
  return <>
    <iframe title={mobile ? 'Phone template preview' : 'Desktop template preview'} className={cn('block h-[66vh] min-h-80 shrink-0 border-0 bg-panel', mobile ? 'mx-auto w-[390px] max-w-full border-x border-line' : 'mx-auto w-[1100px]')}
      sandbox="allow-same-origin"
      srcDoc="<!doctype html><html lang='en'><head><meta name='viewport' content='width=device-width, initial-scale=1'></head><body><div id='template-page'></div></body></html>"
      onLoad={(event) => {
        const doc = event.currentTarget.contentDocument
        if (!doc) return
        doc.documentElement.dataset.theme = document.documentElement.dataset.theme
        document.querySelectorAll('style, link[rel="stylesheet"]').forEach((style) => doc.head.append(style.cloneNode(true)))
        setMount(doc.getElementById('template-page'))
      }}
    />
    {mount && createPortal(<div onClickCapture={(event) => { if ((event.target as Element).closest('a')) event.preventDefault() }}><MaterialProject data={data} preview /></div>, mount)}
  </>
}

function TemplatePreview({ template, value, disabled, onApply, onClose }: ProjectTemplatesProps & { template: ProjectTemplate; onClose: () => void }) {
  const id = useId()
  const dialog = useRef<HTMLDialogElement>(null)
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 600px)').matches)
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const element = dialog.current
    element?.showModal()
    return () => { element?.close(); previous?.focus() }
  }, [])
  return <dialog ref={dialog} aria-labelledby={`${id}-title`} aria-describedby={`${id}-description`} onCancel={(event) => { event.preventDefault(); onClose() }} className="fixed inset-0 m-auto max-h-[96dvh] w-[min(1160px,96vw)] max-w-none overflow-auto border border-line bg-[var(--bg)] p-0 text-ink shadow-2xl backdrop:bg-black/75">
    <div className="sticky top-0 z-10 border-b border-line bg-[var(--bg)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id={`${id}-title`} className="m-0 text-xl font-medium">{template.name} preview</h3>
        <button type="button" className={buttonClass} onClick={onClose} autoFocus>Close preview</button>
      </div>
      <p id={`${id}-description`} className="mb-4 mt-3 max-w-3xl text-sm leading-relaxed text-ink-soft">Sample writing and images show how this layout works. Using the template adds editable headings and empty sections for your own content.</p>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2" role="group" aria-label="Preview size">
          <button type="button" className={cn(buttonClass, !mobile && 'border-accent text-accent')} aria-pressed={!mobile} onClick={() => setMobile(false)}>Desktop</button>
          <button type="button" className={cn(buttonClass, mobile && 'border-accent text-accent')} aria-pressed={mobile} onClick={() => setMobile(true)}>Phone</button>
        </div>
        <button type="button" className={primaryClass} disabled={disabled} onClick={() => { onApply(createTemplateSections(template)); onClose() }}>Use this template</button>
      </div>
    </div>
    <div className="overflow-x-auto bg-panel p-3 max-[600px]:p-0"><PreviewPage data={createTemplatePreview(template, value)} mobile={mobile} onClose={onClose} /></div>
  </dialog>
}

export function ProjectTemplates({ value, onApply, disabled = false }: ProjectTemplatesProps) {
  const id = useId()
  const [preview, setPreview] = useState<ProjectTemplate | null>(null)
  return <section className="mb-10 border-y border-line py-8" aria-labelledby={`${id}-title`}>
    <h2 id={`${id}-title`} className="m-0 text-2xl font-medium tracking-[-0.035em]">Start with a layout</h2>
    <p className="mb-2 mt-3 max-w-2xl text-sm leading-relaxed text-ink-soft">Choose a starting point for your story. Preview the full page, then make the sections your own.</p>
    <p className="mb-6 mt-0 text-sm leading-relaxed text-ink-soft">Existing content is kept; templates add sections.</p>
    <div className="grid grid-cols-3 gap-5 max-[900px]:flex max-[900px]:snap-x max-[900px]:snap-mandatory max-[900px]:overflow-x-auto max-[900px]:pb-3">
      {projectTemplates.map((template) => <article key={template.id} className="flex min-w-0 flex-col border border-line p-4 max-[900px]:w-[min(78vw,20rem)] max-[900px]:shrink-0 max-[900px]:snap-start">
        <button type="button" className="cursor-pointer border-0 bg-transparent p-0 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-default disabled:opacity-50" aria-label={`Open ${template.name} preview`} disabled={disabled} onClick={() => setPreview(template)}><TemplateMiniature template={template} /></button>
        <h3 className="mb-2 mt-5 text-lg font-medium">{template.name}</h3>
        <p className="mb-5 mt-0 flex-1 text-sm leading-relaxed text-ink-soft">{template.description}</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={buttonClass} disabled={disabled} aria-label={`Preview ${template.name} template`} onClick={() => setPreview(template)}>Preview</button>
          <button type="button" className={primaryClass} disabled={disabled} aria-label={`Use ${template.name} template`} onClick={() => onApply(createTemplateSections(template))}>Use template</button>
        </div>
      </article>)}
    </div>
    {preview && <TemplatePreview template={preview} value={value} disabled={disabled} onApply={onApply} onClose={() => setPreview(null)} />}
  </section>
}
