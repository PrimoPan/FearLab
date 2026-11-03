import { Link } from 'react-router-dom'
import { projectLabel, projectWidth } from '../components/projects/ProjectReveal'
import { courseProjects } from '../content/courseProjects'
import { cn } from '../lib/cn'

export function CoursePage() {
  return (
    <section className={cn(projectWidth, 'relative z-[1] pb-20 pt-[clamp(1.6rem,4vw,2.8rem)]')} aria-labelledby="course-title">
      <Link to="/projects" className="inline-flex min-h-11 items-center text-sm text-ink-soft no-underline hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">← Back to Projects</Link>
      <header className="mb-12 mt-8">
        <p className={projectLabel}>Projects / Course</p>
        <h1 id="course-title" className="m-0 text-[clamp(3.5rem,9vw,6.1rem)] font-medium leading-[0.93] tracking-[-0.06em]">Course<span className="text-accent">.</span></h1>
        <p className="mt-6 text-base leading-relaxed text-ink-soft">Seven student projects from the course of CMAA6019M (L01) - Human-Centric Design for Embodied AI.</p>
      </header>
      <ol className="m-0 list-none border-t border-line p-0">
        {courseProjects.map((project) => (
          <li key={project.team} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-6 border-b border-line py-9 max-[700px]:grid-cols-1 max-[700px]:gap-3">
            <p className={cn(projectLabel, 'm-0 pt-1')}>Team #{project.team}</p>
            <article aria-labelledby={`team-${project.team}-title`} className="min-w-0">
              <h2 id={`team-${project.team}-title`} className="m-0 max-w-[48ch] text-[clamp(1.45rem,2.5vw,2.2rem)] font-medium leading-tight tracking-[-0.035em]">
                <Link to={`/projects/course/team-${project.team}`} className="text-inherit no-underline hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">{project.title}</Link>
              </h2>
              <Link to={`/projects/course/team-${project.team}`} className="mt-3 inline-flex min-h-11 items-center text-sm text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent" aria-label={`View research template for Team ${project.team}`}>View research template →</Link>
              <ul className="mt-7 grid list-none grid-cols-3 gap-5 p-0 max-[1050px]:grid-cols-1">
                {project.students.map((student) => (
                  <li key={student.email} className="min-w-0">
                    <p className="m-0 text-sm font-medium">{student.name}</p>
                    <a href={`mailto:${student.email}`} className="mt-1 inline-block max-w-full break-words text-sm leading-relaxed text-ink-soft underline decoration-line underline-offset-4 hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">{student.email}</a>
                  </li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>
    </section>
  )
}
