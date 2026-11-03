import { Link, useParams } from 'react-router-dom'
import { projectLabel, projectWidth } from '../components/projects/ProjectReveal'
import { courseProjects } from '../content/courseProjects'
import { courseResearchTemplate } from '../content/courseResearchTemplate'
import { cn } from '../lib/cn'

const linkClass = 'inline-flex min-h-11 items-center text-sm text-ink-soft no-underline hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'

export function CourseProjectPage() {
  const { team } = useParams()
  const project = courseProjects.find((item) => `team-${item.team}` === team)

  if (!project) {
    return (
      <section className={cn(projectWidth, 'relative z-[1] py-16')}>
        <h1>Course project not found</h1>
        <Link to="/projects/course" className={linkClass}>← Back to Course</Link>
      </section>
    )
  }

  return (
    <div className={cn(projectWidth, 'relative z-[1] pb-20 pt-[clamp(1.6rem,4vw,2.8rem)]')}>
      <Link to="/projects/course" className={linkClass}>← Back to Course</Link>
      <header className="mb-12 mt-8 border-b border-line pb-10">
        <p className={projectLabel}>Course / Team #{project.team}</p>
        <h1 id="project-title" className="m-0 max-w-[30ch] scroll-mt-[calc(var(--site-header-height)+2rem)] text-[clamp(2rem,4.5vw,4.1rem)] font-medium leading-[1.08] tracking-[-0.045em]">{project.title}</h1>
        <section id="teaser" aria-labelledby="teaser-title" className="mt-8 scroll-mt-[calc(var(--site-header-height)+2rem)]">
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
          <p className="m-0 max-w-[80ch] text-sm leading-relaxed text-ink-soft">The project title and team are confirmed. Complete the prompts below with the project context, research rationale, scope, technology choices, and team responsibilities.</p>
        </div>
      </header>
      <div className="grid grid-cols-[15rem_minmax(0,1fr)] items-start gap-12 max-[900px]:grid-cols-1 max-[900px]:gap-8">
        <nav aria-label="Research sections" className="min-[901px]:sticky min-[901px]:top-[calc(var(--sticky-header-offset)+1.5rem)]">
          <p className={cn(projectLabel, 'm-0 mb-4')}>On this page</p>
          <ol className="m-0 list-none p-0">
            <li><a href="#project-title" className={cn(linkClass, 'gap-3')}><span className="font-mono text-xs text-accent">01</span>Title</a></li>
            <li><a href="#teaser" className={linkClass}>Project teaser</a></li>
            {courseResearchTemplate.map((section, index) => (
              <li key={section.id}>
                <a href={`#${section.id}`} className={cn(linkClass, 'gap-3 py-2 leading-snug')}>
                  <span className="font-mono text-xs text-accent">{String(index + 2).padStart(2, '0')}</span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="min-w-0" aria-label="Research project template">
          {courseResearchTemplate.map((section, index) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`} className="mb-10 scroll-mt-[calc(var(--site-header-height)+2rem)] border-b border-line pb-10 last:mb-0">
              <p className={cn(projectLabel, 'm-0 mb-3')}>{String(index + 2).padStart(2, '0')} / To complete</p>
              <h2 id={`${section.id}-title`} className="m-0 text-[clamp(1.5rem,2.6vw,2rem)] font-medium leading-tight tracking-[-0.035em]">{section.title}</h2>
              {section.id === 'description' && (
                <div id="storyboard" className="mt-5 flex min-h-48 scroll-mt-[calc(var(--site-header-height)+2rem)] flex-col items-center justify-center rounded-xl border border-dashed border-line bg-panel p-6 text-center">
                  <h3 className="m-0 text-base font-medium">Storyboard pictures or video</h3>
                  <p className="mb-0 mt-2 text-sm text-ink-soft">Media to be added by the project team.</p>
                </div>
              )}
              <ul className="mb-0 mt-5 space-y-3 pl-5 text-base leading-relaxed text-ink-soft marker:text-accent">
                {section.prompts.map((prompt) => <li key={prompt}>{prompt}</li>)}
              </ul>
              {section.id === 'team-assignments' && (
                <dl className="mb-0 mt-6 space-y-4">
                  {project.students.map((student) => (
                    <div key={student.email} className="rounded-xl border border-line bg-panel p-5">
                      <dt className="font-medium">{student.name}</dt>
                      <dd className="m-0 mt-2 text-sm leading-relaxed text-ink-soft">Responsibilities: To complete<br />Deliverables: To complete<br />Milestones: To complete</dd>
                    </div>
                  ))}
                </dl>
              )}
            </section>
          ))}
        </article>
      </div>
    </div>
  )
}
