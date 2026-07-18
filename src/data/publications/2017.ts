import type { PublicationRecord } from './types'

export const publications2017 = [
  {
    id: 'pulse-breath-water-system',
    title:
      'The Pulse Breath Water System: Exploring Breathing as an Embodied Interaction for Enhancing the Affective Potential of Virtual Reality',
    authors: ['Mirjana Prpa', 'Kıvanç Tatar', 'Bernhard E. Riecke', 'Philippe Pasquier'],
    year: 2017,
    date: '14 May 2017',
    sortDate: '2017-05-14',
    kind: 'conference',
    venueTag: 'vamr',
    venue: 'International Conference on Virtual, Augmented and Mixed Reality',
    articleUrl: 'https://link.springer.com/chapter/10.1007/978-3-319-57987-0_13'
  }
] as const satisfies readonly PublicationRecord[]
