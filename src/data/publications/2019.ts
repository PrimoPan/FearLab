import type { PublicationRecord } from './types'

export const publications2019 = [
  {
    id: 'respire-virtual-reality-art',
    title: 'Respire: Virtual Reality Art with Musical Agent Guided by Respiratory Interaction',
    authors: ['Kıvanç Tatar', 'Mirjana Prpa', 'Philippe Pasquier'],
    year: 2019,
    date: '1 December 2019',
    sortDate: '2019-12-01',
    kind: 'journal',
    venueTag: 'leonardo',
    venue: 'Leonardo Music Journal',
    articleUrl: 'https://direct.mit.edu/lmj/article/69852'
  },
  {
    id: 'micro-phenomenology-first-person-hci',
    title: 'Micro-Phenomenology in First Person HCI and Design Research',
    authors: ['Philippe Pasquier', 'Mirjana Prpa'],
    year: 2019,
    date: '2019',
    sortDate: '2019-01-01',
    kind: 'conference',
    venueTag: 'dis-workshop',
    venue: 'First-Person Research Methods in HCI Workshop, DIS 2019',
    articleUrl:
      'https://1stpersonresearch.wordpress.com/wp-content/uploads/2019/05/02-prpa.pdf'
  },
  {
    id: 'brain-computer-interfaces-art',
    title: 'Brain-Computer Interfaces in Contemporary Art: A State of the Art and Taxonomy',
    authors: ['Mirjana Prpa', 'Philippe Pasquier'],
    year: 2019,
    date: '26 May 2019',
    sortDate: '2019-05-26',
    kind: 'book-chapter',
    venueTag: 'book-chapter',
    venue: 'Brain Art: Brain-Computer Interfaces for Artistic Expression',
    articleUrl: 'https://link.springer.com/chapter/10.1007/978-3-030-14323-7_3'
  }
] as const satisfies readonly PublicationRecord[]
