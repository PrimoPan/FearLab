import type { PublicationRecord } from './types'

export const publications2020 = [
  {
    id: 'attending-to-inner-self',
    title:
      'Attending to Inner Self: Designing and Unfolding Breath-Based VR Experiences Through Micro-Phenomenology',
    authors: ['Mirjana Prpa'],
    year: 2020,
    date: '17 August 2020',
    sortDate: '2020-08-17',
    kind: 'thesis',
    venueTag: 'dissertation',
    venue: 'Simon Fraser University',
    articleUrl: 'https://summit.sfu.ca/item/20693'
  },
  {
    id: 'articulating-experience',
    title:
      'Articulating Experience: Reflections from Experts Applying Micro-Phenomenology to Design Research in HCI',
    authors: ['Mirjana Prpa', 'Sarah Fdili-Alaoui', 'Thecla Schiphorst', 'Philippe Pasquier'],
    year: 2020,
    date: '21 April 2020',
    sortDate: '2020-04-21',
    kind: 'conference',
    venueTag: 'chi',
    venue: 'Proceedings of the 2020 CHI Conference on Human Factors in Computing Systems',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3313831.3376664',
    recognitions: [{ kind: 'award', label: 'CHI 2020 Best Paper Award' }]
  },
  {
    id: 'inhaling-and-exhaling',
    title: 'Inhaling and Exhaling: How Technologies Can Perceptually Extend Our Breath Awareness',
    authors: [
      'Mirjana Prpa',
      'Ekaterina R. Stepanova',
      'Thecla Schiphorst',
      'Bernhard E. Riecke',
      'Philippe Pasquier'
    ],
    year: 2020,
    date: '21 April 2020',
    sortDate: '2020-04-21',
    kind: 'conference',
    venueTag: 'chi',
    venue: 'Proceedings of the 2020 CHI Conference on Human Factors in Computing Systems',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3313831.3376183'
  }
] as const satisfies readonly PublicationRecord[]
