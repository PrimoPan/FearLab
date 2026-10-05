import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import teamPhoto from '../../../assets/Home/fearlab-team.webp'
import teamPhotoMobile from '../../../assets/Home/fearlab-team-mobile.webp'
import { reveal, staggerIn } from '../../lib/animations'
import { cn } from '../../lib/cn'

const heroClasses = cn(
  'relative isolate flex flex-col overflow-hidden bg-site',
  'min-[901px]:h-[min(72vw,calc(100svh-var(--site-header-height)))] min-[901px]:min-h-[34rem]'
)

const photoClasses = cn(
  'relative order-2 m-0 overflow-hidden',
  'min-[901px]:absolute min-[901px]:inset-0 min-[901px]:-z-10',
  'max-[900px]:aspect-[1.65]'
)

const imageClasses = cn(
  'h-full w-full object-cover object-[50%_64%]',
  'brightness-[0.82] saturate-[0.78] contrast-[1.04]',
  '[[data-theme=light]_&]:brightness-[1.02] [[data-theme=light]_&]:saturate-[0.88] [[data-theme=light]_&]:contrast-[0.98]',
  'max-[900px]:brightness-[0.94] max-[900px]:saturate-[0.88]',
  'transition-[filter] duration-500 motion-reduce:transition-none'
)

const copyClasses = cn(
  'relative z-10 mx-auto w-[min(var(--page-max),calc(100%_-_(var(--gutter)_*_2)))]',
  'pb-12 pt-[clamp(2rem,4.5vh,4rem)]',
  'max-[900px]:pb-7 max-[900px]:pt-8'
)

const linkClasses = cn(
  'group inline-flex min-h-11 items-center gap-5 border-b border-accent pb-1',
  'text-sm font-medium text-ink no-underline transition-colors hover:text-accent',
  'focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-accent'
)

export function HomeBanner() {
  const reduceMotion = useReducedMotion()

  return (
    <section className={heroClasses} aria-labelledby="home-title">
      <motion.figure
        className={photoClasses}
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 1.1 }}
      >
        <img
          className={imageClasses}
          src={teamPhoto}
          srcSet={`${teamPhotoMobile} 960w, ${teamPhoto} 2560w`}
          sizes="100vw"
          width={2560}
          height={1865}
          alt="Six FEAR Lab members gathered around a table in the lab."
          fetchPriority="high"
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,var(--bg)_0%,color-mix(in_srgb,var(--bg)_96%,transparent)_14%,color-mix(in_srgb,var(--bg)_82%,transparent)_31%,transparent_56%,transparent_82%,var(--bg)_100%)] max-[900px]:bg-[linear-gradient(180deg,var(--bg)_0%,transparent_14%,transparent_88%,var(--bg)_100%)]"
          aria-hidden="true"
        />
      </motion.figure>

      <motion.div
        className={copyClasses}
        initial={reduceMotion ? false : 'hidden'}
        animate="visible"
        variants={staggerIn}
      >
        <motion.p
          className="m-0 mb-5 font-mono text-[0.7rem] tracking-[0.18em] text-accent uppercase max-[900px]:mb-4"
          variants={reveal}
        >
          HKUST(GZ) · Computational Media and Arts
        </motion.p>
        <motion.h1
          id="home-title"
          className="m-0 text-[clamp(5.5rem,10vw,9rem)] font-medium leading-[0.88] tracking-[-0.075em] text-ink max-[900px]:text-[clamp(4.2rem,15vw,7rem)]"
          variants={reveal}
        >
          FEAR Lab<span className="text-accent">.</span>
        </motion.h1>
        <motion.p
          className="m-0 mt-5 text-[clamp(1rem,1.6vw,1.35rem)] tracking-[-0.025em] text-ink max-[900px]:mt-4 max-[900px]:max-w-[24ch]"
          variants={reveal}
        >
          Future Embodied Augmented Realities Lab
        </motion.p>
        <motion.div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 max-[900px]:mt-4" variants={reveal}>
          <Link className={linkClasses} to="/people">
            Meet the people
            <span className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true">↗</span>
          </Link>
          <Link className={linkClasses} to="/publications">
            Explore our research
            <span className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true">↗</span>
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
