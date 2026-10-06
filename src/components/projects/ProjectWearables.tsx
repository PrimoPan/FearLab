import wearableConcept from '../../../assets/Projects/phd/wearable-concept.png'
import { phdProject } from '../../content/phdProject'
import { ProjectReveal, projectBody, projectHeading, projectLabel } from './ProjectReveal'

export function ProjectWearables() {
  return (
    <section className="border-t border-line py-[clamp(3.5rem,8vw,7rem)]" aria-labelledby="wearable-title">
      <ProjectReveal className="grid grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] items-center gap-[clamp(2rem,6vw,6rem)] max-[900px]:grid-cols-1">
        <figure className="m-0">
          <img src={wearableConcept} className="aspect-[4/5] h-auto w-full object-cover object-[85%_center] max-[900px]:aspect-[4/3] max-[900px]:object-center" width={1402} height={1122} loading="lazy" alt="Concept image of a woman wearing an upper-arm glucose sensor and a smartwatch displaying a menstrual-cycle tracking interface." />
          <figcaption className="mt-3 text-xs leading-relaxed text-ink-soft">Wearable health in everyday life · AI-generated concept image</figcaption>
        </figure>
        <div>
          <p className={projectLabel}>02 / Metabolic health & PCOS</p>
          <h2 id="wearable-title" className={projectHeading}>Everyday signals.<br />A fuller picture.</h2>
          <p className={`${projectBody} mt-7`}>{phdProject.metabolicHealth}</p>
        </div>
      </ProjectReveal>
    </section>
  )
}
