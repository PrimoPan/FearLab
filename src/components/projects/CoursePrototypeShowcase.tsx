import { projectLabel } from './ProjectReveal'
import { cn } from '../../lib/cn'

export function CoursePrototypeShowcase() {
  return (
    <>
      <figure className="m-0">
        <div className="relative flex aspect-video min-h-60 items-center justify-center overflow-hidden rounded-xl border border-dashed border-line bg-panel px-6 py-10 text-center">
          <img src="/assets/course/hero-placeholder.svg" width={1920} height={1080} alt="" loading="lazy" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-50" />
          <div className="relative">
            <p className={cn(projectLabel, 'mb-4 mt-0')}>Final prototype</p>
            <h3 className="m-0 text-[clamp(1.5rem,3vw,2.5rem)] font-medium tracking-[-0.04em]">The experience in action.</h3>
            <p className="mb-0 mt-4 text-base leading-relaxed text-ink-soft">Demo video or prototype photographs<br />To be added by the team</p>
          </div>
        </div>
        <figcaption className="mt-4 text-sm leading-relaxed text-ink-soft">Add a caption describing the prototype and interaction shown, with image descriptions or video captions and a transcript.</figcaption>
      </figure>
      <dl className="mb-0 mt-8 grid gap-6 min-[700px]:grid-cols-2">
        <div className="border-t border-line pt-5">
          <dt className="font-medium">Experience walkthrough</dt>
          <dd className="m-0 mt-3 text-base leading-relaxed text-ink-soft">Show the key interaction from start to finish: what a person does, how the system responds, and the intended experience.</dd>
        </div>
        <div className="border-t border-line pt-5">
          <dt className="font-medium">Prototype details</dt>
          <dd className="m-0 mt-3 text-base leading-relaxed text-ink-soft">Describe the working features, setup, and current limitations. Add a demo, repository, or project paper link when available.</dd>
        </div>
      </dl>
    </>
  )
}
