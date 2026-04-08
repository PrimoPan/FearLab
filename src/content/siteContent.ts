export type NavItem = {
  label: string
  to: string
  featuredLabel?: string
  isFeatured?: boolean
}

export type ConstructionPageContent = {
  kicker: string
  headline: string
  body: string
  bullets: readonly string[]
}

export type AcceptedPaper = {
  title: string
  track: string
  date: string
  time: string
  room: string
}

export type Workshop = {
  title: string
}

export const navItems: readonly NavItem[] = [
  { label: 'Home', to: '/' },
  {
    label: 'News',
    to: '/news',
    featuredLabel: "Meet US at CHI'26!",
    isFeatured: true
  },
  { label: 'Project', to: '/projects' },
  { label: 'Publication', to: '/publications' },
  { label: 'People', to: '/people' },
  { label: 'Contact', to: '/contact' }
]

export const homeFocusPoints = [
  'Research at the intersection of AI, HCI, and XR through experiential, human-centered, and interdisciplinary technology design.',
  'Embodied, immersive, and AI-driven systems for health, well-being, and education.',
  'User experience methods, interactive systems, and human-AI collaboration through synthetic data and situated technologies.'
] as const

export const constructionCopy: Record<'projects' | 'publications' | 'contact', ConstructionPageContent> = {
  projects: {
    kicker: 'Project',
    headline: 'Projects are under construction.',
    body:
      'A curated view of lab systems, prototypes, and collaborations is being assembled.',
    bullets: [
      'Selected systems and prototypes will be documented here.',
      'Project pages will collect media, context, and research outcomes.',
      'The current site remains a live construction preview.'
    ]
  },
  publications: {
    kicker: 'Publication',
    headline: 'Publications are under construction.',
    body:
      'The publications archive will connect papers, awards, and ongoing submissions.',
    bullets: [
      'Peer-reviewed papers and preprints will appear here.',
      'Each publication entry will link to artifacts, videos, and abstracts.',
      'The archive is being prepared in the same visual language as the site.'
    ]
  },
  contact: {
    kicker: 'Contact',
    headline: 'Contact is under construction.',
    body:
      'A dedicated contact page will open once the rest of the site structure is in place.',
    bullets: [
      'General lab contact details will live here.',
      'Prospective students and collaborators will find the right entry point.',
      'For now, the site is focused on the initial public launch.'
    ]
  }
}

export const newsMoments = [
  'Fresh FEAR Lab work is heading into the CHI 2026 conversation.',
  'If you will be at CHI too, come meet the lab and say hello.'
] as const

export const chiAcceptedPapers: readonly AcceptedPaper[] = [
  {
    title:
      'LLM-based Embodied Conversational Agent for Reducing Foreign Language Speaking Anxiety in Social VR',
    track: 'Social VR',
    date: 'Tue, 14 Apr',
    time: '11:15 - 12:45',
    room: 'Room 122'
  },
  {
    title:
      'Quantifying Latencies: A Conversation Analysis Approach to Human-Agent Interactions in Virtual Reality',
    track: 'AI & Timing Matters',
    date: 'Mon, 13 Apr',
    time: '11:15 - 12:45',
    room: 'Room 129'
  }
]

export const chiWorkshops: readonly Workshop[] = [
  {
    title:
      'Where is the Body in Designing (Through) AI? Frictions and Opportunities in Integrating AI with Soma Design'
  },
  {
    title:
      'From Generation to Simulation: Responsible Use of AI Personas in Human-Centered Design and Research'
  }
]
