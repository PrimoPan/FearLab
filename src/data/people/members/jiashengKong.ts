import jiashengId from '../../../../assets/People/id/Jiasheng.webp'
import jiashengLife from '../../../../assets/People/photos/life/Jiasheng.webp'
import jiashengLifeMobile from '../../../../assets/People/photos/life/Jiasheng-960.webp'
import type { PersonRecord } from '../types'

export const jiashengKong: PersonRecord = {
  slug: 'jiasheng-kong',
  name: 'Jiasheng Kong',
  positionLabel: 'MPhil Student',
  groupKey: 'mphil',
  emails: [],
  researchInterest: 'Human–AI communication and emotional well-being',
  bioParagraphs: [
    'I’m an MPhil student at the Hong Kong University of Science and Technology (Guangzhou). I earned my bachelor’s degree in journalism at Northwest University. For me, journalism starts with the stories people tell and the feelings they share.',
    'I study how people communicate with AI when they seek emotional support. I’m interested in how trust develops in these conversations and in the ethics of offering support while leaving people in control of their own decisions.'
  ],
  idPhoto: jiashengId,
  lifePhoto: jiashengLife,
  lifePhotoMobile: jiashengLifeMobile,
  lifePhotoAlt: 'Jiasheng Kong adjusting a graduation cap in a classroom.',
  storySide: 'left',
  desktopLayout: 'split',
  photoPositionDesktop: '54% 0%',
  photoPositionMobile: '54% 0%',
  mobilePhotoAspectRatio: '4 / 3',
  photoBrightness: 1.16,
  photoMotion: false
}
