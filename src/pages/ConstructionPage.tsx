import { motion } from 'framer-motion'
import { ConstructionScene } from '../components/construction/ConstructionScene'
import type { ConstructionPageContent } from '../content/siteContent'
import { reveal } from '../lib/animations'

export function ConstructionPage(props: ConstructionPageContent) {
  return (
    <section className="page-grid page-grid--secondary">
      <motion.div
        className="hero-copy"
        initial="hidden"
        animate="visible"
        variants={reveal}
      >
        <motion.div className="eyebrow" variants={reveal}>
          <span className="eyebrow__meta">{props.kicker}</span>
        </motion.div>

        <motion.h1 className="headline headline--secondary" variants={reveal}>
          {props.headline}
        </motion.h1>

        <motion.p className="lead" variants={reveal}>
          {props.body}
        </motion.p>
      </motion.div>

      <ConstructionScene />

      <motion.ul
        className="focus-list"
        initial="hidden"
        animate="visible"
        variants={reveal}
      >
        {props.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </motion.ul>
    </section>
  )
}
