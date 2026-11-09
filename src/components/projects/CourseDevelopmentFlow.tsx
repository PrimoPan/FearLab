import { useCourseContent } from '../../lib/course/CourseAccessContext'
import { projectLabel } from './ProjectReveal'
import { cn } from '../../lib/cn'

export function CourseDevelopmentFlow() {
  const { developmentStages } = useCourseContent()
  return (
    <figure className="m-0">
      <p className={cn(projectLabel, 'mb-5 mt-0')}>Iteration 01 · To document</p>
      <ol className="m-0 grid list-none grid-cols-1 gap-10 p-0 min-[700px]:grid-cols-3 min-[700px]:gap-7" aria-label="Development cycle">
        {developmentStages.map((stage, index) => (
          <li key={stage.id} id={stage.id} className="relative flex min-w-0 scroll-mt-[calc(var(--site-header-height)+2rem)] flex-col rounded-xl border border-line bg-panel p-5">
            <span className="mb-6 inline-flex size-10 items-center justify-center rounded-full border border-line font-mono text-sm text-accent">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="m-0 text-2xl font-medium tracking-[-0.035em]">{stage.title}</h3>
            <p className="mb-6 mt-4 text-base leading-relaxed text-ink-soft">{stage.description}</p>
            <p className="mb-0 mt-auto border-t border-line pt-4 text-xs leading-relaxed text-ink-soft">{stage.output}</p>
            {index < developmentStages.length - 1 && (
              <span aria-hidden="true" className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xl text-accent min-[700px]:-right-6 min-[700px]:bottom-auto min-[700px]:left-auto min-[700px]:top-7 min-[700px]:translate-x-0">
                <span className="min-[700px]:hidden">↓</span><span className="hidden min-[700px]:inline">→</span>
              </span>
            )}
          </li>
        ))}
      </ol>
      <figcaption className="mt-6 flex items-center gap-4 rounded-b-xl border-x border-b border-dashed border-line px-5 pb-5 pt-2 text-sm leading-relaxed text-ink-soft">
        <span aria-hidden="true" className="text-2xl text-accent">↻</span>
        Repeat the cycle: feed what you learn into the next build.
      </figcaption>
    </figure>
  )
}
