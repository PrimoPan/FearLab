import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { cn } from '../../lib/cn'

type EyebrowProps = {
  label: ReactNode
  variants?: Variants
  children?: ReactNode
  className?: string
}

const wrapperClasses = cn(
  'mb-[1.35rem] flex flex-wrap items-center gap-[0.7rem]',
  'max-[700px]:mb-4'
)

const labelClasses = cn(
  'inline-flex min-h-8 items-center rounded-full border pl-[0.9rem] pr-[0.78rem] pb-[0.32rem] pt-[0.35rem]',
  'border-[color-mix(in_srgb,var(--accent)_38%,transparent)] bg-[color-mix(in_srgb,var(--panel-strong)_76%,transparent)]',
  'font-mono text-[0.68rem] leading-none tracking-[0.18em] text-accent uppercase',
  'shadow-[0_10px_26px_color-mix(in_srgb,var(--bg)_20%,transparent)]',
  'max-[700px]:min-h-7 max-[700px]:pl-[0.7rem] max-[700px]:pr-[0.58rem] max-[700px]:pb-[0.24rem] max-[700px]:pt-[0.28rem] max-[700px]:text-[0.58rem]'
)

export function Eyebrow({ label, variants, children, className }: EyebrowProps) {
  return (
    <motion.div className={cn(wrapperClasses, className)} variants={variants}>
      <span className={labelClasses}>{label}</span>
      {children}
    </motion.div>
  )
}
