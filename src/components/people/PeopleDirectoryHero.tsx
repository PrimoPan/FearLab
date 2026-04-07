import { motion } from 'framer-motion'
import { reveal, staggerIn } from '../../lib/animations'

export function PeopleDirectoryHero() {
  return (
    <motion.div
      className="directory-hero"
      initial="hidden"
      animate="visible"
      variants={staggerIn}
    >
      <motion.div className="eyebrow" variants={reveal}>
        <span className="eyebrow__meta">People</span>
      </motion.div>
      <motion.h1 className="directory-hero__headline" variants={reveal}>
        THE FEARless Team.
      </motion.h1>
      <motion.p className="directory-hero__lead" variants={reveal}>
        A group of loving researchers, developers, and designers who believe
        their bold ideas can gently change the world.
      </motion.p>
    </motion.div>
  )
}
