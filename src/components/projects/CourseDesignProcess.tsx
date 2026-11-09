import { useCourseContent } from '../../lib/course/CourseAccessContext'
import { projectLabel } from './ProjectReveal'
import { cn } from '../../lib/cn'

export function CourseDesignProcess() {
  const { courseDesignBoard } = useCourseContent()
  return (
    <figure className="m-0 overflow-hidden rounded-xl border border-line bg-panel">
      <figcaption className="flex flex-wrap items-center justify-between gap-x-5 gap-y-2 border-b border-line px-5 py-3">
        <div>
          <p className={cn(projectLabel, 'mb-1 mt-0')}>Workshop board</p>
          <p className="m-0 text-sm font-medium">{courseDesignBoard.title}</p>
        </div>
        <a href={courseDesignBoard.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3 text-sm text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
          Open in FigJam <span aria-hidden="true">↗</span>
        </a>
      </figcaption>
      <iframe
        title="CMAA6019 Workshop — FigJam design process board"
        src={courseDesignBoard.embedUrl}
        width="100%"
        height="600"
        className="block h-[clamp(26rem,65vh,42rem)] w-full border-0 bg-panel focus-visible:outline-2 focus-visible:outline-accent"
        loading="lazy"
        allowFullScreen
      />
    </figure>
  )
}
