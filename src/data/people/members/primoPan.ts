import primoId from '../../../../assets/People/id/Primo.jpeg'
import primoLife from '../../../../assets/People/photos/life/Primo-2026.jpg'
import { paragraphs, tidyWebsite } from '../helpers'
import type { PersonRecord } from '../types'

export const primoPan: PersonRecord = {
  slug: 'dongyijie-primo-pan',
  name: 'Dongyijie Primo Pan',
  positionLabel: 'MPhil Student',
  groupKey: 'mphil',
  website: tidyWebsite('https://primopan.github.io/about/'),
  emails: ['dpan750@connect.hkust-gz.edu.cn'],
  researchInterest: 'Well-Being, Mental Health, Education',
  bioParagraphs: paragraphs(
    `I am a Human-Computer Interaction researcher whose previous work has focused on
    AI-mediated support systems for real-world human needs. My research has explored
    how interactive technologies can assist people in learning, communication, health
    management, and social experience across diverse contexts. In particular, I have
    worked on projects involving LLMs in competitive programming communities,
    AI-supported educational tools for autistic children, AI-based standardized
    patients for medical learning, and chatbot-supported multimodal health tracking.

    Across these projects, I have been broadly interested in designing intelligent
    systems that do more than generate content or automate tasks. Instead, I study how
    such systems can support reflection, guidance, decision-making, and long-term
    behavioral change in everyday life. Beyond these areas, I am also interested in the
    digital preservation of Chinese Huaiyang culture and intangible cultural heritage.

    Looking ahead, I hope to further investigate the potential of Cognitive Behavioral
    Therapy in HCI, especially for supporting both physical and mental health. In
    particular, I am interested in CBT-informed interactive systems for metabolic
    health, lifestyle regulation, and everyday psychological wellbeing.`
  ),
  idPhoto: primoId,
  lifePhoto: primoLife,
  lifePhotoAlt:
    'Dongyijie Primo Pan standing beneath the Communication University of China emblem.',
  storySide: 'left',
  photoContain: true,
  photoPositionDesktop: '68% 48%',
  photoPositionMobile: '64% 50%',
  photoBrightness: 1.05,
  backdropBrightness: 0.9,
  desktopPanelWidth: '34rem',
  desktopCopyWidth: '32rem',
  photoScaleStartDesktop: 1.04,
  photoScaleEndDesktop: 1.08,
  photoScaleStartMobile: 1.01,
  photoScaleEndMobile: 1.05
}
