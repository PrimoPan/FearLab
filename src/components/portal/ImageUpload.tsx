import { useEffect, useId, useRef, useState, type ChangeEvent } from 'react'
import { uploadImage } from '../../lib/portal/api'
import type { ProjectImage } from '../../lib/portal/types'
import { fieldClass, labelClass } from './portalStyles'

type ImageUploadProps = {
  value: ProjectImage
  onChange: (value: ProjectImage) => void
  label: string
  disabled?: boolean
  showCaption?: boolean
  altMaxLength?: number
  onBusyChange?: (busy: boolean) => void
}

export function ImageUpload({ value, onChange, label, disabled = false, showCaption = true, altMaxLength = 500, onBusyChange }: ImageUploadProps) {
  const id = useId()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const mounted = useRef(true)
  const valueRef = useRef(value)
  valueRef.current = value
  const locked = disabled || uploading

  useEffect(() => { mounted.current = true; return () => { mounted.current = false } }, [])
  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview) }, [preview])

  async function chooseImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ''
    if (!file) return
    setError('')
    setPreview(URL.createObjectURL(file))
    setUploading(true)
    onBusyChange?.(true)
    try {
      const url = await uploadImage(file)
      if (mounted.current) onChange({ ...valueRef.current, url })
    } catch (cause) {
      if (mounted.current) setError(cause instanceof Error ? cause.message : 'Image upload failed. Please try again.')
    } finally {
      if (mounted.current) { setUploading(false); setPreview(null) }
      onBusyChange?.(false)
    }
  }

  return (
    <div className="min-w-0 space-y-4" aria-busy={uploading}>
      <div>
        <label htmlFor={`${id}-file`} className={labelClass}>{label}</label>
        <input id={`${id}-file`} className={`${fieldClass} file:mr-3 file:border-0 file:bg-accent file:px-3 file:py-2 file:font-sans file:text-sm file:text-[var(--bg)]`} type="file" accept="image/jpeg,image/png,image/webp" disabled={locked} onChange={chooseImage} aria-describedby={`${id}-help${error ? ` ${id}-error` : ''}`} />
        <p id={`${id}-help`} className="mb-0 mt-2 text-xs text-ink-soft">JPEG, PNG or WebP · Up to 8 MB. {value.url ? 'Choose a file to replace this image.' : ''}</p>
        {uploading && <p className="mb-0 mt-2 text-sm text-accent" role="status">Uploading image…</p>}
        {error && <p id={`${id}-error`} className="mb-0 mt-2 text-sm text-accent" role="alert">{error}</p>}
      </div>
      {(preview || value.url) && (
        <div className="aspect-video w-full max-w-[28rem] overflow-hidden bg-site">
          <img src={preview || value.url} className="h-full w-full object-contain" alt={value.alt || `${label} preview`} />
        </div>
      )}
      <div>
        <label htmlFor={`${id}-alt`} className={labelClass}>{label} description (alt text)</label>
        <input id={`${id}-alt`} className={fieldClass} value={value.alt} maxLength={altMaxLength} disabled={locked} onChange={(event) => onChange({ ...value, alt: event.target.value })} aria-describedby={`${id}-alt-help`} />
        <p id={`${id}-alt-help`} className="mb-0 mt-2 text-xs text-ink-soft">Describe the image for readers using screen readers.</p>
      </div>
      {showCaption && <div>
        <label htmlFor={`${id}-caption`} className={labelClass}>{label} caption</label>
        <input id={`${id}-caption`} className={fieldClass} value={value.caption} maxLength={1000} disabled={locked} onChange={(event) => onChange({ ...value, caption: event.target.value })} />
      </div>}
    </div>
  )
}
