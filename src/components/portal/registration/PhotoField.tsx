import { useEffect, useRef, useState } from 'react'
import { buttonClass } from '../portalStyles'
import { RegistrationField, fieldAccessibility } from './RegistrationField'
import { imageError } from './registrationForm'

export function PhotoField({ name, label, hint, file, error, onChange, onError }: {
  name: 'portrait' | 'lifePhoto'; label: string; hint: string; file: File | null; error?: string
  onChange: (file: File | null) => void; onError: (error: string) => void
}) {
  const [preview, setPreview] = useState('')
  const [selectionNotice, setSelectionNotice] = useState('')
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (!file) { setPreview(''); return }
    const url = URL.createObjectURL(file)
    setPreview(url)
    return () => URL.revokeObjectURL(url)
  }, [file])
  return <RegistrationField name={name} label={label} hint={hint} error={error}>
    <div className="mb-3 flex aspect-[4/3] items-center justify-center overflow-hidden border border-line bg-panel">
      {preview ? <img src={preview} alt={name === 'portrait' ? 'Selected portrait preview' : 'Selected life photo preview'} className="h-full w-full object-contain" onError={() => onError('This image could not be displayed. Choose another JPEG, PNG or WebP image.')} /> : <span className="px-6 text-center text-sm text-ink-soft">{name === 'portrait' ? 'Your profile portrait' : 'A moment beyond the lab'}</span>}
    </div>
    <div className="flex flex-wrap items-center gap-3">
      <button {...fieldAccessibility(name, error, true)} className={buttonClass} type="button" aria-label={name === 'portrait' ? 'Choose portrait photo' : 'Choose life photo'} onClick={() => input.current?.click()}>Choose photo</button>
      <span className="min-w-0 break-all text-sm text-ink-soft" aria-live="polite">{file ? file.name : 'No photo selected'}</span>
    </div>
    <input ref={input} hidden aria-hidden="true" tabIndex={-1} type="file" accept="image/jpeg,image/png,image/webp" onChange={event => {
      const selected = event.target.files?.[0]
      if (!selected) return
      const problem = imageError(selected)
      if (problem) {
        if (file) setSelectionNotice(`${problem} The previous photo remains selected.`)
        else onError(problem)
        event.target.value = ''
        return
      }
      setSelectionNotice('')
      onChange(selected)
    }} />
    {selectionNotice && <p role="status" className="mb-0 mt-3 text-sm leading-relaxed text-accent">{selectionNotice}</p>}
    {file && <button type="button" className={`${buttonClass} mt-3`} aria-label={name === 'portrait' ? 'Remove portrait photo' : 'Remove life photo'} onClick={() => { setSelectionNotice(''); onChange(null); if (input.current) input.current.value = '' }}>Remove photo</button>}
  </RegistrationField>
}
