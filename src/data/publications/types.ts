import type { PublicationVenueKey } from '../publicationVenues'

export type PublicationKind =
  | 'book-chapter'
  | 'conference'
  | 'journal'
  | 'preprint'
  | 'thesis'

export type PublicationRecognition = {
  kind: 'award' | 'nomination'
  label: string
}

export type PublicationRecord = {
  id: string
  title: string
  authors: readonly string[]
  year: number
  date: string
  sortDate: string
  kind: PublicationKind
  venueTag: PublicationVenueKey
  venue: string
  articleUrl: string
  recognitions?: readonly PublicationRecognition[]
}
