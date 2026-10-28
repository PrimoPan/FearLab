import { RecruitingPosterArtwork } from './RecruitingPosterArtwork'

type RecruitingPosterProps = { onOpen: () => void }

export function RecruitingPoster({ onOpen }: RecruitingPosterProps) {
  return (
    <figure className="m-0 w-full">
      <button
        type="button"
        onClick={onOpen}
        aria-label="Enlarge recruiting poster"
        className="relative block aspect-[1728/1117] w-full cursor-zoom-in overflow-hidden border-0 bg-white p-0 focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-accent"
      >
        <RecruitingPosterArtwork
          alt="FEAR Lab recruitment poster styled as a classic desktop and QQ conversation."
          loading="lazy"
          className="w-full"
        />
      </button>
      <figcaption className="px-[var(--gutter)] py-4 text-center text-sm text-ink-soft">
        Tap the poster to enlarge and explore.
      </figcaption>
    </figure>
  )
}
