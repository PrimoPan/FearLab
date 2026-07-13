import { publicationVenueTags } from '../../data/publicationVenues'
import type {
  PublicationRecognition,
  PublicationRecord
} from '../../data/publications'

type PublicationBadgesProps = {
  publication: PublicationRecord
}

function RecognitionBadge({ recognition }: { recognition: PublicationRecognition }) {
  const isAward = recognition.kind === 'award'

  return (
    <span
      className={`publication-badge publication-badge--recognition publication-badge--${recognition.kind}`}
      title={recognition.label}
      aria-label={recognition.label}
    >
      <span className="publication-badge__icon" aria-hidden="true">
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
      className="publication-badges"
      role="group"
      aria-label="Publication venue and recognition"
    >
      <span
        className="publication-badge publication-badge--venue"
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
