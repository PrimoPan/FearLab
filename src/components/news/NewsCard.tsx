import { motion } from 'framer-motion'
import { reveal } from '../../lib/animations'

type NewsCardMetaPill = {
  label: string
  accent?: boolean
}

type NewsCardProps = {
  label: string
  title: string
  variant?: 'default' | 'workshop'
  metaPills?: readonly NewsCardMetaPill[]
}

export function NewsCard(props: NewsCardProps) {
  return (
    <motion.article
      className={`news-card${props.variant === 'workshop' ? ' news-card--workshop' : ''}`}
      variants={reveal}
    >
      <span className="news-card__label">{props.label}</span>
      <h3 className="news-card__title">{props.title}</h3>

      {props.metaPills?.length ? (
        <div className="news-card__meta">
          {props.metaPills.map((pill) => (
            <span
              key={pill.label}
              className={`news-card__meta-pill${
                pill.accent ? ' news-card__meta-pill--accent' : ''
              }`}
            >
              {pill.label}
            </span>
          ))}
        </div>
      ) : null}
    </motion.article>
  )
}
