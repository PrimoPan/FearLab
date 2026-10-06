import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { reveal } from '../../lib/animations'

export const projectWidth = 'mx-auto w-[min(var(--page-max),calc(100%_-_(var(--gutter)_*_2)))]'
export const projectLabel = 'font-mono text-[0.65rem] font-normal tracking-[0.16em] text-accent uppercase'
export const projectHeading = 'm-0 text-[clamp(2.15rem,4.5vw,4.1rem)] font-medium leading-[1.04] tracking-[-0.055em]'
export const projectBody = 'm-0 text-[clamp(1rem,1.35vw,1.15rem)] leading-[1.8] text-ink-soft'

export function ProjectReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduceMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : 'hidden'}
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={reveal}
    >
      {children}
    </motion.div>
  )
}
