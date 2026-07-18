import type { PublicationRecord } from './types'

export const publications2015 = [
  {
    id: 'hacking-alternatives',
    title:
      'Hacking Alternatives in 21st Century: Designing a Bio-Responsive Virtual Environment for Stress Reduction',
    authors: ['Mirjana Prpa', 'Karen Anne Cochrane', 'Bernhard E. Riecke'],
    year: 2015,
    date: '24 September 2015',
    sortDate: '2015-09-24',
    kind: 'conference',
    venueTag: 'mindcare',
    venue: 'International Symposium on Pervasive Computing Paradigms for Mental Health',
    articleUrl: 'https://link.springer.com/chapter/10.1007/978-3-319-32270-4_4'
  },
  {
    id: 'state-scape',
    title: 'State.scape: A Brain as an Experience Generator',
    authors: ['Mirjana Prpa', 'Bernhard E. Riecke', 'Svetozar Miucin'],
    year: 2015,
    date: 'August 2015',
    sortDate: '2015-08-01',
    kind: 'conference',
    venueTag: 'isea',
    venue: 'Proceedings of the 21st International Symposium on Electronic Art',
    articleUrl:
      'https://www.isea-symposium-archives.org/presentation/state-scape-a-brain-as-an-experience-generator/'
  }
] as const satisfies readonly PublicationRecord[]
