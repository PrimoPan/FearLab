import { PublicationsHero } from '../components/publications/PublicationsHero'
import { PublicationYearNav } from '../components/publications/PublicationYearNav'
import { PublicationYearSection } from '../components/publications/PublicationYearSection'
import { publicationLayoutStyles } from '../components/publications/publicationLayoutStyles'
import { publications } from '../data/publications'
import { groupPublicationsByYear } from '../lib/publications'

const publicationGroups = groupPublicationsByYear(publications)

export function PublicationsPage() {
  return (
    <section className={publicationLayoutStyles.page} data-page="publications">
      <PublicationsHero />
      <div className={publicationLayoutStyles.archiveLayout}>
        <PublicationYearNav groups={publicationGroups} />

        <div className={publicationLayoutStyles.archive}>
          {publicationGroups.map((group) => (
            <PublicationYearSection key={group.year} group={group} />
          ))}
        </div>
      </div>
    </section>
  )
}
