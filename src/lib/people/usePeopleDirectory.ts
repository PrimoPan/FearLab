import { useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import { people as curatedPeople, type PersonGroupKey, type PersonRecord } from '../../data/people'
import { applyPersonPresentation } from '../../data/people/presentation'
import { createDirectoryStore } from './directoryStore'

const roleOrder: PersonGroupKey[] = ['faculty', 'phd', 'mphil', 'ra', 'intern']
const requiredStrings = [
  'slug', 'name', 'positionLabel', 'researchInterest', 'idPhoto', 'lifePhoto',
  'lifePhotoAlt', 'photoPositionDesktop', 'photoPositionMobile'
] as const

type PeopleBootstrapWindow = Window & { __fearlabPeopleRequest?: Promise<unknown> }
// A hard reload can discover and preload approved portraits while JS downloads.
let bootstrapRequest = (window as PeopleBootstrapWindow).__fearlabPeopleRequest
delete (window as PeopleBootstrapWindow).__fearlabPeopleRequest

async function requestPeople(): Promise<unknown> {
  const controller = new AbortController()
  const request = bootstrapRequest ?? fetch('/api/public/people', {
    credentials: 'omit', signal: controller.signal
  }).then(response => response.ok ? response.json() as Promise<unknown> : null)
  bootstrapRequest = undefined
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      request,
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          controller.abort()
          reject(new Error('The people directory timed out'))
        }, 10_000)
      })
    ])
  } finally {
    clearTimeout(timer)
  }
}

// Decode before revealing the first roster, with a bound for offline images.
// The card keeps its normal image fallback if a signed URL cannot load.
function preparePortrait(person: PersonRecord): Promise<void> {
  return new Promise(resolve => {
    const image = new Image()
    const finish = () => {
      clearTimeout(timer)
      image.onload = image.onerror = null
      resolve()
    }
    const timer = setTimeout(finish, 4_000)
    image.referrerPolicy = 'no-referrer'
    image.fetchPriority = window.location.pathname.startsWith('/people') ? 'auto' : 'low'
    image.onload = () => { void image.decode().catch(() => undefined).then(finish) }
    image.onerror = () => {
      if (image.getAttribute('src') !== person.idPhoto) image.src = person.idPhoto
      else finish()
    }
    image.src = person.idPhotoUrl ?? person.idPhoto
  })
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

const directoryMaxAge = 60_000
const directory = createDirectoryStore<PersonRecord>(async () => {
  const curatedPortraits = Promise.all(curatedPeople.map(preparePortrait))
  const result = await requestPeople()
  if (!result || typeof result !== 'object' || !Array.isArray((result as { people?: unknown }).people)) {
    throw new Error('The people directory is unavailable')
  }
  const approvedPeople = (result as { people: unknown[] }).people.filter(isPerson)
  await Promise.all([curatedPortraits, ...approvedPeople.map(preparePortrait)])
  return approvedPeople
}, { maxAgeMs: directoryMaxAge })

export function prefetchPeopleDirectory() {
  const snapshot = directory.getSnapshot()
  if (snapshot.records === null || (snapshot.updatedAt > 0 && Date.now() - snapshot.updatedAt >= directoryMaxAge)) {
    void directory.refresh()
  }
}

export function usePeopleDirectory() {
  const enteredAt = useRef(Date.now())
  const snapshot = useSyncExternalStore(directory.subscribe, directory.getSnapshot)

  useEffect(() => {
    // Keep the last complete roster during a short visit; every entry still
    // revalidates publication. Older snapshots must be checked before display.
    void directory.refresh()
  }, [])

  const result = useMemo(() => {
    const records = new Map(curatedPeople.map(person => [person.slug, person]))
    for (const person of snapshot.records ?? []) {
      if (!records.has(person.slug)) records.set(person.slug, applyPersonPresentation(person))
    }
    const people = [...records.values()].sort((left, right) =>
      roleOrder.indexOf(left.groupKey) - roleOrder.indexOf(right.groupKey) ||
      (left.directoryOrder ?? 0) - (right.directoryOrder ?? 0) ||
      left.name.localeCompare(right.name)
    )
    const peopleBySlug = Object.fromEntries(people.map(person => [person.slug, person])) as Record<string, PersonRecord>
    return { people, peopleBySlug }
  }, [snapshot.records])

  const isStale = snapshot.updatedAt > 0 && enteredAt.current - snapshot.updatedAt >= directoryMaxAge
  return { ...result, isLoading: snapshot.records === null || isStale, error: snapshot.error, retry: directory.refresh }
}
