import { cbtReviewUrl, phdProject, reviewFoundation } from '../../content/phdProject'
import { ProjectReveal, projectBody, projectHeading, projectLabel } from './ProjectReveal'

export function ProjectResearchGap() {
  return (
    <section id="project-overview" className="scroll-mt-[calc(var(--site-header-height)+2rem)] border-b border-line py-[clamp(3.5rem,8vw,7rem)]" aria-labelledby="review-foundation-title">
      <ProjectReveal className="grid grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] items-end gap-x-20 gap-y-7 max-[900px]:grid-cols-1">
        <div>
          <p className={projectLabel}>The research foundation / Scoping review</p>
          <h2 id="review-foundation-title" className={projectHeading}>When CBT becomes<br />an interaction.</h2>
        </div>
        <p className={projectBody}>{reviewFoundation.introduction}</p>
      </ProjectReveal>

      <ProjectReveal className="mt-12 grid grid-cols-3 border-y border-line max-[800px]:grid-cols-1">
        {reviewFoundation.findings.map((finding) => (
          <div key={finding.title} className="border-r border-line px-7 py-8 first:pl-0 last:border-r-0 last:pr-0 max-[800px]:border-b max-[800px]:border-r-0 max-[800px]:px-0 max-[800px]:py-6 max-[800px]:last:border-b-0">
            <h3 className="mb-4 mt-0 max-w-[23ch] text-[clamp(1.35rem,2vw,1.8rem)] font-medium leading-tight tracking-[-0.035em]">{finding.title}</h3>
            <p className="m-0 text-sm leading-[1.8] text-ink-soft">{finding.text}</p>
          </div>
        ))}
      </ProjectReveal>

      <ProjectReveal className="mt-5 flex flex-wrap items-center justify-between gap-x-8 gap-y-3">
        <p className="m-0 text-xs leading-relaxed text-ink-soft">From Therapeutic Practices to System Responses · Preprint, 2026</p>
        <a href={cbtReviewUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-11 items-center gap-3 text-sm text-ink underline decoration-line underline-offset-8 transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4">
          Read the review <span aria-hidden="true">↗</span>
        </a>
      </ProjectReveal>

      <ProjectReveal className="mt-[clamp(3.5rem,8vw,7rem)] grid grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] gap-x-20 gap-y-7 max-[900px]:grid-cols-1">
        <div>
          <p className={projectLabel}>From evidence to a research opportunity</p>
          <h2 className={projectHeading}>Understanding support<br />as it is lived.</h2>
        </div>
        <div className="pt-8 max-[900px]:pt-0">
          <p className={projectBody}>{reviewFoundation.opportunity}</p>
          <p className={`${projectBody} mt-6`}>{phdProject.overview}</p>
        </div>
      </ProjectReveal>
      <ProjectReveal className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-line pt-6">
        <p className={`${projectLabel} m-0`}>Application contexts</p>
        <p className="m-0 text-sm leading-relaxed text-ink-soft">Neurodiversity & children · Metabolic health & PCOS</p>
      </ProjectReveal>
    </section>
  )
}
