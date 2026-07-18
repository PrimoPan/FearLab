import type { PublicationRecord } from './types'

export const publications2022 = [
  {
    id: 'extended-reality-high-fidelity-learning',
    title: 'Extended Reality: Meeting the Promise of Real-Time High Fidelity Learning Environments',
    authors: [
      'Anthony Estey',
      'Derek Jacoby',
      'Yvonne Coady',
      'Rachel Ralph',
      'Mirjana Prpa',
      'Marc-Antoine Drouin',
      'Frank Maurer'
    ],
    year: 2022,
    date: '28 September 2022',
    sortDate: '2022-09-28',
    kind: 'conference',
    venueTag: 'mobilehci',
    venue:
      'Adjunct Publication of the 24th International Conference on Human-Computer Interaction with Mobile Devices and Services',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3528575.3551428'
  }
] as const satisfies readonly PublicationRecord[]
