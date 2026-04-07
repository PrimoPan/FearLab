import { motion } from 'framer-motion'
import { chiAcceptedPapers, chiWorkshops, newsMoments } from '../../content/siteContent'
import { reveal, staggerIn } from '../../lib/animations'

export function NewsHero() {
  return (
    <motion.section
      className="news-hero"
      initial="hidden"
      animate="visible"
      variants={staggerIn}
    >
      <motion.div className="news-hero__copy" variants={staggerIn}>
        <motion.div className="eyebrow" variants={reveal}>
          <span className="eyebrow__meta">News</span>
          <span className="news-pill">Recent Highlight</span>
        </motion.div>

        <motion.h1 className="headline headline--news" variants={reveal}>
          Meet Us at CHI&apos;26.
        </motion.h1>

        <motion.p className="lead news-hero__lead" variants={reveal}>
          Say hi to the FEAR team in Barcelona. This year we are showing up with
          accepted papers and co-organized workshops across the CHI 2026 program.
        </motion.p>

        <motion.div className="news-hero__meta" variants={reveal}>
          <span className="news-meta-pill">CHI 2026</span>
          <span className="news-meta-pill">Barcelona</span>
          <span className="news-meta-pill">FEAR Lab x HKUST(GZ)</span>
        </motion.div>

        <motion.ul className="focus-list news-hero__list" variants={reveal}>
          {newsMoments.map((moment) => (
            <li key={moment}>{moment}</li>
          ))}
        </motion.ul>
      </motion.div>

      <motion.aside className="news-spotlight" variants={reveal}>
        <span className="news-spotlight__label">At a glance</span>
        <h2 className="news-spotlight__headline">News | Meet Us at CHI&apos;26!</h2>
        <p className="news-spotlight__body">
          FEAR Lab is bringing two accepted papers and two co-organized workshops
          into this year&apos;s CHI conversation.
        </p>
        <div className="news-spotlight__stats">
          <div className="news-stat">
            <span className="news-stat__value">{chiAcceptedPapers.length}</span>
            <span className="news-stat__label">Accepted Papers</span>
          </div>
          <div className="news-stat">
            <span className="news-stat__value">{chiWorkshops.length}</span>
            <span className="news-stat__label">Co-organized Workshops</span>
          </div>
        </div>
      </motion.aside>
    </motion.section>
  )
}
