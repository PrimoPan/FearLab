import { motion } from 'framer-motion'
import { ConstructionScene } from '../components/construction/ConstructionScene'
import { HomeBanner } from '../components/home/HomeBanner'
import { homeFocusPoints } from '../content/siteContent'
import { reveal } from '../lib/animations'

export function HomePage() {
  return (
    <section className="page-grid">
      <HomeBanner />
      <ConstructionScene />

      <motion.ul
        className="focus-list"
        initial="hidden"
        animate="visible"
        variants={reveal}
      >
        {homeFocusPoints.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </motion.ul>
    </section>
  )
}
