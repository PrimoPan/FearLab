import { motion } from 'framer-motion'
import type { PersonRecord } from '../../data/people'
import { reveal, staggerIn } from '../../lib/animations'
import { PersonStageHeading } from './PersonStageHeading'

type PersonDetailMobileIntroProps = {
  person: PersonRecord
  onScrollToStory: () => void
}

export function PersonDetailMobileIntro(props: PersonDetailMobileIntroProps) {
  return (
    <motion.div
      className="hidden w-full gap-[0.9rem] max-[700px]:grid"
      initial="hidden"
      animate="visible"
      variants={staggerIn}
    >
      <motion.div className="max-w-[min(22rem,100%)]" variants={reveal}>
        <PersonStageHeading person={props.person} />
      </motion.div>

      <motion.button
        variants={reveal}
        type="button"
        className="inline-flex size-[2.9rem] cursor-pointer items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--accent)_48%,transparent)] bg-[color-mix(in_srgb,var(--panel-strong)_80%,transparent)] text-ink shadow-[0_18px_32px_color-mix(in_srgb,var(--bg)_28%,transparent)] transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-accent"
        onClick={props.onScrollToStory}
        aria-label={`Scroll to ${props.person.name}'s profile details`}
      >
        <span
          className="relative inline-flex h-[1.34rem] w-[0.98rem] items-start justify-center rounded-full border-[1.5px] border-[color-mix(in_srgb,var(--text)_86%,transparent)] pt-[0.26rem]"
          aria-hidden="true"
        >
          <motion.span
            className="size-[0.22rem] rounded-full bg-accent"
            animate={{ opacity: [0.45, 1, 0.45], y: [0, 6, 0] }}
            transition={{ duration: 1.85, ease: 'easeInOut', repeat: Infinity }}
          />
          <motion.span
            className="absolute -bottom-[0.76rem] size-2 rotate-45 border-r-[1.5px] border-b-[1.5px] border-[color-mix(in_srgb,var(--text)_88%,transparent)]"
            animate={{ opacity: [0.45, 1, 0.45], y: [0, 4, 0] }}
            transition={{ duration: 1.85, ease: 'easeInOut', repeat: Infinity }}
          />
        </span>
      </motion.button>
    </motion.div>
  )
}
