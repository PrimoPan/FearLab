import type { PublicationRecord } from './types'

export const publications2014 = [
  {
    id: 'stereo-projection-vection',
    title:
      'Comparing the Effectiveness of Stereo Projection Versus 3D TV in Inducing Self-Motion Illusions (Vection)',
    authors: [
      'Jacqueline D. Jordan',
      'Mirjana Prpa',
      'Daniel Feuereissen',
      'Bernhard E. Riecke'
    ],
    year: 2014,
    date: '8 August 2014',
    sortDate: '2014-08-08',
    kind: 'conference',
    venueTag: 'sap',
    venue: 'Proceedings of the ACM Symposium on Applied Perception',
    articleUrl: 'https://dl.acm.org/doi/10.1145/2628257.2628360'
  }
] as const satisfies readonly PublicationRecord[]
