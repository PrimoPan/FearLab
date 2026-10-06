import hero from '../../../assets/Projects/phd/everyday-health-hero-interactive.png'
import music from '../../../assets/Projects/phd/music-prototype.png'
import classroom from '../../../assets/Projects/phd/vr-classroom.png'
import qilin from '../../../assets/Projects/phd/vr-qilin.png'
import { emptyDocument, newSection, type ProjectMaterial, type ProjectSection, type RichText } from './types'

type TemplateSection = Pick<ProjectSection, 'heading' | 'layout'> & { sample: string }
export type ProjectTemplate = { id: string; name: string; description: string; sections: readonly TemplateSection[] }

export const projectTemplates: readonly ProjectTemplate[] = [
  {
    id: 'research-story',
    name: 'Research story',
    description: 'Connect the research gap, your approach and the work it leads to.',
    sections: [
      { heading: 'Review & research gap', layout: 'text', sample: 'Introduce the area and the opportunity your project explores. Help readers understand why the question matters.' },
      { heading: 'Application contexts', layout: 'image-left', sample: 'Show the setting for your work. Pair an image with a short account of the people, experiences or situations that motivate it.' },
      { heading: 'Methods & approach', layout: 'image-right', sample: 'Describe the approach at a level that helps readers understand your perspective. Keep the focus on the research story.' },
      { heading: 'Outcomes & resources', layout: 'gallery', sample: 'Bring together selected outcomes, visual material or resources. Add links to public work when it is ready to share.' }
    ]
  },
  {
    id: 'prototype-experience',
    name: 'Prototype & experience',
    description: 'Let images lead readers through a concept, prototype or experience.',
    sections: [
      { heading: 'The experience', layout: 'image-left', sample: 'Introduce the experience and the idea behind it. Give readers a clear starting point before exploring the visual details.' },
      { heading: 'Explore the prototype', layout: 'gallery', sample: 'Show a few views that help readers understand the character of the work. Short captions can guide their attention.' },
      { heading: 'Design process', layout: 'image-right', sample: 'Share the design questions and perspectives that shaped the prototype, alongside a representative image.' },
      { heading: 'Reflections & next steps', layout: 'text', sample: 'Close with the questions the work opens up and any public resources readers can explore next.' }
    ]
  },
  {
    id: 'study-findings',
    name: 'Study & findings',
    description: 'Introduce a study, explain the approach and share what was learned.',
    sections: [
      { heading: 'Study overview', layout: 'text', sample: 'Introduce the study question and its context. Explain what readers need to know before the findings.' },
      { heading: 'Research approach', layout: 'image-right', sample: 'Outline the approach and the setting. A representative image can make the research context easier to understand.' },
      { heading: 'Key findings', layout: 'image-left', sample: 'Share the main insights in plain language. Connect each point to the evidence available and the scope of the study.' },
      { heading: 'Materials & outcomes', layout: 'gallery', sample: 'Collect selected figures, materials or outputs. Link to the paper or public resources for further reading.' }
    ]
  }
]

export function createTemplateSections(template: ProjectTemplate): ProjectSection[] {
  return template.sections.map(({ heading, layout }) => ({ ...newSection(), heading, layout, body: emptyDocument(), images: [], linkLabel: '', linkUrl: '' }))
}

const sampleDocument = (text: string): RichText => ({ type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: `Sample text: ${text}` }] }] })
const sampleImages = [
  { url: music, alt: 'Sample image of a music research prototype.', caption: 'Sample image · Music research prototype' },
  { url: classroom, alt: 'Sample image of a virtual classroom prototype.', caption: 'Sample image · Immersive research prototype' },
  { url: qilin, alt: 'Sample image of a virtual character in a research prototype.', caption: 'Sample image · Virtual character' }
]

export function createTemplatePreview(template: ProjectTemplate, value: ProjectMaterial): ProjectMaterial {
  return {
    ...value,
    hero: value.hero || hero,
    heroAlt: value.hero ? value.heroAlt : 'Sample AI-generated image of a person journaling beside a tabletop robot at home.',
    title: value.title || 'Your research, brought to life',
    subtitle: value.subtitle || 'Sample project introduction. A short description gives readers a clear invitation to explore your work.',
    authors: value.authors || 'Sample author',
    leader: value.leader || 'Sample project leader',
    supervisor: value.supervisor || 'Sample supervisor',
    sections: template.sections.map(({ heading, layout, sample }, index) => ({
      id: `${template.id}-sample-${index}`, heading, layout, body: sampleDocument(sample), linkLabel: '', linkUrl: '',
      images: layout === 'text' ? [] : layout === 'gallery' ? sampleImages.slice(0, 2) : [sampleImages[index % sampleImages.length]]
    }))
  }
}
