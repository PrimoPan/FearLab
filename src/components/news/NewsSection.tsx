import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { reveal, staggerIn } from '../../lib/animations'
import { cn } from '../../lib/cn'

type NewsSectionProps = {
  kicker: string
  intro: string
  warm?: boolean
  children: ReactNode
}

const kickerClasses = cn(
  'inline-flex min-h-8 w-fit items-center rounded-full border px-[0.86rem]',
  'border-[color-mix(in_srgb,var(--accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]',
  'font-mono text-[0.6rem] tracking-[0.18em] text-accent uppercase'
)

const warmKickerClasses = cn(
  'border-[color-mix(in_srgb,#ff8b61_34%,transparent)]',
  'bg-[color-mix(in_srgb,#ff8b61_14%,transparent)] text-[#ffb28f]'
)

export function NewsSection(props: NewsSectionProps) {
  return (
    <motion.section
      className="mt-8 grid gap-[1.35rem] border-t border-line pt-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={staggerIn}
    >
      <motion.div className="grid max-w-[52rem] gap-[0.82rem]" variants={reveal}>
        <span
          className={cn(
            kickerClasses,
            props.warm && warmKickerClasses
          )}
        >
          {props.kicker}
        </span>
        <p className="m-0 text-base leading-[1.72] text-ink-soft">{props.intro}</p>
      </motion.div>

      {props.children}
    </motion.section>
  )
}
