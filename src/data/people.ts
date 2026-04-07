import hongniId from '../../assets/People/id/Hongni.jpeg'
import mengxuId from '../../assets/People/id/Mengxu.png'
import primoId from '../../assets/People/id/Primo.jpeg'
import qiyuanId from '../../assets/People/id/Qiyuan.jpg'
import xingyuId from '../../assets/People/id/Xingyu.jpg'
import ziruiId from '../../assets/People/id/Zirui.jpg'
import prpaId from '../../assets/People/id/prpa.jpg'

import hongniLife from '../../assets/People/photos/life/Hongni.jpeg'
import primoLife from '../../assets/People/photos/life/Primo-2026.jpg'
import qiyuanLife from '../../assets/People/photos/life/Qiyuan.jpg'
import xingyuLife from '../../assets/People/photos/life/Xingyu.jpg'
import ziruiLife from '../../assets/People/photos/life/Zirui.jpg'
import prpaLife from '../../assets/People/photos/life/Prpa.jpeg'

const mengxuLife = new URL('../../assets/People/photos/life/Mengxu.JPG', import.meta.url).href

export type PersonGroupKey = 'faculty' | 'phd' | 'mphil' | 'ra'
export type PersonStorySide = 'left' | 'right'

export type PersonRecord = {
  slug: string
  name: string
  positionLabel: string
  groupKey: PersonGroupKey
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

const roleOrder: PersonGroupKey[] = ['faculty', 'phd', 'mphil', 'ra']

const tidyWebsite = (value: string): string | undefined => {
  const trimmed = value.trim()

  if (!trimmed) {
    return undefined
  }

  const normalized = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`

  try {
    const url = new URL(normalized)

    if (url.hostname.includes('linkedin')) {
      url.protocol = 'https:'
      url.hostname = 'www.linkedin.com'
      url.search = ''
      url.hash = ''

      if (!url.pathname.startsWith('/in/')) {
        const path = url.pathname.replace(/^\/+/, '')
        url.pathname = path ? `/in/${path.replace(/^in\//, '')}` : '/in/'
      }
    }

    return url.toString()
  } catch {
    return normalized
  }
}

const paragraphs = (value: string): string[] =>
  value
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)

