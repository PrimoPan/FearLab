import type { CourseProject } from '../../content/courseProjects'
import { cn } from '../../lib/cn'
import { projectLabel } from './ProjectReveal'

const linkClass = 'inline-flex min-h-11 items-center text-sm text-ink-soft no-underline hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'

export function CourseProjectIntro({ project }: { project: CourseProject }) {
  return (
    <header className="mb-12 mt-8 border-b border-line pb-10">
      <p className={projectLabel}>00 / Course / Team #{project.teamLabel ?? project.team}</p>
      <h1 id="project-title" tabIndex={-1} className="m-0 max-w-[30ch] scroll-mt-[calc(var(--site-header-height)+2rem)] text-[clamp(2rem,4.5vw,4.1rem)] font-medium leading-[1.08] tracking-[-0.045em]">{project.title}</h1>
      <section id="teaser" tabIndex={-1} aria-labelledby="teaser-title" className="mt-8 scroll-mt-[calc(var(--site-header-height)+2rem)]">
        <h2 id="teaser-title" className={cn(projectLabel, 'mb-3')}>Project teaser</h2>
        <figure className="m-0">
          <div className="flex aspect-video min-h-48 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-line bg-panel p-6 text-center">
            <p className="m-0 text-xl font-medium">Teaser image or short video</p>
            <p className="m-0 max-w-[48ch] text-sm leading-relaxed text-ink-soft">Add a visual introduction that captures the project’s central idea and intended experience.</p>
            <span className={projectLabel}>Media to be added</span>
          </div>
          <figcaption className="mt-3 max-w-[80ch] text-sm leading-relaxed text-ink-soft">Caption to complete: summarize the concept in one or two sentences. Include alt text for an image, or captions and a transcript for a video.</figcaption>
        </figure>
      </section>
      <ul className="my-8 grid list-none grid-cols-3 gap-5 p-0 max-[900px]:grid-cols-1">
        {project.students.map((student) => (
          <li key={student.email} className="min-w-0">
            <p className="m-0 font-medium">{student.name}</p>
            <a href={`mailto:${student.email}`} className={cn(linkClass, 'max-w-full break-all underline decoration-line underline-offset-4')}>{student.email}</a>
          </li>
        ))}
      </ul>
      <div className="rounded-xl border border-line bg-panel p-5">
        <p className={cn(projectLabel, 'm-0 mb-2')}>Research template · To complete</p>
        <p className="m-0 max-w-[80ch] text-sm leading-relaxed text-ink-soft">The project title and team are confirmed. Complete the prompts below with the project context, research problem, related work, design process, development iterations, and final prototype.</p>
      </div>
    </header>
  )
}
