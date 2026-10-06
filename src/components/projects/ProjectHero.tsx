import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { phdProject } from '../../content/phdProject'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { reveal, staggerIn } from '../../lib/animations'
import { cn } from '../../lib/cn'
import { projectWidth } from './ProjectReveal'

export function ProjectHero() {
  const heroRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const desktop = useMediaQuery('(min-width: 901px)')
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', desktop ? '12%' : '6%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.06])

  return (
    <section
      ref={heroRef}
      className="relative isolate h-[calc(100svh-var(--site-header-height))] min-h-[36rem] max-h-[58rem] overflow-hidden bg-black text-white max-[700px]:min-h-[38rem]"
      aria-labelledby="phd-project-title"
    >
      <motion.div
        className="absolute inset-0 max-[900px]:top-[43%] max-[900px]:[mask-image:linear-gradient(to_bottom,transparent,black_22%)] max-[360px]:top-[55%]"
        style={reduceMotion ? undefined : { y, scale }}
      >
        <img
          src={phdProject.hero}
          width={1672}
          height={941}
          className="h-full w-full object-cover object-center max-[900px]:object-[75%_50%]"
          alt={phdProject.heroAlt}
          fetchPriority="high"
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.85)_0%,rgba(0,0,0,0.70)_30%,rgba(0,0,0,0.12)_70%,rgba(0,0,0,0.06)_100%)] max-[900px]:bg-[linear-gradient(180deg,#000_0%,#000_42%,rgba(0,0,0,0.76)_53%,rgba(0,0,0,0.08)_73%,rgba(0,0,0,0.65)_100%)]" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-gradient-to-t from-black/70 to-transparent" aria-hidden="true" />
      <motion.div
        className={cn(projectWidth, 'relative flex h-full flex-col justify-between py-[clamp(1.4rem,4vh,2.5rem)] max-[900px]:justify-start')}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        variants={staggerIn}
      >
        <Link className="inline-flex min-h-11 w-fit items-center gap-3 text-sm text-white/75 no-underline transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4" to="/projects">
          <span aria-hidden="true">←</span> All projects
        </Link>
        <div className="max-w-[43rem] pb-8 max-[900px]:mt-9 max-[900px]:pb-0">
          <motion.p className="mb-6 mt-0 font-mono text-[0.65rem] tracking-[0.18em] text-white/70 uppercase" variants={reveal}>
            PhD research · FEAR Lab
          </motion.p>
          <motion.h1 id="phd-project-title" className="m-0 -ml-[0.035em] text-[clamp(3.5rem,6.8vw,6.75rem)] font-medium leading-[0.96] tracking-[-0.06em] max-[700px]:text-[clamp(3.05rem,12.7vw,5rem)]" variants={reveal}>
            CBT-informed<br />interactive<br />health<span className="text-accent">.</span>
          </motion.h1>
          <motion.p className="mb-0 mt-7 max-w-[31ch] text-[clamp(1rem,1.5vw,1.3rem)] leading-relaxed text-white/80" variants={reveal}>
            {phdProject.subtitle}
          </motion.p>
        </div>
        <motion.div className="flex items-end justify-between gap-8 border-t border-white/20 pt-5 max-[900px]:mt-auto max-[400px]:gap-3" variants={reveal}>
          <p className="m-0 font-mono text-[0.6rem] tracking-[0.1em] text-white/65 uppercase">Dongyijie Primo Pan<br /><span className="inline-block mt-2">HKUST(GZ)</span></p>
          <a className="inline-flex min-h-11 items-center gap-4 text-sm text-white no-underline focus-visible:outline-2 focus-visible:outline-offset-4" href="#project-overview">
            Explore the research <span aria-hidden="true">↓</span>
          </a>
        </motion.div>
      </motion.div>
    </section>
  )
}
