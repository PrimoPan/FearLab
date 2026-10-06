import { useId, useState, type ReactNode } from 'react'
import type { ProjectSection } from '../../lib/portal/types'
import { ImageUpload } from './ImageUpload'
import { RichTextEditor } from './RichTextEditor'
import { SortableItem, SortableList } from './SortableList'
import { buttonClass, fieldClass, labelClass } from './portalStyles'

type SectionEditorProps = {
  value: ProjectSection
  index: number
  onChange: (value: ProjectSection) => void
  onRemove: () => void
  onMove: (direction: -1 | 1) => void
  canMoveUp: boolean
  canMoveDown: boolean
  disabled?: boolean
  onBusyChange?: (busy: boolean) => void
  dragHandle?: ReactNode
}

function validLink(value: string) {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password } catch { return false }
}

export function SectionEditor({ value, index, onChange, onRemove, onMove, canMoveUp, canMoveDown, disabled = false, onBusyChange, dragHandle }: SectionEditorProps) {
  const id = useId()
  const [linkTouched, setLinkTouched] = useState(false)
  const invalidLink = linkTouched && Boolean(value.linkUrl) && !validLink(value.linkUrl)
  const change = (patch: Partial<ProjectSection>) => onChange({ ...value, ...patch })
  const imageIds = value.images.map((image, position) => image.id ?? `${value.id}-image-${image.url || 'empty'}-${position}`)
  function reorderImage(activeId: string, overId: string) {
    const from = imageIds.indexOf(activeId), to = imageIds.indexOf(overId)
    if (from < 0 || to < 0 || from === to) return
    const images = [...value.images]
    images.splice(to, 0, images.splice(from, 1)[0])
    change({ images })
  }
  function moveImage(index: number, direction: -1 | 1) {
    const images = [...value.images]
    ;[images[index], images[index + direction]] = [images[index + direction], images[index]]
    change({ images })
  }

  return (
    <section className="min-w-0 border-t border-line py-8" aria-labelledby={`${id}-title`}>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h3 id={`${id}-title`} className="m-0 text-xl font-medium">Section {index + 1}</h3>
        <div className="flex flex-wrap gap-2">
          {dragHandle}
          <button type="button" className={buttonClass} aria-label={`Move section ${index + 1} up`} disabled={disabled || !canMoveUp} onClick={() => onMove(-1)}>↑ Up</button>
          <button type="button" className={buttonClass} aria-label={`Move section ${index + 1} down`} disabled={disabled || !canMoveDown} onClick={() => onMove(1)}>↓ Down</button>
          <button type="button" className={buttonClass} disabled={disabled} onClick={onRemove} aria-label={`Remove section ${index + 1}`}>Remove</button>
        </div>
      </div>
      <div className="grid grid-cols-[12rem_minmax(0,1fr)] gap-5 max-[700px]:grid-cols-1">
        <div>
          <label htmlFor={`${id}-layout`} className={labelClass}>Layout</label>
          <select id={`${id}-layout`} className={fieldClass} value={value.layout} disabled={disabled} onChange={(event) => change({ layout: event.target.value as ProjectSection['layout'] })}>
            <option value="text">Text only</option><option value="image-left">Image left</option><option value="image-right">Image right</option><option value="gallery">Image gallery</option>
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-heading`} className={labelClass}>Section heading</label>
          <input id={`${id}-heading`} className={fieldClass} value={value.heading} maxLength={300} disabled={disabled} onChange={(event) => change({ heading: event.target.value })} />
        </div>
      </div>
      <div className="mt-6"><RichTextEditor value={value.body} onChange={(body) => change({ body })} label={`Section ${index + 1} text`} disabled={disabled} /></div>
      {value.layout !== 'text' && (
        <div className="mt-7 space-y-7">
          <SortableList ids={imageIds} onReorder={reorderImage} disabled={disabled || value.images.length < 2}>
          {value.images.map((image, imageIndex) => (
            <SortableItem key={imageIds[imageIndex]} id={imageIds[imageIndex]} label={`image ${imageIndex + 1} in section ${index + 1}`} disabled={disabled || value.images.length < 2}>
            {(handle) => <div className="border-t border-line py-6">
              <div className="mb-4 flex flex-wrap gap-2">
                {value.images.length > 1 && <>
                  {handle}
                  <button type="button" className={buttonClass} disabled={disabled || imageIndex === 0} onClick={() => moveImage(imageIndex, -1)} aria-label={`Move image ${imageIndex + 1} up in section ${index + 1}`}>↑ Up</button>
                  <button type="button" className={buttonClass} disabled={disabled || imageIndex === value.images.length - 1} onClick={() => moveImage(imageIndex, 1)} aria-label={`Move image ${imageIndex + 1} down in section ${index + 1}`}>↓ Down</button>
                </>}
                <button type="button" className={buttonClass} disabled={disabled} onClick={() => change({ images: value.images.filter((_, position) => position !== imageIndex) })} aria-label={`Remove image ${imageIndex + 1} from section ${index + 1}`}>Remove image</button>
              </div>
              <ImageUpload value={image} label={`Section ${index + 1} image ${imageIndex + 1}`} disabled={disabled} onBusyChange={onBusyChange} onChange={(next) => change({ images: value.images.map((item, position) => position === imageIndex ? next : item) })} />
            </div>}
            </SortableItem>
          ))}
          </SortableList>
          {(value.layout === 'gallery' || value.images.length === 0) && <button type="button" className={buttonClass} disabled={disabled || value.images.length >= 8} onClick={() => change({ images: [...value.images, { id: crypto.randomUUID(), url: '', alt: '', caption: '' }] })}>Add image{value.layout === 'gallery' ? ` (${value.images.length}/8)` : ''}</button>}
          {value.layout !== 'gallery' && value.images.length > 1 && <p className="m-0 text-sm text-ink-soft">Images are stacked in this layout. Choose Image gallery to arrange them side by side.</p>}
        </div>
      )}
      <div className="mt-7 grid grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-5 max-[700px]:grid-cols-1">
        <div>
          <label htmlFor={`${id}-link-label`} className={labelClass}>Link label (optional)</label>
          <input id={`${id}-link-label`} className={fieldClass} value={value.linkLabel} maxLength={200} disabled={disabled} onChange={(event) => change({ linkLabel: event.target.value })} />
        </div>
        <div>
          <label htmlFor={`${id}-link-url`} className={labelClass}>Link URL (optional)</label>
          <input id={`${id}-link-url`} className={fieldClass} type="url" placeholder="https://" value={value.linkUrl} maxLength={2000} disabled={disabled} onChange={(event) => change({ linkUrl: event.target.value })} onBlur={() => setLinkTouched(true)} aria-invalid={invalidLink} aria-describedby={invalidLink ? `${id}-link-error` : undefined} />
          {invalidLink && <p id={`${id}-link-error`} className="mb-0 mt-2 text-sm text-accent" role="alert">Enter a complete http or https URL without a username or password.</p>}
        </div>
      </div>
    </section>
  )
}
