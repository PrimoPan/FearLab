import { projectOutputs } from '../../content/phdProject'
import { ProjectReveal, projectHeading, projectLabel } from './ProjectReveal'

export function ProjectOutputs() {
  return (
    <section className="py-[clamp(3.5rem,8vw,7rem)]" aria-labelledby="project-outputs-title">
      <ProjectReveal>
        <p className={projectLabel}>Selected research</p>
        <h2 id="project-outputs-title" className={projectHeading}>Reading the work.</h2>
        <ul className="mb-0 mt-12 list-none border-t border-line p-0">
          {projectOutputs.map((output) => (
            <li key={output.title} className="grid grid-cols-[12rem_minmax(0,1fr)_auto] items-start gap-x-8 gap-y-3 border-b border-line py-8 max-[800px]:grid-cols-[minmax(0,1fr)_auto] max-[500px]:grid-cols-1">
              <span className="pt-1 font-mono text-[0.6rem] tracking-[0.12em] text-ink-soft uppercase max-[800px]:col-span-2 max-[500px]:col-span-1">{output.category}</span>
              <div>
                <h3 className="m-0 text-[clamp(1.35rem,2.5vw,1.9rem)] font-medium leading-tight tracking-[-0.035em]">{output.title}</h3>
                <p className="mb-0 mt-3 max-w-[49ch] text-sm leading-relaxed text-ink-soft">{output.description}</p>
              </div>
              {output.href && (
                <a href={output.href} target="_blank" rel="noreferrer" className="group inline-flex min-h-11 items-center gap-4 text-sm text-ink underline decoration-accent underline-offset-8 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                  {output.linkLabel}<span className="inline-block transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true">↗</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      </ProjectReveal>
    </section>
  )
}
