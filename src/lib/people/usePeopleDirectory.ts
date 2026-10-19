import { useEffect, useMemo, useState } from 'react'
import { people as curatedPeople, type PersonGroupKey, type PersonRecord } from '../../data/people'
import { applyPersonPresentation } from '../../data/people/presentation'

const roleOrder: PersonGroupKey[] = ['faculty', 'phd', 'mphil', 'ra', 'intern']
const requiredStrings = [
  'slug', 'name', 'positionLabel', 'researchInterest', 'idPhoto', 'lifePhoto',
  'lifePhotoAlt', 'photoPositionDesktop', 'photoPositionMobile'
] as const

type PeopleBootstrapWindow = Window & { __fearlabPeopleRequest?: Promise<unknown> }
// A hard reload can discover and preload approved portraits while JS downloads.
let peopleRequest = (window as PeopleBootstrapWindow).__fearlabPeopleRequest
delete (window as PeopleBootstrapWindow).__fearlabPeopleRequest

function requestPeople() {
  if (!peopleRequest) {
    peopleRequest = fetch('/api/public/people', { credentials: 'omit' })
      .then(response => response.ok ? response.json() as Promise<unknown> : null)
      .catch(() => null)
  }
  return peopleRequest
}

function isPerson(value: unknown): value is PersonRecord {
  if (!value || typeof value !== 'object') return false
  const person = value as Record<string, unknown>
  return requiredStrings.every(field => typeof person[field] === 'string') &&
    typeof person.slug === 'string' && /^member-[a-z0-9_-]+$/.test(person.slug) &&
    roleOrder.includes(person.groupKey as PersonGroupKey) &&
    (person.idPhotoUrl === undefined || typeof person.idPhotoUrl === 'string') &&
    (person.storySide === 'left' || person.storySide === 'right') &&
    Array.isArray(person.emails) && person.emails.every(email => typeof email === 'string') &&
    Array.isArray(person.bioParagraphs) && person.bioParagraphs.every(paragraph => typeof paragraph === 'string')
}

export function usePeopleDirectory() {
  const [approvedPeople, setApprovedPeople] = useState<PersonRecord[]>([])

  useEffect(() => {
    let active = true
    const request = requestPeople()

    async function load() {
      try {
        const result: unknown = await request
        if (!active || !result || typeof result !== 'object') return
        const records = (result as { people?: unknown }).people
        if (Array.isArray(records)) setApprovedPeople(records.filter(isPerson))
      } catch {
        // The curated directory also works when the optional member service is offline.
      } finally {
        // Share simultaneous mounts, but recheck publication on a later visit.
        if (peopleRequest === request) peopleRequest = undefined
      }
    }

    void load()
    return () => { active = false }
  }, [])

  return useMemo(() => {
    const records = new Map(curatedPeople.map(person => [person.slug, person]))
    for (const person of approvedPeople) {
      if (!records.has(person.slug)) records.set(person.slug, applyPersonPresentation(person))
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
