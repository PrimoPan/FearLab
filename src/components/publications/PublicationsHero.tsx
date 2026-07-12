import { motion } from 'framer-motion'
import { reveal, staggerIn } from '../../lib/animations'

export function PublicationsHero() {
  return (
    <motion.header
      className="publications-hero"
      initial="hidden"
      animate="visible"
      variants={staggerIn}
    >
      <motion.div className="eyebrow" variants={reveal}>
        <span className="eyebrow__meta">Research archive</span>
      </motion.div>

      <motion.div className="publications-hero__copy" variants={reveal}>
        <h1 className="publications-hero__headline">Publications</h1>
        <p className="publications-hero__lead">
          A complete record of our research, with every title and author shown in full.
        </p>
      </motion.div>
    </motion.header>
  )
}
