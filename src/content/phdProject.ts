import hero from '../../assets/Projects/phd/everyday-health-hero-interactive.png'
import music from '../../assets/Projects/phd/music-prototype.png'
import classroom from '../../assets/Projects/phd/vr-classroom.png'
import qilin from '../../assets/Projects/phd/vr-qilin.png'

export const cbtReviewUrl = 'https://www.researchgate.net/profile/Dongyijie-Pan/publication/414497858_From_Therapeutic_Practices_to_System_Responses_A_Scoping_Review_of_Interactive_Cognitive_Behavioural_Therapy/links/6aae4709756a0b12f4f2bafd/From-Therapeutic-Practices-to-System-Responses-A-Scoping-Review-of-Interactive-Cognitive-Behavioural-Therapy.pdf'

export const phdProject = {
  slug: 'cbt-informed-health',
  title: 'CBT-informed interactive health',
  subtitle: 'Interactive support for reflection, new perspectives and small steps in everyday health.',
  category: 'PhD research',
  leader: 'Dongyijie Primo Pan',
  hero,
  heroAlt: 'AI-generated concept of a woman journaling at home with a tabletop conversation robot, a smartwatch and a CGM sensor.',
  overview: 'Building on the review, this PhD programme explores how CBT-informed interaction can support mental and physical health in everyday life. It connects embodied experiences and personal health data with attention to what people do, how support is experienced and how its role unfolds over time.',
  neurodiversity: 'An ongoing direction explores CBT-informed support for neurodivergent children through musical and immersive experiences. The work considers different ways of participating, expressing experience and encountering supportive technology.',
  metabolicHealth: 'Continuous glucose monitoring (CGM) and other wearable health devices are a starting point for exploring multimodal health agents. This direction considers CBT-informed self-management in metabolic syndrome and polycystic ovary syndrome (PCOS), connecting everyday health information with personal experience.',
  tracking: 'Long-term health-tracking studies use autoethnography to examine how wearable data, everyday routines and conversational technologies become part of reflection and support over time. These first-person studies attend to the experience of living with health information.',
  media: { music, classroom, qilin }
} as const

export const reviewFoundation = {
  introduction: 'Our scoping review brings together 234 reports across human–computer interaction, psychology and clinical research. It examines how cognitive behavioral therapy (CBT) practices take shape through interaction, and what the reported evaluations can establish.',
  findings: [
    {
      title: 'The practice changes with the interaction.',
      text: 'The same CBT exercise can ask someone to generate an idea, assess a suggestion or work through it with another person.'
    },
    {
      title: 'Support involves shared responsibilities.',
      text: 'Design choices distribute interpretation, decisions and support differently among users, technologies and the people involved in care.'
    },
    {
      title: 'Programme outcomes leave questions open.',
      text: 'Evidence about a whole programme may not explain the contribution of an individual interaction within it.'
    }
  ],
  opportunity: 'This creates an opportunity to connect the detail of an interaction with the experience of using it in everyday life—and with evidence about change over time.'
} as const

export const projectMethods = [
  {
    number: '01',
    title: 'Cognitive behavioral therapy',
    text: 'A foundation for thinking about the relationships between thoughts, feelings, behavior and everyday health.'
  },
  {
    number: '02',
    title: 'Micro-phenomenology',
    text: 'A close look at particular moments of lived experience, bringing texture and context to what people notice and feel.'
  },
  {
    number: '03',
    title: 'Autoethnography',
    text: 'Situated, longitudinal reflection on how health, technology and personal routines unfold together.'
  }
] as const

type ProjectOutput = {
  category: string
  title: string
  description: string
  href?: string
  linkLabel?: string
}

export const projectOutputs: readonly ProjectOutput[] = [
  {
    category: 'Scoping review · Preprint',
    title: 'From therapeutic practices to system responses',
    description: 'A scoping review of interactive cognitive behavioural therapy.',
    href: cbtReviewUrl,
    linkLabel: 'Read on ResearchGate'
  },
  {
    category: 'Autoethnography · 2025',
    title: 'CGM-led multimodal tracking',
    description: 'An exploratory study of wearable health tracking and chatbot support in everyday life.',
    href: 'https://arxiv.org/abs/2510.25381',
    linkLabel: 'Read paper'
  },
  {
    category: 'Preprint · 2026',
    title: 'Long-term health tracking',
    description: 'An autoethnographic account of conversational technology within a personal support system.',
    href: 'https://arxiv.org/abs/2609.21925',
    linkLabel: 'Read preprint'
  }
]
