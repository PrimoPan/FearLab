import type { ResearchSection } from '../../content/courseResearchTemplate'
import { cn } from '../../lib/cn'
import { CourseDesignProcess } from './CourseDesignProcess'
import { CourseDevelopmentFlow } from './CourseDevelopmentFlow'
import { CourseLiteratureGallery } from './CourseLiteratureGallery'
import { CoursePrototypeShowcase } from './CoursePrototypeShowcase'
import { projectLabel } from './ProjectReveal'

const sectionContent = {
  'literature-review': CourseLiteratureGallery,
  'design-process': CourseDesignProcess,
  implementation: CourseDevelopmentFlow,
  showcase: CoursePrototypeShowcase,
}

export function CourseProjectSection({ section }: { section: ResearchSection }) {
  const Content = section.id in sectionContent ? sectionContent[section.id as keyof typeof sectionContent] : null

  return (
    <section id={section.id} tabIndex={-1} aria-labelledby={`${section.id}-title`} className="mb-14 scroll-mt-[calc(var(--site-header-height)+2rem)] border-b border-line pb-14 last:mb-0 last:border-0 last:pb-0">
      <p className={cn(projectLabel, 'm-0 mb-3')}>{section.number} / {Content ? 'Project documentation' : 'To complete'}</p>
      <h2 id={`${section.id}-title`} className="m-0 text-[clamp(1.5rem,2.6vw,2rem)] font-medium leading-tight tracking-[-0.035em]">{section.title}</h2>
      {section.id === 'description' && (
        <div id="storyboard" className="mt-5 flex min-h-48 scroll-mt-[calc(var(--site-header-height)+2rem)] flex-col items-center justify-center rounded-xl border border-dashed border-line bg-panel p-6 text-center">
          <h3 className="m-0 text-base font-medium">Storyboard pictures or video</h3>
          <p className="mb-0 mt-2 text-sm text-ink-soft">Media to be added by the project team.</p>
        </div>
      )}
      {Content ? (
        <>
          <p className="mb-7 mt-4 max-w-[75ch] text-base leading-relaxed text-ink-soft">{section.prompts[0]}</p>
          <Content />
        </>
      ) : (
        <ul className="mb-0 mt-5 space-y-3 pl-5 text-base leading-relaxed text-ink-soft marker:text-accent">
          {section.prompts.map(prompt => <li key={prompt}>{prompt}</li>)}
        </ul>
      )}
    </section>
  )
}
