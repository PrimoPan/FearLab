import { PublicationsHero } from '../components/publications/PublicationsHero'
import { PublicationYearNav } from '../components/publications/PublicationYearNav'
import { PublicationYearSection } from '../components/publications/PublicationYearSection'
import { publications } from '../data/publications'
import { groupPublicationsByYear } from '../lib/publications'

const publicationGroups = groupPublicationsByYear(publications)

export function PublicationsPage() {
  return (
    <section className="publications-page">
      <PublicationsHero />
      <div className="publications-archive-layout">
        <PublicationYearNav groups={publicationGroups} />

        <div className="publications-archive">
          {publicationGroups.map((group) => (
            <PublicationYearSection key={group.year} group={group} />
          ))}
        </div>
      </div>
    </section>
  )
}
