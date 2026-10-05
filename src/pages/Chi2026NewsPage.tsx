import { Link } from 'react-router-dom'
import { NewsCard } from '../components/news/NewsCard'
import { NewsHero } from '../components/news/NewsHero'
import { NewsSection } from '../components/news/NewsSection'
import { chiAcceptedPapers, chiWorkshops } from '../content/siteContent'
import { cn } from '../lib/cn'

const pageClasses = cn(
  'relative z-[1] mx-auto w-[min(var(--page-max),calc(100%_-_(var(--gutter)_*_2)))]',
  'pb-16 pt-[clamp(1.6rem,4vw,2.8rem)] max-[700px]:pt-[1.3rem]'
)

const cardGridClasses = 'grid grid-cols-2 gap-4 max-[900px]:grid-cols-1'

export function Chi2026NewsPage() {
  return (
    <section className={pageClasses}>
      <Link
        to="/news"
        className="mb-7 inline-flex min-h-11 items-center gap-2 text-sm text-ink-soft no-underline transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <span aria-hidden="true">←</span> All news
      </Link>
      <NewsHero />

      <NewsSection
        kicker="Accepted Papers"
        intro="Two FEAR Lab papers are part of the CHI 2026 program, spanning social VR learning support and timing-sensitive human-agent interaction in virtual reality."
      >
        <div className={cardGridClasses}>
          {chiAcceptedPapers.map((paper) => (
            <NewsCard
              key={paper.title}
              label={paper.track}
              title={paper.title}
              metaPills={[
                { label: paper.date },
                { label: paper.time },
                { label: paper.room, accent: true }
              ]}
            />
          ))}
        </div>
      </NewsSection>

      <NewsSection
        kicker="Co-organized Workshops"
        intro="The team is also helping shape two workshop conversations around embodied AI design and responsible AI personas in human-centered research."
        warm
      >
        <div className={cardGridClasses}>
          {chiWorkshops.map((workshop) => (
            <NewsCard
              key={workshop.title}
              label="Workshop"
              title={workshop.title}
              variant="workshop"
              compact
            />
          ))}
        </div>
      </NewsSection>
    </section>
  )
}
