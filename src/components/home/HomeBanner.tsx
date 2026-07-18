import { motion } from 'framer-motion'
import { reveal } from '../../lib/animations'
import { cn } from '../../lib/cn'
import { Eyebrow } from '../ui/Eyebrow'

const heroClasses = cn(
  'col-start-1 max-w-[35rem] self-center',
  'max-[1024px]:w-full max-[1024px]:max-w-none'
)

const lockupClasses = cn(
  'mb-[1.1rem] grid grid-cols-[minmax(0,13rem)_minmax(0,1fr)] items-end gap-x-[1.2rem] gap-y-4',
  'max-[700px]:mb-[0.9rem] max-[700px]:grid-cols-1 max-[700px]:gap-[0.7rem]'
)

const markClasses = cn(
  'grid gap-[0.1rem] text-[clamp(2.7rem,7vw,4.9rem)] font-bold leading-[0.88] tracking-[-0.09em] text-ink uppercase',
  '[text-shadow:0_0_34px_color-mix(in_srgb,var(--glow)_44%,transparent)] [&>span:last-child]:normal-case',
  'max-[700px]:text-[clamp(2.35rem,14vw,3.8rem)]'
)

const meaningClasses = cn(
  'grid gap-[0.08rem] self-stretch pb-[0.2rem] pt-2',
  '[&>span]:text-[clamp(1.08rem,2.4vw,1.52rem)] [&>span]:leading-[0.98] [&>span]:tracking-[-0.04em]',
  '[&>span]:text-[color-mix(in_srgb,var(--text)_92%,var(--accent)_8%)]',
  'max-[700px]:gap-[0.14rem] max-[700px]:pt-0 max-[700px]:[&>span]:text-[clamp(1rem,5.2vw,1.26rem)]'
)

const headlineClasses = cn(
  'm-0 max-w-[10ch] text-[clamp(3rem,9vw,6.1rem)] leading-[0.93] tracking-[-0.06em]',
  'max-[700px]:max-w-[6.6ch] max-[700px]:text-[clamp(2.45rem,12vw,3.9rem)] max-[700px]:leading-[0.96]'
)

const leadClasses = cn(
  'm-0 mt-[1.35rem] text-[clamp(1rem,1.6vw,1.2rem)] leading-[1.8] text-ink',
  'max-[700px]:mt-4 max-[700px]:text-[0.98rem] max-[700px]:leading-[1.65]'
)

const profileLinkClasses = cn(
  'border-b border-[color-mix(in_srgb,var(--accent)_55%,transparent)] text-inherit no-underline',
  'transition-colors duration-[160ms] hover:border-accent hover:text-accent'
)

export function HomeBanner() {
  return (
    <motion.div className={heroClasses} initial="hidden" animate="visible" variants={reveal}>
      <motion.div className={lockupClasses} variants={reveal}>
        <div className={markClasses} aria-label="FEAR Lab">
          <span>FEAR</span>
          <span>Lab</span>
        </div>
        <div className={meaningClasses} aria-label="Future Embodied Augmented Realities Lab">
          <span>Future</span>
          <span>Embodied</span>
          <span>Augmented</span>
          <span>Realities Lab</span>
        </div>
      </motion.div>

      <Eyebrow label="HKUST(GZ)" variants={reveal} />

      <motion.h1 className={headlineClasses} variants={reveal}>
        Website under construction.
      </motion.h1>

      <motion.p className={leadClasses} variants={reveal}>
        FEAR Lab is a human-computer interaction laboratory at The Hong Kong
        University of Science and Technology (Guangzhou), led by{' '}
        <a
          className={profileLinkClasses}
          href="http://cma.hkust-gz.edu.cn/faculty-regular/mirjana-prpa/"
          target="_blank"
          rel="noreferrer"
        >
          Prof. Mirjana Prpa
        </a>
        .
      </motion.p>
    </motion.div>
  )
}
