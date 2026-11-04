import { CourseLockButton } from '../components/projects/CourseLockButton'
import { Link, useParams } from 'react-router-dom'
import { CourseProjectIntro } from '../components/projects/CourseProjectIntro'
import { CourseProjectSection } from '../components/projects/CourseProjectSection'
import { CourseProjectNavigation } from '../components/projects/CourseProjectNavigation'
import { projectWidth } from '../components/projects/ProjectReveal'
import { useCourseContent } from '../lib/course/CourseAccessContext'
import { cn } from '../lib/cn'

const linkClass = 'inline-flex min-h-11 items-center text-sm text-ink-soft no-underline hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent'

export function CourseProjectPage() {
  const { courseProjects, courseResearchTemplate } = useCourseContent()
  const { team } = useParams()
  const project = courseProjects.find((item) =>
    `team-${item.team}` === team || item.aliases?.some(alias => `team-${alias}` === team)
  )

  if (!project) {
    return (
      <section className={cn(projectWidth, 'relative z-[1] py-16')}>
        <h1>Course project not found</h1>
        <Link to="/projects/course" className={linkClass}>← Back to Course</Link>
      </section>
    )
  }

  return (
    <div className={cn(projectWidth, 'relative z-[1] pb-32 pt-[clamp(1.6rem,4vw,2.8rem)]')}>
      <div className="flex items-center justify-between gap-4"><Link to="/projects/course" className={linkClass}>← Back to Course</Link><CourseLockButton /></div>
      <CourseProjectIntro project={project} />
      <article className="min-w-0 w-full" aria-label="Research project template">
        {courseResearchTemplate.map(section => <CourseProjectSection key={section.id} section={section} />)}
      </article>
      <CourseProjectNavigation key={project.team} />
    </div>
  )
}
