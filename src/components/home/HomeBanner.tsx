import { motion } from 'framer-motion'
import { reveal } from '../../lib/animations'

export function HomeBanner() {
  return (
    <motion.div
      className="hero-copy"
      initial="hidden"
      animate="visible"
      variants={reveal}
    >
      <motion.div className="brand-lockup" variants={reveal}>
        <div className="brand-lockup__mark" aria-label="FEAR Lab">
          <span>FEAR</span>
          <span>Lab</span>
        </div>
        <div
          className="brand-lockup__meaning"
          aria-label="Future Embodied Augmented Realities Lab"
        >
          <span>Future</span>
          <span>Embodied</span>
          <span>Augmented</span>
          <span>Realities Lab</span>
        </div>
      </motion.div>

      <motion.div className="eyebrow" variants={reveal}>
        <span className="eyebrow__meta">HKUST(GZ)</span>
      </motion.div>

      <motion.h1 className="headline" variants={reveal}>
        Website under construction.
      </motion.h1>

      <motion.p className="lead" variants={reveal}>
        FEAR Lab is a human-computer interaction laboratory at The Hong Kong
        University of Science and Technology (Guangzhou), led by{' '}
        <a
          className="inline-link"
          href="http://cma.hkust-gz.edu.cn/faculty-regular/mirjana-prpa/"
          target="_blank"
          rel="noreferrer"
        >
          Prof. Mirjana Prpa
        </a>
        .
      </motion.p>
    </motion.div>
  )
}
