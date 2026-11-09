import teaserPlaceholder from '../../../assets/Course/teaser-placeholder.svg'
import { Link } from 'react-router-dom'
import type { CourseProject } from '../../content/courseProjects'
import { cn } from '../../lib/cn'
import { projectLabel } from './ProjectReveal'

export function CourseProjectCard({ project }: { project: CourseProject }) {
  return (
    <article className="h-full" aria-labelledby={`team-${project.team}-title`}>
      <Link to={`/projects/course/team-${project.team}`} aria-labelledby={`team-${project.team}-title`} className="group block h-full text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent">
        <figure className="relative m-0 aspect-[8/5] overflow-hidden border border-line bg-panel transition-colors duration-200 group-hover:border-accent">
          <img src={project.teaser?.src ?? teaserPlaceholder} alt={project.teaser?.alt ?? ''} width={800} height={500} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transform-none" />
          {!project.teaser && <figcaption className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3 font-mono text-[0.6rem] tracking-[0.12em] text-ink-soft uppercase"><span>Teaser image</span><span>Forthcoming</span></figcaption>}
          <span aria-hidden="true" className="absolute left-5 top-4 font-mono text-sm text-ink-soft">{project.teamLabel ?? project.team}</span>
          <span aria-hidden="true" className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-line bg-site text-lg text-ink transition-colors group-hover:bg-accent group-hover:text-site">↗</span>
        </figure>
        <p className={cn(projectLabel, 'mb-3 mt-6')}>Team {project.teamLabel ?? project.team}</p>
        <h3 id={`team-${project.team}-title`} className="m-0 text-[1.35rem] font-medium leading-[1.25] tracking-[-0.035em] transition-colors group-hover:text-accent min-[700px]:min-h-[5em] min-[1000px]:text-[1.4rem]">{project.title}</h3>
        <p className="mb-0 mt-4 line-clamp-3 text-base leading-[1.6] text-ink-soft min-[700px]:min-h-[4.8em]">{project.summary}</p>
      </Link>
    </article>
  )
}
