import { useEffect, useMemo, useState } from 'react'
import { people as curatedPeople, type PersonGroupKey, type PersonRecord } from '../../data/people'

const roleOrder: PersonGroupKey[] = ['faculty', 'phd', 'mphil', 'ra', 'intern']
const requiredStrings = [
  'slug', 'name', 'positionLabel', 'researchInterest', 'idPhoto', 'lifePhoto',
  'lifePhotoAlt', 'photoPositionDesktop', 'photoPositionMobile'
] as const

function isPerson(value: unknown): value is PersonRecord {
  if (!value || typeof value !== 'object') return false
  const person = value as Record<string, unknown>
  return requiredStrings.every(field => typeof person[field] === 'string') &&
    typeof person.slug === 'string' && /^member-[a-z0-9_-]+$/.test(person.slug) &&
    roleOrder.includes(person.groupKey as PersonGroupKey) &&
    (person.storySide === 'left' || person.storySide === 'right') &&
    Array.isArray(person.emails) && person.emails.every(email => typeof email === 'string') &&
    Array.isArray(person.bioParagraphs) && person.bioParagraphs.every(paragraph => typeof paragraph === 'string')
}

export function usePeopleDirectory() {
  const [approvedPeople, setApprovedPeople] = useState<PersonRecord[]>([])

  useEffect(() => {
    const controller = new AbortController()
    let active = true

    async function load() {
      try {
        const response = await fetch('/api/public/people', {
          signal: controller.signal,
          credentials: 'omit'
        })
        if (!response.ok) return
        const result: unknown = await response.json()
        if (!active || !result || typeof result !== 'object') return
        const records = (result as { people?: unknown }).people
        if (Array.isArray(records)) setApprovedPeople(records.filter(isPerson))
      } catch {
        // The curated directory also works when the optional member service is offline.
      }
    }

    void load()
    return () => { active = false; controller.abort() }
  }, [])

  return useMemo(() => {
    const records = new Map(curatedPeople.map(person => [person.slug, person]))
    for (const person of approvedPeople) {
      if (!records.has(person.slug)) records.set(person.slug, person)
    }
    const people = [...records.values()].sort((left, right) =>
      roleOrder.indexOf(left.groupKey) - roleOrder.indexOf(right.groupKey) ||
      (left.directoryOrder ?? 0) - (right.directoryOrder ?? 0) ||
      left.name.localeCompare(right.name)
    )
    const peopleBySlug = Object.fromEntries(people.map(person => [person.slug, person])) as Record<string, PersonRecord>
    return { people, peopleBySlug }
  }, [approvedPeople])
}
