import { motion } from 'framer-motion'
import { reveal, staggerIn } from '../../lib/animations'
import { publicationLayoutStyles } from './publicationLayoutStyles'

export function PublicationsHero() {
  return (
    <motion.header
      className={publicationLayoutStyles.hero}
      initial="hidden"
      animate="visible"
      variants={staggerIn}
    >
      <motion.div className={publicationLayoutStyles.eyebrow} variants={reveal}>
        <span className={publicationLayoutStyles.eyebrowMeta}>Research archive</span>
      </motion.div>

      <motion.div className={publicationLayoutStyles.heroCopy} variants={reveal}>
        <h1 className={publicationLayoutStyles.heroHeadline}>Publications</h1>
        <p className={publicationLayoutStyles.heroLead}>
          A complete record of our research, with every title and author shown in full.
        </p>
      </motion.div>
    </motion.header>
  )
}
