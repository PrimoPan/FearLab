import xingyuId from '../../../../assets/People/id/Xingyu.jpg'
import xingyuLife from '../../../../assets/People/photos/life/Xingyu.jpg'
import { paragraphs, tidyWebsite } from '../helpers'
import type { PersonRecord } from '../types'

export const xingyuGao: PersonRecord = {
  slug: 'xingyu-gao',
  name: 'Xingyu Gao',
  positionLabel: 'Research Assistant',
  groupKey: 'ra',
  website: tidyWebsite('https://xingyugao-dudu.github.io/index.html'),
  emails: ['1165263972@qq.com', 'xingyugao@hkust-gz.edu.cn'],
  researchInterest: [
    'HCI focused on multimodal interaction in interactive systems, with applications',
    'in wearable devices, immersive environments, and game-based experiences for',
    'accessibility and wellbeing.'
  ].join(' '),
  bioParagraphs: paragraphs(
    `I design and prototype interactive experiences using Unity, Arduino, and machine
    learning tools. My work combines technical implementation with design thinking,
    with experience in VR/AR, game development, and physical computing. I have worked
    on projects involving multimodal interaction and accessibility, translating ideas
    into functional prototypes.`
  ),
  idPhoto: xingyuId,
  lifePhoto: xingyuLife,
  lifePhotoAlt: 'Xingyu Gao standing in front of an illuminated wall exhibit.',
  storySide: 'left',
  photoPositionDesktop: '94% 26%',
  photoPositionMobile: '64% 22%',
  photoBrightness: 1.05,
  backdropBrightness: 0.9,
  desktopPanelShift: '-5rem',
  photoScaleStart: 0.94,
  photoScaleEnd: 0.98
}
