import { phdProject } from '../../content/phdProject'
import { ProjectReveal, projectBody, projectHeading, projectLabel } from './ProjectReveal'

export function ProjectNeurodiversity() {
  return (
    <section className="py-[clamp(3.5rem,8vw,7rem)]" aria-labelledby="neurodiversity-title">
      <ProjectReveal className="mb-12 grid grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] items-end gap-x-20 gap-y-7 max-[900px]:grid-cols-1">
        <div>
          <p className={projectLabel}>01 / Neurodiversity</p>
          <h2 id="neurodiversity-title" className={projectHeading}>Different ways<br />to experience care.</h2>
        </div>
        <p className={projectBody}>{phdProject.neurodiversity}</p>
      </ProjectReveal>
      <ProjectReveal>
        <figure className="m-0">
          <div className="grid aspect-[1.8/1] grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] gap-5 max-[700px]:aspect-auto max-[700px]:grid-cols-1 max-[700px]:gap-6">
            <div className="relative min-h-0 overflow-hidden bg-black max-[700px]:aspect-[5/4]">
              <img src={phdProject.media.music} className="absolute inset-0 h-full w-full object-cover object-center" width={1280} height={720} loading="lazy" alt="Golden particle figure from a music-based research prototype." />
              <span className="absolute bottom-5 left-5 font-mono text-[0.6rem] tracking-[0.14em] text-white/70 uppercase">Music & embodied experience</span>
            </div>
            <div className="grid min-h-0 grid-rows-[minmax(0,1fr)_minmax(0,1fr)] gap-5 max-[700px]:grid-rows-none max-[700px]:gap-6">
              <div className="relative min-h-0 overflow-hidden bg-black max-[700px]:aspect-video">
                <img src={phdProject.media.classroom} className="absolute inset-0 h-full w-full object-cover object-center" width={1920} height={1080} loading="lazy" alt="Qilin character in a virtual classroom research prototype." />
              </div>
              <div className="relative min-h-0 overflow-hidden bg-black max-[700px]:aspect-[2/1]">
                <img src={phdProject.media.qilin} className="absolute inset-0 h-full w-full object-cover object-center" width={1280} height={720} loading="lazy" alt="Qilin character in a calm virtual music room." />
              </div>
            </div>
          </div>
          <figcaption className="mt-3 grid grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] gap-x-5 gap-y-1 text-xs leading-relaxed text-ink-soft max-[700px]:grid-cols-1">
            <span>Music-based research prototype</span>
            <span>Immersive research prototypes</span>
          </figcaption>
        </figure>
      </ProjectReveal>
    </section>
  )
}
