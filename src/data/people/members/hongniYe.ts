import hongniId from '../../../../assets/People/id/Hongni.jpeg'
import hongniLife from '../../../../assets/People/photos/life/Hongni.jpeg'
import { paragraphs, tidyWebsite } from '../helpers'
import type { PersonRecord } from '../types'

export const hongniYe: PersonRecord = {
  slug: 'hongni-ye',
  name: 'Hongni Ye',
  positionLabel: 'PhD Student',
  groupKey: 'phd',
  website: tidyWebsite('hongni.org'),
  emails: ['hye526@connect.hkust-gz.edu.cn'],
  researchInterest:
    'Tangible User Interfaces (TUI), Inclusive Design & Accessibility, Neurodiversity, Embodied Learning.',
  bioParagraphs: paragraphs(
    `Hongni (who also goes by Sabrina in English, Miele in Italian, and Vaporfish) is
    currently a PhD student whose research focuses on designing tangible user
    interfaces to create more inclusive learning environments for neurodivergent
    individuals. Before joining this research path, she earned her M.Sc. from
    Politecnico di Milano. There, she honed her skills in digital interaction design
    and creative prototyping, collaborating with avant-garde Italian designers and
    showcasing her work at Milan Design Week.

    As an empathy-driven researcher, Hongni is dedicated to marginalized and
    vulnerable communities. She believes that technology’s truest value lies in its
    ability to reveal the unseen and connect us to lives far different from our own.
    Her master’s thesis utilized a 360° VR experience to immerse users in the stark,
    unfiltered reality of life for Rohingya refugees.

    Guided by scholars like Robert Chapman and Sue Fletcher-Watson, she challenges
    politicized neuronormativity and pushes to shift the discourse toward the Normalcy
    Paradigm. Her dedication to this cause goes beyond creating academic artifacts;
    she is a highly active participant in local neurodiversity advocacy campaigns.
    When she isn't researching or advocating in the community, you can usually find
    her on the bouldering wall or practicing Vinyasa yoga.`
  ),
  idPhoto: hongniId,
  lifePhoto: hongniLife,
  lifePhotoAlt: 'Hongni Ye sitting on a riverside bench.',
  storySide: 'right',
  photoPositionDesktop: '42% 34%',
  photoPositionMobile: '56% 28%',
  photoBrightness: 1.05,
  backdropBrightness: 0.9
}
