import { Link } from 'react-router-dom'
import { phdProject } from '../content/phdProject'
import { ProjectReveal, projectLabel, projectWidth } from '../components/projects/ProjectReveal'
import { cn } from '../lib/cn'
import { PublishedProjectList } from '../components/projects/PublishedProjectList'

export function ProjectsPage() {
  return (
    <section className={cn(projectWidth, 'relative z-[1] pb-20 pt-[clamp(1.6rem,4vw,2.8rem)]')} aria-labelledby="projects-title">
      <ProjectReveal>
        <p className={projectLabel}>Research in progress</p>
        <header className="mb-12 flex items-end justify-between gap-8 max-[700px]:flex-col max-[700px]:items-start max-[700px]:gap-5">
          <h1 id="projects-title" className="m-0 text-[clamp(3.5rem,9vw,6.1rem)] font-medium leading-[0.93] tracking-[-0.06em]">Projects<span className="text-accent">.</span></h1>
          <p className="m-0 max-w-[32ch] text-base leading-relaxed text-ink-soft">Exploring human experience through embodied and intelligent technologies.</p>
        </header>
        <ul className="m-0 list-none border-t border-line p-0">
          <li>
            <Link
              to={`/projects/${phdProject.slug}`}
              className="group grid grid-cols-[14rem_minmax(0,1fr)_auto] items-start gap-x-8 gap-y-3 border-b border-line py-7 text-inherit no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent max-[700px]:grid-cols-[7rem_minmax(0,1fr)_auto] max-[700px]:gap-x-4 max-[700px]:py-6"
            >
              <div className="relative col-start-1 row-span-3 aspect-[3/2] overflow-hidden bg-black max-[700px]:row-span-1 max-[700px]:aspect-[4/3]">
                <img src={phdProject.hero} width={1672} height={941} className="absolute inset-0 h-full w-full object-cover object-[75%_50%] transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transform-none" alt={phdProject.heroAlt} fetchPriority="high" />
              </div>
              <div className="col-start-2 row-start-1 min-w-0">
                <p className="m-0 mb-3 font-mono text-[0.65rem] tracking-[0.14em] text-ink-soft uppercase">{phdProject.category}</p>
                <h2 className="m-0 text-[clamp(1.45rem,2.5vw,2.2rem)] font-medium leading-tight tracking-[-0.045em] transition-colors group-hover:text-accent">{phdProject.title}</h2>
              </div>
              <p className="col-start-2 row-start-2 m-0 max-w-[55ch] text-base leading-relaxed text-ink-soft max-[700px]:col-span-3 max-[700px]:col-start-1 max-[700px]:text-sm">{phdProject.subtitle}</p>
              <p className="col-start-2 row-start-3 m-0 text-sm text-ink-soft max-[700px]:col-span-3 max-[700px]:col-start-1">{phdProject.leader}</p>
              <span className="col-start-3 row-span-3 row-start-1 self-center text-2xl text-accent transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transform-none max-[700px]:row-span-1" aria-hidden="true">↗</span>
            </Link>
          </li>
        </ul>
        <PublishedProjectList />
      </ProjectReveal>
    </section>
  )
}
