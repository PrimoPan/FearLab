import euphieId from '../../../../assets/People/id/ID-Yang.jpeg'
import euphieLife from '../../../../assets/People/photos/life/lief-Yang.jpeg'
import { paragraphs, tidyWebsite } from '../helpers'
import type { PersonRecord } from '../types'

export const euphieYang: PersonRecord = {
  slug: 'euphie-yang',
  name: 'Euphie Yang',
  positionLabel: 'Research Intern',
  groupKey: 'intern',
  website: tidyWebsite('euphyang.com'),
  emails: ['hey004@ucsd.edu'],
  researchInterest: 'Distributed cognition, Learning systems, Interactions design',
  bioParagraphs: paragraphs(
    `I am a research-driven interface designer working across cognitive science,
    human–AI interaction, and learning systems. Drawing from behavioral research and
    interaction design, I create systems that help people organize knowledge,
    externalize thought, and build understanding through interaction.

    My recent projects explore learning across different contexts: how students
    organize knowledge, how designers enter unfamiliar tools, and how children might
    learn through immersive environments. In Malleable Note Interface, I designed an
    AI-supported workflow that helps students transform scattered course materials,
    notes, handwriting, and files into flexible visual knowledge structures.

    In a Blender onboarding redesign, I studied how designers navigate complex 3D
    interfaces and helped design embedded guidance tools inside the software. At UCSD
    Design Lab, I designed a crafting-system interface for a climate-focused Unreal
    Engine game, connecting interface states with gameplay logic.

    I recently joined FEAR Lab as an intern, where I am excited to contribute to
    AI-supported learning, multi-agent learning platforms, and projects exploring how
    AI can learn from unique knowledge holders such as older adults.`
  ),
  idPhoto: euphieId,
  lifePhoto: euphieLife,
  lifePhotoAlt: 'Euphie Yang posing beside a yellow public art installation.',
  storySide: 'left',
  photoPositionDesktop: '62% 58%',
  photoPositionMobile: '64% 56%',
  photoBrightness: 1.05,
  backdropBrightness: 0.9,
  photoScaleStart: 1,
  photoScaleEnd: 1.04
}
