import type { PersonRecord } from './types'

type PersonPresentation = Pick<PersonRecord,
  'storySide' | 'photoPositionDesktop' | 'photoPositionMobile' |
  'desktopPanelWidth' | 'desktopCopyWidth' | 'mobilePhotoAspectRatio' |
  'introductionFirst' | 'scrollableDesktopDetails' | 'photoMotion'
>

// Presentation only: approved profile text, photos and visibility stay with the API.
const presentations: Partial<Record<string, PersonPresentation>> = {
  'member-mandy': {
    storySide: 'left',
    photoPositionDesktop: '65% 65%',
    photoPositionMobile: '72% 50%',
    desktopPanelWidth: 'clamp(19rem, 39vw, 33rem)',
    desktopCopyWidth: '30rem',
    mobilePhotoAspectRatio: '4 / 5',
    introductionFirst: true,
    scrollableDesktopDetails: true,
    photoMotion: false
  }
}

export function applyPersonPresentation(person: PersonRecord): PersonRecord {
  const presentation = presentations[person.slug]
  return presentation ? { ...person, ...presentation } : person
}
