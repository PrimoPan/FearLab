import { useRef, useState, type FormEvent } from 'react'
import { api } from '../../../lib/portal/api'
import { biographyParagraphs, emailList, emptyRegistration, readRegistrationImage, validateRegistration, type RegistrationErrors, type RegistrationFields } from './registrationForm'

type RegistrationReceipt = { id: string; status: 'pending'; username: string }

export function useRegistration() {
  const [fields, setFields] = useState<RegistrationFields>(emptyRegistration)
  const [portrait, setPortrait] = useState<File | null>(null)
  const [lifePhoto, setLifePhoto] = useState<File | null>(null)
  const [errors, setErrors] = useState<RegistrationErrors>({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [receipt, setReceipt] = useState<RegistrationReceipt | null>(null)
  const pending = useRef(false)
  const errorSummary = useRef<HTMLDivElement>(null)
  const dirty = !receipt && (Boolean(portrait || lifePhoto) || Object.entries(fields).some(([key, value]) => value !== emptyRegistration[key as keyof RegistrationFields]))

  function setField<K extends keyof RegistrationFields>(name: K, value: RegistrationFields[K]) {
    setFields(current => ({ ...current, [name]: value }))
    setErrors(current => ({ ...current, [name]: undefined }))
  }
  function setPhoto(name: 'portrait' | 'lifePhoto', file: File | null) {
    if (name === 'portrait') setPortrait(file)
    else setLifePhoto(file)
    setErrors(current => ({ ...current, [name]: undefined }))
  }
  function setPhotoError(name: 'portrait' | 'lifePhoto', message: string) {
    setErrors(current => ({ ...current, [name]: message }))
  }
  function focusSummary() { requestAnimationFrame(() => errorSummary.current?.focus()) }

  async function submit(event: FormEvent) {
    event.preventDefault()
    if (pending.current || receipt) return
    setError('')
    const problems = validateRegistration(fields, portrait, lifePhoto)
    // Decoding errors belong to the selected file and stay until it is replaced.
    if (portrait && errors.portrait) problems.portrait = errors.portrait
    if (lifePhoto && errors.lifePhoto) problems.lifePhoto = errors.lifePhoto
    setErrors(problems)
    if (Object.keys(problems).length || !portrait || !lifePhoto) { focusSummary(); return }
    pending.current = true
    setBusy(true)
    try {
      const [portraitData, lifePhotoData] = await Promise.all([readRegistrationImage(portrait), readRegistrationImage(lifePhoto)])
      const response = await api<{ registration: RegistrationReceipt }>('/registrations', {
        method: 'POST', body: {
          username: fields.username.trim(), password: fields.password,
          profile: {
            name: fields.name.trim(), position: fields.position, emails: emailList(fields.emails),
            website: fields.website.trim(), researchInterest: fields.researchInterest.trim(),
            bioParagraphs: biographyParagraphs(fields.biography), lifePhotoAlt: fields.lifePhotoAlt.trim()
          }, portrait: portraitData, lifePhoto: lifePhotoData
        }
      })
      setReceipt(response.registration)
      setFields(current => ({ ...current, password: '', confirmPassword: '' }))
      setPortrait(null)
      setLifePhoto(null)
    } catch (problem) {
      setError(problem instanceof Error ? problem.message : 'Your application could not be submitted. Please try again.')
      focusSummary()
    } finally { pending.current = false; setBusy(false) }
  }

  return { fields, errors, error, busy, receipt, dirty, portrait, lifePhoto, errorSummary, setField, setPhoto, setPhotoError, submit }
}
