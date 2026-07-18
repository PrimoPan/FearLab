import type { PublicationRecord } from './types'

export const publications2016 = [
  {
    id: 'sonic-cradle',
    title:
      'Sonic Cradle—Immersive Interaction Design Combining Breathing and Neurofeedback to Foster Focused Attention Meditation on Breath',
    authors: [
      'Mirjana Prpa',
      'Denise Quesnel',
      'Alexandra Kitson',
      'Karen Cochrane',
      'Jay Vidyarthi',
      'Bernhard E. Riecke'
    ],
    year: 2016,
    date: '2016',
    sortDate: '2016-01-01',
    kind: 'conference',
    venueTag: 'mindfulness',
    venue: '2nd International Conference on Mindfulness',
    articleUrl:
      'https://www.researchgate.net/publication/301888217_Sonic_Cradle_-_Immersive_interaction_design_combining_breathing-_and_neurofeedback_to_foster_focused_attention_meditation_on_breath'
  }
] as const satisfies readonly PublicationRecord[]
