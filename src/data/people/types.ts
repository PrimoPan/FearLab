export type PersonGroupKey = 'faculty' | 'phd' | 'mphil' | 'ra' | 'intern'

export type PersonStorySide = 'left' | 'right'

export type PersonRecord = {
  slug: string
  name: string
  positionLabel: string
  groupKey: PersonGroupKey
  directoryOrder?: number
  website?: string
  emails: string[]
  researchInterest: string
  bioParagraphs: string[]
  idPhoto: string
  lifePhoto: string
  lifePhotoAlt: string
  storySide: PersonStorySide
  photoPositionDesktop: string
  photoPositionMobile: string
  desktopPanelShift?: string
  photoContain?: boolean
  photoScaleStartDesktop?: number
  photoScaleEndDesktop?: number
  photoScaleStartMobile?: number
  photoScaleEndMobile?: number
  photoScaleStart?: number
  photoScaleEnd?: number
  photoBrightness?: number
  backdropBrightness?: number
  desktopPanelWidth?: string
  desktopCopyWidth?: string
}

export type PersonGroup = {
  key: PersonGroupKey
  label: string
  people: PersonRecord[]
}
