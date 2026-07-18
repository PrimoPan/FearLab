import { publicationVenueTags } from '../../data/publicationVenues'
import type {
  PublicationRecognition,
  PublicationRecord
} from '../../data/publications'
import { cn } from '../../lib/cn'
import {
  publicationEntryStyles,
  venueToneClasses
} from './publicationEntryStyles'

type PublicationBadgesProps = {
  publication: PublicationRecord
}

function RecognitionBadge({ recognition }: { recognition: PublicationRecognition }) {
  const isAward = recognition.kind === 'award'

  return (
    <span
      className={cn(
        publicationEntryStyles.badge,
        publicationEntryStyles.recognitionBadge,
        !isAward && publicationEntryStyles.nominationBadge
      )}
      title={recognition.label}
      aria-label={recognition.label}
    >
      <span className={publicationEntryStyles.badgeIcon} aria-hidden="true">
        {isAward ? '🏆' : '🏅'}
      </span>
      {isAward ? 'Award' : 'Nominee'}
    </span>
  )
}

export function PublicationBadges({ publication }: PublicationBadgesProps) {
  const venueTag = publicationVenueTags[publication.venueTag]

  return (
    <div
      className={publicationEntryStyles.badges}
      data-publication-badges
      role="group"
      aria-label="Publication venue and recognition"
    >
      <span
        className={cn(
          publicationEntryStyles.badge,
          publicationEntryStyles.venueBadge,
          venueToneClasses[venueTag.tone]
        )}
        data-tone={venueTag.tone}
      >
        {venueTag.label}
      </span>

      {publication.recognitions?.map((recognition) => (
        <RecognitionBadge
          key={`${recognition.kind}-${recognition.label}`}
          recognition={recognition}
        />
      ))}
    </div>
  )
}
