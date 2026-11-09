import { CourseHero } from '../components/projects/CourseHero'
import { CourseProjectCard } from '../components/projects/CourseProjectCard'
import { projectLabel, projectWidth } from '../components/projects/ProjectReveal'
import { useCourseContent } from '../lib/course/CourseAccessContext'
import { cn } from '../lib/cn'

export function CoursePage() {
  const { courseProjects } = useCourseContent()
  return (
    <div className="relative z-[1] bg-site">
      <CourseHero />
      <div className={projectWidth}>
        <section id="course-projects" aria-labelledby="course-projects-title" className="scroll-mt-[calc(var(--site-header-height)+2rem)] pb-20 pt-12 min-[1000px]:pb-28 min-[1000px]:pt-16">
          <div className="mb-10 flex items-end justify-between gap-5">
            <div>
              <p className={cn(projectLabel, 'mb-3 mt-0')}>The project gallery</p>
              <h2 id="course-projects-title" className="m-0 text-[clamp(2.5rem,4.5vw,4rem)] font-medium leading-none tracking-[-0.05em]">Student projects<span className="text-accent">.</span></h2>
            </div>
            <p className="m-0 shrink-0 pb-1 font-mono text-xs text-ink-soft">{String(courseProjects.length).padStart(2, '0')} projects</p>
          </div>
          <ol className="m-0 grid list-none grid-cols-1 gap-x-7 gap-y-12 p-0 min-[700px]:grid-cols-2 min-[1000px]:grid-cols-3 min-[1000px]:gap-y-16">
            {courseProjects.map(project => <li key={project.team} className="min-w-0"><CourseProjectCard project={project} /></li>)}
          </ol>
        </section>
      </div>
    </div>
  )
}
