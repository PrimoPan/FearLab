import { projectLabel } from './ProjectReveal'
import { cn } from '../../lib/cn'

export function CourseLiteratureGallery() {
  return (
    <ol className="m-0 grid list-none grid-cols-[repeat(auto-fit,minmax(min(100%,14rem),1fr))] gap-6 p-0" aria-label="Related literature">
      {['01', '02', '03'].map(number => (
        <li key={number} className="min-w-0">
          <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-xl border border-line bg-panel">
            <img src="/assets/course/teaser-placeholder.svg" width={800} height={500} alt="" loading="lazy" className="h-full w-full object-cover" />
            <figcaption className="absolute inset-x-4 bottom-4 text-center font-mono text-[0.6rem] tracking-[0.12em] text-ink-soft uppercase">Paper figure · To be added</figcaption>
          </figure>
          <p className={cn(projectLabel, 'mb-3 mt-5')}>Reference {number}</p>
          <h3 className="m-0 text-xl font-medium leading-tight tracking-[-0.03em]">Study or system title</h3>
          <p className="mb-0 mt-2 text-sm text-ink-soft">Authors · Year · Venue</p>
          <p className="mb-0 mt-4 text-base leading-relaxed text-ink-soft">Summarize the approach, key findings, and limitations. Explain how this work informs the project, and include its source link.</p>
        </li>
      ))}
    </ol>
  )
}
