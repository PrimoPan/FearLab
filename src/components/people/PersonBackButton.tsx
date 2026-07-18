import { motion } from 'framer-motion'
import { reveal } from '../../lib/animations'

type PersonBackButtonProps = {
  onClick: () => void
}

export function PersonBackButton({ onClick }: PersonBackButtonProps) {
  return (
    <motion.button
      variants={reveal}
      type="button"
      className="mt-[0.6rem] inline-flex min-h-[2.9rem] w-fit cursor-pointer items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--accent)_44%,transparent)] bg-[color-mix(in_srgb,var(--panel-strong)_92%,transparent)] px-[1.15rem] text-ink shadow-[0_18px_36px_color-mix(in_srgb,var(--bg)_20%,transparent)] transition-[transform,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:border-accent max-[700px]:w-full"
      onClick={onClick}
    >
      Go back to all people
    </motion.button>
  )
}
