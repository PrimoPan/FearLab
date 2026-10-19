import primoId from '../../../../assets/People/id/Primo.jpeg'
import primoLife from '../../../../assets/Projects/phd/primo-mc2.jpg'
import { paragraphs, tidyWebsite } from '../helpers'
import type { PersonRecord } from '../types'

export const primoPan: PersonRecord = {
  slug: 'dongyijie-primo-pan',
  name: 'Dongyijie Primo Pan',
  positionLabel: 'PhD Student',
  groupKey: 'phd',
  directoryOrder: 1,
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
    'Dongyijie Primo Pan holding an EEG cap beside a monitor displaying brainwave recordings in the laboratory.',
  detailLayout: 'split',
  storySide: 'left',
  photoPositionDesktop: '50% 50%',
  photoPositionMobile: '50% 50%',
  introductionFirst: true
}
