export type RegistrationFields = {
  username: string
  password: string
  confirmPassword: string
  name: string
  position: 'phd' | 'mphil' | 'ra'
  emails: string
  website: string
  researchInterest: string
  biography: string
  lifePhotoAlt: string
}

export type RegistrationErrors = Partial<Record<keyof RegistrationFields | 'portrait' | 'lifePhoto', string>>

export const emptyRegistration: RegistrationFields = {
  username: '', password: '', confirmPassword: '', name: '', position: 'phd',
  emails: '', website: '', researchInterest: '', biography: '', lifePhotoAlt: ''
}

export function emailList(value: string) {
  return value.split(/[,\n]/).map(email => email.trim()).filter(Boolean)
}

export function biographyParagraphs(value: string) {
  return value.trim().split(/\n\s*\n/).map(paragraph => paragraph.trim()).filter(Boolean)
}

export function imageError(file: File | null) {
  if (!file) return 'Choose a photo.'
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) return 'Choose a JPEG, PNG or WebP image.'
  if (file.size > 8 * 1024 * 1024) return 'Choose an image no larger than 8 MB.'
  if (!file.size) return 'This image is empty. Choose another file.'
  return ''
}

export function validateRegistration(fields: RegistrationFields, portrait: File | null, lifePhoto: File | null): RegistrationErrors {
  const errors: RegistrationErrors = {}
  if (!/^[a-zA-Z][a-zA-Z0-9_-]{2,39}$/.test(fields.username.trim())) errors.username = 'Start your username with a letter and use 3–40 letters, numbers, underscores or hyphens.'
  if (fields.password.length < 10 || fields.password.length > 128) errors.password = 'Choose a password with 10–128 characters.'
  if (fields.password !== fields.confirmPassword) errors.confirmPassword = 'The passwords do not match.'
  if (!fields.name.trim() || fields.name.trim().length > 120) errors.name = 'Enter your full name, up to 120 characters.'
  const emails = emailList(fields.emails)
  if (!emails.length || emails.length > 3 || new Set(emails.map(email => email.toLowerCase())).size !== emails.length || emails.some(email => email.length > 254 || !/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email))) errors.emails = 'Enter 1–3 different, valid email addresses, separated by commas or new lines.'
  if (fields.website.trim()) {
    try {
      const url = new URL(fields.website.trim())
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || fields.website.trim().length > 2000) throw new Error()
    } catch { errors.website = 'Enter a complete website URL beginning with https:// or http://, without a username or password.' }
  }
  if (!fields.researchInterest.trim() || fields.researchInterest.trim().length > 1000) errors.researchInterest = 'Describe your research interests in up to 1,000 characters.'
  if (!fields.biography.trim() || fields.biography.trim().length > 8000 || biographyParagraphs(fields.biography).length > 12) errors.biography = 'Add your biography in 1–12 paragraphs, up to 8,000 characters.'
  if (!fields.lifePhotoAlt.trim() || fields.lifePhotoAlt.trim().length > 300) errors.lifePhotoAlt = 'Describe your life photo in up to 300 characters.'
  const portraitError = imageError(portrait)
  const lifePhotoError = imageError(lifePhoto)
  if (portraitError) errors.portrait = portraitError
  if (lifePhotoError) errors.lifePhoto = lifePhotoError
  return errors
}

export function readRegistrationImage(file: File): Promise<{ name: string; data: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onerror = () => reject(new Error('A photo could not be read. Please choose it again.'))
    reader.onabort = () => reject(new Error('Reading the photo was interrupted. Please try again.'))
    reader.onload = () => resolve({ name: file.name, data: String(reader.result).split(',')[1] })
    reader.readAsDataURL(file)
  })
}
