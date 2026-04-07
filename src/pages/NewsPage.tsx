import { NewsCard } from '../components/news/NewsCard'
import { NewsHero } from '../components/news/NewsHero'
import { NewsSection } from '../components/news/NewsSection'
import { chiAcceptedPapers, chiWorkshops } from '../content/siteContent'

export function NewsPage() {
  return (
    <section className="news-page">
      <NewsHero />

      <NewsSection
        kicker="Accepted Papers"
        intro="Two FEAR Lab papers are part of the CHI 2026 program, spanning social VR learning support and timing-sensitive human-agent interaction in virtual reality."
      >
        <div className="news-card-grid">
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
        <div className="news-card-grid news-card-grid--compact">
          {chiWorkshops.map((workshop) => (
            <NewsCard
              key={workshop.title}
              label="Workshop"
              title={workshop.title}
              variant="workshop"
            />
          ))}
        </div>
      </NewsSection>
    </section>
  )
}
