import type { Variants } from 'framer-motion'

export const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1]

export const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: easeCurve }
  }
}

export const staggerIn: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08
    }
  }
}
