export type RegistrationReview = {
  id: string
  username: string
  status: 'pending' | 'approved' | 'rejected'
  version: number
  profile: {
    name: string
    position: 'phd' | 'mphil' | 'ra'
    emails: string[]
    website: string
    researchInterest: string
    bioParagraphs: string[]
    idPhoto: string
    lifePhoto: string
    lifePhotoAlt: string
  }
  feedback: string
  createdAt: string
  reviewedAt: string | null
}
export const positionLabels = { phd: 'PhD', mphil: 'MPhil', ra: 'RA' }
