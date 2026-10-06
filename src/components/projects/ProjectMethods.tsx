import { phdProject, projectMethods } from '../../content/phdProject'
import { ProjectReveal, projectBody, projectHeading, projectLabel } from './ProjectReveal'

export function ProjectMethods() {
  return (
    <section className="border-y border-line py-[clamp(3.5rem,8vw,7rem)]" aria-labelledby="project-methods-title">
      <ProjectReveal className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-[clamp(2.5rem,8vw,8rem)] max-[900px]:grid-cols-1">
        <div>
          <p className={projectLabel}>03 / Methods & lived experience</p>
          <h2 id="project-methods-title" className={projectHeading}>The person<br />behind the data.</h2>
          <p className={`${projectBody} mt-7`}>CBT-informed design is considered alongside micro-phenomenology and autoethnography, connecting patterns in health data with the texture of individual experience.</p>
          <div className="mt-10 border-l-2 border-accent pl-6">
            <h3 className="mb-3 mt-0 text-lg font-medium">Long-term health tracking</h3>
            <p className="m-0 text-sm leading-[1.8] text-ink-soft">{phdProject.tracking}</p>
          </div>
        </div>
        <ol className="m-0 list-none p-0">
          {projectMethods.map((method) => (
            <li key={method.number} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-5 border-t border-line py-7 first:border-t-0 first:pt-0 last:pb-0">
              <span className={`${projectLabel} pt-1`}>{method.number}</span>
              <div>
                <h3 className="m-0 mb-3 text-[clamp(1.35rem,2.2vw,1.8rem)] font-medium leading-tight tracking-[-0.035em]">{method.title}</h3>
                <p className="m-0 text-sm leading-[1.8] text-ink-soft">{method.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </ProjectReveal>
    </section>
  )
}
