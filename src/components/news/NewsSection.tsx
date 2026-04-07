import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { reveal, staggerIn } from '../../lib/animations'

type NewsSectionProps = {
  kicker: string
  intro: string
  warm?: boolean
  children: ReactNode
}

export function NewsSection(props: NewsSectionProps) {
  return (
    <motion.section
      className={`news-section${props.warm ? ' news-section--warm' : ''}`}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.18 }}
      variants={staggerIn}
    >
      <motion.div className="news-section__header" variants={reveal}>
        <span className="news-section__kicker">{props.kicker}</span>
        <p className="news-section__intro">{props.intro}</p>
      </motion.div>

      {props.children}
    </motion.section>
  )
}
