import { useState } from 'react'
import { Link } from 'react-router-dom'
import { RecruitingPoster } from '../components/contact/RecruitingPoster'
import { RecruitingPosterDialog } from '../components/contact/RecruitingPosterDialog'
import { projectWidth } from '../components/projects/ProjectReveal'
import { cn } from '../lib/cn'

export function ContactPage() {
  const [posterOpen, setPosterOpen] = useState(false)

  return (
    <section className="relative z-[1] flex w-full flex-col" aria-labelledby="contact-title">
      <div className="order-2 min-[901px]:order-1">
        <RecruitingPoster onOpen={() => setPosterOpen(true)} />
      </div>

      <div className={cn(projectWidth, 'order-1 py-8 min-[901px]:order-2 min-[901px]:py-14')}>
        <p className="mb-3 mt-0 font-mono text-xs tracking-[0.14em] text-accent uppercase">MPhil opportunities · CMA / INFO</p>
        <h1 id="contact-title" className="m-0 text-[clamp(2rem,5vw,3.5rem)] leading-[1.08] tracking-[-0.04em]">Join FEAR Lab.</h1>
        <p className="mb-6 mt-5 max-w-[65ch] text-base leading-relaxed text-ink-soft">
          Our lab welcomes MPhil students interested in Embodied AI and HCI at HKUST(GZ).
        </p>

        <h2 className="mb-3 mt-7 text-xl font-medium tracking-[-0.02em]">Who we’re looking for</h2>
        <ul className="m-0 max-w-[65ch] space-y-3 pl-5 text-base leading-relaxed text-ink-soft marker:text-accent">
          <li>A bachelor’s degree in CS, AI, or HCI, with an interest in interdisciplinary and practice-informed research across these areas.</li>
          <li>Diligent, persistent, responsible, self-motivated critical thinkers who enjoy working in a team.</li>
          <li>Entrepreneurial interest and commercializing research are welcomed and encouraged.</li>
          <li>Good communication and collaboration skills.</li>
        </ul>

        <div className="mt-8 border-t border-line pt-6">
          <p className="m-0 text-base leading-relaxed">Contact Mirjana Prpa</p>
          <a href="mailto:fearlab@hkust-gz.edu.cn" className="inline-flex min-h-11 max-w-full items-center break-all py-2 text-base text-accent underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
            fearlab@hkust-gz.edu.cn
          </a>
        </div>
      </div>

      <div className={cn(projectWidth, 'order-3 border-t border-line py-5')}>
        <Link to="/people" className="inline-flex min-h-11 items-center text-sm text-ink-soft no-underline hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">← Back to People</Link>
      </div>
      <RecruitingPosterDialog open={posterOpen} onClose={() => setPosterOpen(false)} />
    </section>
  )
}
