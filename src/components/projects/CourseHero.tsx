import { CourseLockButton } from './CourseLockButton'
import { Link } from 'react-router-dom'
import { useCourseContent } from '../../lib/course/CourseAccessContext'
import { cn } from '../../lib/cn'
import { projectLabel, projectWidth } from './ProjectReveal'

export function CourseHero() {
  const { course } = useCourseContent()
  return (
    <header className="relative isolate flex min-h-[calc(100svh-var(--site-header-height))] flex-col overflow-hidden border-b border-line bg-site-layer" aria-labelledby="course-title">
      <img src={course.heroImage} alt="" width={1920} height={1080} fetchPriority="high" className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover" />
      <div className={cn(projectWidth, 'flex items-center justify-between gap-5 pt-5')}>
        <Link to="/projects" className="inline-flex min-h-11 items-center gap-3 text-sm text-ink-soft no-underline hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
          <span aria-hidden="true">←</span> All projects
        </Link>
        <CourseLockButton />
      </div>
      <div className={cn(projectWidth, 'flex flex-1 flex-col justify-center pb-8 pt-12 min-[700px]:py-14')}>
        <div className="grid items-start gap-10 min-[1000px]:grid-cols-[1fr_1.1fr] min-[1000px]:gap-12 min-[1200px]:gap-16">
          <h1 id="course-title" aria-label={`${course.code} - ${course.title}`} className="m-0 max-w-[16ch] text-[clamp(2.5rem,12vw,3.5rem)] font-medium leading-[0.98] tracking-[-0.06em] min-[700px]:text-[clamp(3.5rem,6vw,5rem)]">
            <span className={cn(projectLabel, 'mb-7 block text-[0.75rem] tracking-[0.14em]')}>{course.code}<span className="sr-only"> - </span></span>
            {course.titleLines.map((line, index) => <span key={line} className={cn('block', index === course.titleLines.length - 1 && 'text-accent')}>{line}</span>)}
          </h1>
          <section aria-labelledby="course-about-title" className="max-w-[72ch]">
            <h2 id="course-about-title" className={cn(projectLabel, 'mb-6 mt-0')}>About the course</h2>
            <div className="flex flex-col gap-5 text-base leading-[1.75] text-ink-soft">
              {course.description.map(paragraph => <p key={paragraph} className="m-0">{paragraph}</p>)}
            </div>
          </section>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-t border-line pt-5 min-[700px]:mt-12">
          <p className="m-0 text-sm leading-relaxed text-ink-soft">Human-centric design. Interdisciplinary teams. Real-world challenges.</p>
          <a href="#course-projects" className="inline-flex min-h-11 shrink-0 items-center gap-8 text-sm text-ink no-underline hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
            Explore the projects <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
    </header>
  )
}
