import mengxuId from '../../../../assets/People/id/Mengxu.png'
import { paragraphs, tidyWebsite } from '../helpers'
import type { PersonRecord } from '../types'

const mengxuLife = new URL(
  '../../../../assets/People/photos/life/Mengxu.JPG',
  import.meta.url
).href

export const mengxuPan: PersonRecord = {
  slug: 'mengxu-pan',
  name: 'Mengxu Pan',
  positionLabel: 'PhD Student',
  groupKey: 'phd',
  website: tidyWebsite('www.linkedin.com/in/mengxupan'),
  emails: ['mpan108@connect.hkust-gz.edu.cn'],
  researchInterest: 'Agentic AI, Embodied Interaction, AI for Education',
  bioParagraphs: paragraphs(
    `I am a researcher working at the intersection of Agentic AI, embodied interaction,
    and AI for education, with a particular focus on how large language models can be
    integrated into immersive environments to support meaningful human learning
    experiences. My work explores how AI agents, when given a body, memory, and
    situated context in virtual or augmented spaces, can move beyond question-answer
    systems to become interactive partners in learning, communication, and exploration.

    My recent project, Ellma-T, is a 3D AI tutor agent deployed in VRChat that uses
    large language models to sustain long, multi-turn, embodied interaction with
    learners. The system was shown not only to support language learning but also to
    reduce learners’ speaking anxiety. A paper describing this work is available at
    https://doi.org/10.1145/3715336.3735786, with two follow-up publications forthcoming
    at CHI 2026. A related work, the Persona-L project, exploring LLM-generated personas
    for people with Down syndrome, was recently accepted to DIS 2026.

    Before transitioning into computer science, I taught classes in film and media arts
    in higher education and worked as a creative producer in the industry for five
    years. At FEAR Lab, I am excited to explore how future embodied and augmented
    realities can host intelligent agents that support learning, communication, and
    wellbeing in everyday life.`
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
}
