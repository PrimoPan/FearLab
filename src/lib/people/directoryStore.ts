export interface DirectorySnapshot<T> {
  records: T[] | null
  error: boolean
  updatedAt: number
}

interface DirectoryStoreOptions {
  maxAgeMs?: number
  now?: () => number
}

export function createDirectoryStore<T>(
  load: () => Promise<T[]>,
  { maxAgeMs = 60_000, now = Date.now }: DirectoryStoreOptions = {}
) {
  let snapshot: DirectorySnapshot<T> = { records: null, error: false, updatedAt: 0 }
  let hasSuccessfulSnapshot = false
  let inFlight: Promise<void> | null = null
  const listeners = new Set<() => void>()

  const isFresh = () => hasSuccessfulSnapshot && now() - snapshot.updatedAt < maxAgeMs
  const notify = () => { for (const listener of listeners) listener() }

  function refresh(): Promise<void> {
    if (inFlight) return inFlight

    const invalidate = !isFresh() && (snapshot.records !== null || snapshot.error)
    if (invalidate) {
      snapshot = { records: null, error: false, updatedAt: 0 }
      hasSuccessfulSnapshot = false
    }

    // Assign before calling the loader or notifying subscribers: both can
    // synchronously request another refresh, which must share this request.
    const request = Promise.resolve().then(load).then(
      records => {
        snapshot = { records, error: false, updatedAt: now() }
        hasSuccessfulSnapshot = true
        notify()
      },
      () => {
        if (isFresh()) snapshot = { ...snapshot, error: true }
        else {
          snapshot = { records: [], error: true, updatedAt: 0 }
          hasSuccessfulSnapshot = false
        }
        notify()
      }
    ).finally(() => {
      if (inFlight === request) inFlight = null
    })
    inFlight = request
    if (invalidate) notify()
    return request
  }

  return {
    getSnapshot: () => snapshot,
    subscribe(listener: () => void) {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
    refresh
  }
}
