import { motion, useReducedMotion } from 'framer-motion'
import { HomeBanner } from '../components/home/HomeBanner'
import { FocusList } from '../components/ui/FocusList'
import { homeFocusPoints } from '../content/siteContent'
import { reveal } from '../lib/animations'

export function HomePage() {
  const reduceMotion = useReducedMotion()

  return (
    <div className="relative z-[1]">
      <HomeBanner />
      <motion.section
        className="mx-auto grid w-[min(var(--page-max),calc(100%_-_(var(--gutter)_*_2)))] grid-cols-2 gap-x-16 gap-y-6 py-[clamp(2.5rem,6vw,5rem)] max-[900px]:grid-cols-1"
        aria-labelledby="home-research-title"
        initial={reduceMotion ? false : 'hidden'}
        whileInView="visible"
        viewport={{ once: true, amount: 0.15 }}
        variants={reveal}
      >
        <div>
          <h2 id="home-research-title" className="m-0 text-[clamp(1.8rem,3.5vw,3rem)] leading-tight tracking-[-0.05em]">
            Research shaped<br />by human experience.
          </h2>
          <p className="mb-0 mt-5 max-w-[38ch] text-base leading-relaxed text-ink-soft">
            A human-computer interaction lab at HKUST(GZ), led by{' '}
            <a className="text-ink underline decoration-accent underline-offset-4 hover:text-accent" href="https://cma.hkust-gz.edu.cn/faculty-regular/mirjana-prpa/" target="_blank" rel="noreferrer">
              Prof. Mirjana Prpa
            </a>.
          </p>
        </div>
        <FocusList items={homeFocusPoints} className="col-auto max-w-none" />
      </motion.section>
    </div>
  )
}
