import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { people } from '../../data/people'
import type { PublicationRecord } from '../../data/publications'
import { reveal } from '../../lib/animations'
import { PublicationBadges } from './PublicationBadges'
import { publicationEntryStyles } from './publicationEntryStyles'

type PublicationEntryProps = {
  publication: PublicationRecord
}

const peopleSlugsByName = new Map(people.map((person) => [person.name, person.slug]))

const authorSeparator = (index: number, count: number) => {
  if (index === 0) {
    return ''
  }

  if (index === count - 1) {
    return count === 2 ? ' and ' : ', and '
  }

  return ', '
}

export function PublicationEntry({ publication }: PublicationEntryProps) {
  const headingId = `publication-${publication.id}`

  return (
    <motion.article
      className={publicationEntryStyles.article}
      data-publication-entry={publication.id}
      aria-labelledby={headingId}
      variants={reveal}
    >
      <div className={publicationEntryStyles.body}>
        <PublicationBadges publication={publication} />

        <h3 id={headingId} className={publicationEntryStyles.title}>
          {publication.title}
        </h3>

        <p className={publicationEntryStyles.authors}>
          {publication.authors.map((author, index) => {
            const personSlug = peopleSlugsByName.get(author)

            return (
              <span key={`${publication.id}-${author}`}>
                {authorSeparator(index, publication.authors.length)}
                {personSlug ? (
                  <Link
                    className={publicationEntryStyles.memberAuthor}
                    to={`/people?member=${personSlug}`}
                    aria-label={`Open ${author}'s profile in People`}
                  >
                    {author}
                  </Link>
                ) : (
                  <span className={publicationEntryStyles.author}>{author}</span>
                )}
              </span>
            )
          })}
        </p>
      </div>

      <div className={publicationEntryStyles.meta}>
        <p className={publicationEntryStyles.venue}>{publication.venue}</p>
        <time className={publicationEntryStyles.date} dateTime={publication.sortDate}>
          {publication.date}
        </time>
        <a
          className={publicationEntryStyles.action}
          href={publication.articleUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View more about ${publication.title} (opens in a new tab)`}
        >
          View more <span aria-hidden="true">↗</span>
        </a>
      </div>
    </motion.article>
  )
}
