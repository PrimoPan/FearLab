import { motion } from 'framer-motion'
import { ConstructionScene } from '../components/construction/ConstructionScene'
import { constructionClasses } from '../components/construction/constructionClasses'
import type { ConstructionPageContent } from '../content/siteContent'
import { reveal } from '../lib/animations'

export function ConstructionPage(props: ConstructionPageContent) {
  return (
    <section className={constructionClasses.page}>
      <motion.div
        className={constructionClasses.hero}
        initial="hidden"
        animate="visible"
        variants={reveal}
      >
        <motion.div className={constructionClasses.eyebrow} variants={reveal}>
          <span className={constructionClasses.eyebrowMeta}>{props.kicker}</span>
        </motion.div>

        <motion.h1 className={constructionClasses.headline} variants={reveal}>
          {props.headline}
        </motion.h1>

        <motion.p className={constructionClasses.lead} variants={reveal}>
          {props.body}
        </motion.p>
      </motion.div>

      <ConstructionScene />

      <motion.ul
        className={constructionClasses.focusList}
        initial="hidden"
        animate="visible"
        variants={reveal}
      >
        {props.bullets.map((bullet) => (
          <li className={constructionClasses.focusItem} key={bullet}>
            {bullet}
          </li>
        ))}
      </motion.ul>
    </section>
  )
}
