export type PublicationVenueTone =
  | 'amber'
  | 'blue'
  | 'coral'
  | 'cyan'
  | 'green'
  | 'slate'
  | 'violet'

export type PublicationVenueTag = {
  label: string
  tone: PublicationVenueTone
}

export const publicationVenueTags = {
  sap: { label: 'SAP', tone: 'violet' },
  isea: { label: 'ISEA', tone: 'violet' },
  mindcare: { label: 'MindCare', tone: 'green' },
  mindfulness: { label: 'Mindfulness', tone: 'green' },
  vamr: { label: 'VAMR', tone: 'cyan' },
  chi: { label: 'CHI', tone: 'coral' },
  'chi-ea': { label: 'CHI EA', tone: 'coral' },
  'c-and-c': { label: 'C&C', tone: 'violet' },
  dis: { label: 'DIS', tone: 'cyan' },
  frontiers: { label: 'Frontiers', tone: 'amber' },
  'book-chapter': { label: 'Book chapter', tone: 'slate' },
  'dis-workshop': { label: 'DIS Workshop', tone: 'cyan' },
  leonardo: { label: 'Leonardo', tone: 'violet' },
  dissertation: { label: 'Dissertation', tone: 'slate' },
  mobilehci: { label: 'MobileHCI', tone: 'blue' },
  preprint: { label: 'Preprint', tone: 'slate' },
  interspeech: { label: 'INTERSPEECH', tone: 'amber' },
  cscw: { label: 'CSCW', tone: 'violet' },
  sigcse: { label: 'SIGCSE TS', tone: 'blue' },
  'ieee-vr': { label: 'IEEE VR', tone: 'blue' },
  'ieee-cai': { label: 'IEEE CAI', tone: 'blue' }
} as const satisfies Record<string, PublicationVenueTag>

export type PublicationVenueKey = keyof typeof publicationVenueTags
