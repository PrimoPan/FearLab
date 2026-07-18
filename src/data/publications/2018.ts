import type { PublicationRecord } from './types'

export const publications2018 = [
  {
    id: 'immersive-interactive-technologies',
    title:
      'Immersive Interactive Technologies for Positive Change: A Scoping Review and Design Considerations',
    authors: ['Alexandra Kitson', 'Mirjana Prpa', 'Bernhard E. Riecke'],
    year: 2018,
    date: '3 August 2018',
    sortDate: '2018-08-03',
    kind: 'journal',
    venueTag: 'frontiers',
    venue: 'Frontiers in Psychology',
    articleUrl:
      'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2018.01354/full'
  },
  {
    id: 'attending-to-breath',
    title:
      'Attending to Breath: Exploring How the Cues in a Virtual Environment Guide the Attention to Breath and Shape the Quality of Experience to Support Mindfulness',
    authors: [
      'Mirjana Prpa',
      'Kıvanç Tatar',
      'Jules Françoise',
      'Bernhard E. Riecke',
      'Thecla Schiphorst',
      'Philippe Pasquier'
    ],
    year: 2018,
    date: '8 June 2018',
    sortDate: '2018-06-08',
    kind: 'conference',
    venueTag: 'dis',
    venue: 'Proceedings of the 2018 Designing Interactive Systems Conference',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3196709.3196765'
  },
  {
    id: 'respire-breath-away',
    title: 'Respire: A Breath Away from the Experience in Virtual Environment',
    authors: ['Mirjana Prpa', 'Thecla Schiphorst', 'Kıvanç Tatar', 'Philippe Pasquier'],
    year: 2018,
    date: '20 April 2018',
    sortDate: '2018-04-20',
    kind: 'conference',
    venueTag: 'chi-ea',
    venue:
      'Extended Abstracts of the 2018 CHI Conference on Human Factors in Computing Systems',
    articleUrl: 'https://dl.acm.org/doi/10.1145/3170427.3180282'
  }
] as const satisfies readonly PublicationRecord[]
