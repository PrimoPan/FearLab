import prpaId from '../../../../assets/People/id/prpa.jpg'
import prpaLife from '../../../../assets/People/photos/life/Prpa.jpeg'
import { paragraphs, tidyWebsite } from '../helpers'
import type { PersonRecord } from '../types'

export const mirjanaPrpa: PersonRecord = {
  slug: 'mirjana-prpa',
  name: 'Mirjana Prpa',
  positionLabel: 'Founder · Assistant Professor',
  groupKey: 'faculty',
  website: tidyWebsite('https://www.linkedin.com/in/mirjanaprpa/'),
  emails: ['mirjanaprpa@hkust-gz.edu.cn'],
  researchInterest: 'HCI, Embodied AI, Human-AI interaction',
  bioParagraphs: paragraphs(
    `Dr. Mirjana Prpa is an Assistant Professor in the Computational Media and Arts
    (CMA) Thrust, Information Hub at the Hong Kong University of Science and
    Technology (Guangzhou), and an Adjunct Assistant Professor at Simon Fraser
    University (Canada). She is a founder of FEAR Lab.

    Her research is positioned at the intersection of Artificial Intelligence (AI),
    Human-Computer Interaction (HCI), and Extended Reality (XR), with a strong
    emphasis on experiential, human-centered, and interdisciplinary approaches to
    technology design. She investigates how intelligent systems can be designed and
    evaluated to better support human experience, creativity, and collaboration,
    particularly in health, well-being, and education contexts.`
  ),
  idPhoto: prpaId,
  lifePhoto: prpaLife,
  lifePhotoAlt: 'Mirjana Prpa photographing an installation.',
  storySide: 'left',
  photoPositionDesktop: '80% 38%',
  photoPositionMobile: '74% 34%',
  photoBrightness: 1.05,
  backdropBrightness: 0.9,
  desktopPanelWidth: '34.5rem',
  desktopCopyWidth: '32.75rem',
  photoScaleStart: 1.02,
  photoScaleEnd: 1.06
}
