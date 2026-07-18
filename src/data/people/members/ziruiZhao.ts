import ziruiId from '../../../../assets/People/id/Zirui.jpg'
import ziruiLife from '../../../../assets/People/photos/life/Zirui.jpg'
import { paragraphs, tidyWebsite } from '../helpers'
import type { PersonRecord } from '../types'

export const ziruiZhao: PersonRecord = {
  slug: 'zirui-zhao',
  name: 'Zirui Zhao',
  positionLabel: 'Research Assistant',
  groupKey: 'ra',
  website: tidyWebsite('https://zhao0424.github.io/CV/'),
  emails: ['zzrsnow@outlook.com'],
  researchInterest: 'HCI, XR, Affective Computing, Multimodal Interaction',
  bioParagraphs: paragraphs(
    `Hi, I’m Zirui Zhao. My research sits at the intersection of HCI and XR, with a
    focus on multimodal interaction (speech, text, behavior, and environmental signals)
    and affective computing (emotion sensing and emotion-adaptive feedback). I’m
    interested in using virtual environments as a medium for both data analytics and
    storytelling: designing data-driven visualization, sonification, and interaction
    mechanics to support sensemaking, while studying how multi-agent systems and social
    influence in virtual communities shape attitudes, decisions, and wellbeing. I have
    publications and submissions on multimodal emotion perception for VR dialogue,
    constrained generative NPCs for narrative worlds, and the psychological impact of
    VR restorative environments.`
  ),
  idPhoto: ziruiId,
  lifePhoto: ziruiLife,
  lifePhotoAlt: 'Zirui Zhao in a night scene with illuminated structures behind him.',
  storySide: 'right',
  photoPositionDesktop: '34% 24%',
  photoPositionMobile: '40% 18%',
  photoBrightness: 1.18,
  backdropBrightness: 0.98
}
