import type { PublicationRecord } from '../data/publications'

export type PublicationYearGroup = {
  year: number
  publications: readonly PublicationRecord[]
}

export function groupPublicationsByYear(
  records: readonly PublicationRecord[]
): PublicationYearGroup[] {
  const groups = new Map<number, PublicationRecord[]>()
  const newestFirst = [...records].sort((left, right) =>
    right.sortDate.localeCompare(left.sortDate)
  )

  newestFirst.forEach((publication) => {
    const group = groups.get(publication.year) ?? []
    group.push(publication)
    groups.set(publication.year, group)
  })

  return [...groups.entries()]
    .sort(([leftYear], [rightYear]) => rightYear - leftYear)
    .map(([year, groupedPublications]) => ({
      year,
      publications: groupedPublications
    }))
}