const peopleCatalog: PersonRecord[] = [
  {
    slug: 'mirjana-prpa',
    name: 'Mirjana Prpa',
    positionLabel: 'Founder · Assistant Professor',
    groupKey: 'faculty',
    website: tidyWebsite('https://www.linkedin.com/in/mirjanaprpa/'),
    emails: ['mirjanaprpa@hkust-gz.edu.cn'],
    researchInterest: 'HCI, Embodied AI, Human-AI interaction',
    bioParagraphs: paragraphs(
      `Dr. Mirjana Prpa is an Assistant Professor in the Computational Media and Arts (CMA) Thrust, Information Hub at the Hong Kong University of Science and Technology (Guangzhou), and an Adjunct Assistant Professor at Simon Fraser University (Canada). She is a founder of FEAR Lab.

Her research is positioned at the intersection of Artificial Intelligence (AI), Human-Computer Interaction (HCI), and Extended Reality (XR), with a strong emphasis on experiential, human-centered, and interdisciplinary approaches to technology design. She investigates how intelligent systems can be designed and evaluated to better support human experience, creativity, and collaboration, particularly in health, well-being, and education contexts.`
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
  },
  {
    slug: 'hongni-ye',
    name: 'Hongni Ye',
    positionLabel: 'PhD Student',
    groupKey: 'phd',
    website: tidyWebsite('hongni.org'),
    emails: ['hye526@connect.hkust-gz.edu.cn'],
    researchInterest:
      'Designing tangible interfaces that foster more inclusive learning environments for neurodivergent individuals.',
    bioParagraphs: paragraphs('To be added soon.'),
    idPhoto: hongniId,
    lifePhoto: hongniLife,
    lifePhotoAlt: 'Hongni Ye sitting on a riverside bench.',
    storySide: 'right',
    photoPositionDesktop: '42% 34%',
    photoPositionMobile: '56% 28%',
    photoBrightness: 1.05,
    backdropBrightness: 0.9
  },
  {
    slug: 'mengxu-pan',
    name: 'Mengxu Pan',
    positionLabel: 'PhD Student',
    groupKey: 'phd',
    website: tidyWebsite('www.linkedin.com/in/mengxupan'),
    emails: ['mpan108@connect.hkust-gz.edu.cn'],
    researchInterest: 'Agentic AI, Embodied Interaction, AI for Education',
    bioParagraphs: paragraphs(
      `I am a researcher working at the intersection of Agentic AI, embodied interaction, and AI for education, with a particular focus on how large language models can be integrated into immersive environments to support meaningful human learning experiences. My work explores how AI agents, when given a body, memory, and situated context in virtual or augmented spaces, can move beyond question-answer systems to become interactive partners in learning, communication, and exploration.

My recent project, Ellma-T, is a 3D AI tutor agent deployed in VRChat that uses large language models to sustain long, multi-turn, embodied interaction with learners. The system was shown not only to support language learning but also to reduce learners’ speaking anxiety. A paper describing this work is available at https://doi.org/10.1145/3715336.3735786, with two follow-up publications forthcoming at CHI 2026. A related work, the Persona-L project, exploring LLM-generated personas for people with Down syndrome, was recently accepted to DIS 2026.

Before transitioning into computer science, I taught classes in film and media arts in higher education and worked as a creative producer in the industry for five years. At FEAR Lab, I am excited to explore how future embodied and augmented realities can host intelligent agents that support learning, communication, and wellbeing in everyday life.`
    ),
    idPhoto: mengxuId,
    lifePhoto: mengxuLife,
    lifePhotoAlt: 'Mengxu Pan outdoors with a conference lanyard.',
    storySide: 'right',
    photoContain: true,
    photoPositionDesktop: '50% 50%',
    photoPositionMobile: '50% 50%',
    photoBrightness: 1.05,
    backdropBrightness: 0.9,
    desktopPanelShift: '2.25rem',
    photoScaleStart: 0.88,
    photoScaleEnd: 0.92
  },
  {
    slug: 'dongyijie-primo-pan',
    name: 'Dongyijie Primo Pan',
    positionLabel: 'MPhil Student',
    groupKey: 'mphil',
    website: tidyWebsite('https://primopan.github.io/about/'),
    emails: ['dpan750@connect.hkust-gz.edu.cn'],
    researchInterest: 'Well-Being, Mental Health, Education',
    bioParagraphs: paragraphs(
      `I am a Human-Computer Interaction researcher whose previous work has focused on AI-mediated support systems for real-world human needs. My research has explored how interactive technologies can assist people in learning, communication, health management, and social experience across diverse contexts. In particular, I have worked on projects involving LLMs in competitive programming communities, AI-supported educational tools for autistic children, AI-based standardized patients for medical learning, and chatbot-supported multimodal health tracking.

Across these projects, I have been broadly interested in designing intelligent systems that do more than generate content or automate tasks. Instead, I study how such systems can support reflection, guidance, decision-making, and long-term behavioral change in everyday life. Beyond these areas, I am also interested in the digital preservation of Chinese Huaiyang culture and intangible cultural heritage.

Looking ahead, I hope to further investigate the potential of Cognitive Behavioral Therapy in HCI, especially for supporting both physical and mental health. In particular, I am interested in CBT-informed interactive systems for metabolic health, lifestyle regulation, and everyday psychological wellbeing.`
    ),
    idPhoto: primoId,
    lifePhoto: primoLife,
    lifePhotoAlt: 'Dongyijie Primo Pan standing beneath the Communication University of China emblem.',
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
  },
  {
    slug: 'qiyuan-cheng',
    name: 'Qiyuan Cheng',
    positionLabel: 'Research Assistant',
    groupKey: 'ra',
    website: tidyWebsite(''),
    emails: ['chengqiyuan2024@gmail.com'],
    researchInterest: 'Aging, XR, Human-AI Interaction',
    bioParagraphs: paragraphs(
      'Qiyuan Cheng is a research assistant at FEAR Lab, HKUST (Guangzhou), under Dr. Mirjana Prpa. He holds an M.S. in Industrial Engineering (Human Factors) from the University of Illinois Urbana-Champaign, where he worked with Dr. Avinash Gupta and Dr. Wendy Rogers on VR-based engagement for older adults.'
    ),
    idPhoto: qiyuanId,
    lifePhoto: qiyuanLife,
    lifePhotoAlt: 'Qiyuan Cheng standing by the waterfront.',
    storySide: 'left',
    photoContain: true,
    photoPositionDesktop: '52% 24%',
    photoPositionMobile: '56% 18%',
    photoBrightness: 1.05,
    backdropBrightness: 0.9,
    photoScaleStart: 1,
    photoScaleEnd: 1.02
  },
  {
    slug: 'xingyu-gao',
    name: 'Xingyu Gao',
    positionLabel: 'Research Assistant',
    groupKey: 'ra',
    website: tidyWebsite('https://xingyugao-dudu.github.io/index.html'),
    emails: ['1165263972@qq.com', 'xingyugao@hkust-gz.edu.cn'],
    researchInterest:
      'HCI focused on multimodal interaction in interactive systems, with applications in wearable devices, immersive environments, and game-based experiences for accessibility and wellbeing.',
    bioParagraphs: paragraphs(
      'I design and prototype interactive experiences using Unity, Arduino, and machine learning tools. My work combines technical implementation with design thinking, with experience in VR/AR, game development, and physical computing. I have worked on projects involving multimodal interaction and accessibility, translating ideas into functional prototypes.'
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
  },
  {
    slug: 'zirui-zhao',
    name: 'Zirui Zhao',
    positionLabel: 'Research Assistant',
    groupKey: 'ra',
    website: tidyWebsite('https://zhao0424.github.io/CV/'),
    emails: ['zzrsnow@outlook.com'],
    researchInterest: 'HCI, XR, Affective Computing, Multimodal Interaction',
    bioParagraphs: paragraphs(
      'Hi, I’m Zirui Zhao. My research sits at the intersection of HCI and XR, with a focus on multimodal interaction (speech, text, behavior, and environmental signals) and affective computing (emotion sensing and emotion-adaptive feedback). I’m interested in using virtual environments as a medium for both data analytics and storytelling: designing data-driven visualization, sonification, and interaction mechanics to support sensemaking, while studying how multi-agent systems and social influence in virtual communities shape attitudes, decisions, and wellbeing. I have publications and submissions on multimodal emotion perception for VR dialogue, constrained generative NPCs for narrative worlds, and the psychological impact of VR restorative environments.'
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
]

export const people: PersonRecord[] = [...peopleCatalog].sort((left, right) => {
  const orderDelta = roleOrder.indexOf(left.groupKey) - roleOrder.indexOf(right.groupKey)

  if (orderDelta !== 0) {
    return orderDelta
  }

  return left.name.localeCompare(right.name)
})

export const peopleBySlug = Object.fromEntries(people.map((person) => [person.slug, person])) as Record<
  string,
  PersonRecord
>

export const peopleGroups: PersonGroup[] = roleOrder.map((key) => ({
  key,
  label:
    key === 'faculty'
      ? 'Faculty'
      : key === 'phd'
        ? 'PhD Students'
        : key === 'mphil'
          ? 'MPhil Students'
          : 'Research Assistants',
  people: people.filter((person) => person.groupKey === key)
}))
