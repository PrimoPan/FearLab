import assert from 'node:assert/strict'
import test from 'node:test'
import { createDirectoryStore } from './directoryStore.ts'

function deferred() {
  let resolve
  let reject
  const promise = new Promise((accept, fail) => { resolve = accept; reject = fail })
  return { promise, resolve, reject }
}

test('a delayed first load publishes its complete roster atomically', async () => {
  const pending = deferred()
  const store = createDirectoryStore(() => pending.promise, { now: () => 1000 })
  const commits = []
  store.subscribe(() => commits.push(store.getSnapshot()))
  const initial = store.getSnapshot()
  const request = store.refresh()
  await Promise.resolve()
  assert.equal(store.getSnapshot(), initial)
  assert.deepEqual(initial, { records: null, error: false, updatedAt: 0 })
  assert.equal(commits.length, 0)
  pending.resolve([{ name: 'Mandi' }, { name: 'Another member' }])
  await request
  assert.deepEqual(commits, [{
    records: [{ name: 'Mandi' }, { name: 'Another member' }],
    error: false,
    updatedAt: 1000
  }])
})

test('concurrent refresh calls share exactly one request and promise', async () => {
  const pending = deferred()
  let loads = 0
  const store = createDirectoryStore(() => { loads++; return pending.promise })
  const first = store.refresh()
  assert.equal(store.refresh(), first)
  await Promise.resolve()
  assert.equal(loads, 1)
  assert.equal(store.refresh(), first)
  pending.resolve([])
  await first
})

test('fresh revalidation keeps the previous roster until a successful empty roster removes it', async () => {
  let clock = 1000
  let next = Promise.resolve([{ name: 'Mandi' }])
  const store = createDirectoryStore(() => next, { now: () => clock })
  await store.refresh()
  const previous = store.getSnapshot()
  const pending = deferred()
  next = pending.promise
  clock = 2000
  const commits = []
  store.subscribe(() => commits.push(store.getSnapshot()))
  const request = store.refresh()
  assert.equal(store.getSnapshot(), previous)
  assert.equal(commits.length, 0)
  pending.resolve([])
  await request
  assert.deepEqual(store.getSnapshot(), { records: [], error: false, updatedAt: 2000 })
  assert.equal(commits.length, 1)
})

test('fresh failures preserve approved entries and allow a successful retry', async () => {
  let clock = 1000
  let fail = false
  const store = createDirectoryStore(async () => {
    if (fail) throw new Error('offline')
    return [{ name: 'Mandi' }]
  }, { now: () => clock })
  await store.refresh()
  fail = true
  clock = 2000
  await store.refresh()
  assert.deepEqual(store.getSnapshot(), {
    records: [{ name: 'Mandi' }], error: true, updatedAt: 1000
  })
  fail = false
  clock = 3000
  await store.refresh()
  assert.deepEqual(store.getSnapshot(), {
    records: [{ name: 'Mandi' }], error: false, updatedAt: 3000
  })
})

test('a synchronously thrown first load becomes a fallback snapshot and can retry', async () => {
  let fail = true
  const store = createDirectoryStore(() => {
    if (fail) throw new Error('synchronous failure')
    return Promise.resolve([{ name: 'Mandi' }])
  }, { now: () => 1000 })
  await store.refresh()
  assert.deepEqual(store.getSnapshot(), { records: [], error: true, updatedAt: 0 })
  fail = false
  const retry = store.refresh()
  assert.deepEqual(store.getSnapshot(), { records: null, error: false, updatedAt: 0 })
  await retry
  assert.equal(store.getSnapshot().records[0].name, 'Mandi')
})

test('expired approvals are hidden before revalidation, including reentrant refresh calls', async () => {
  let clock = 1000
  let next = Promise.resolve([{ name: 'Mandi' }])
  let loads = 0
  const store = createDirectoryStore(() => { loads++; return next }, {
    maxAgeMs: 5000, now: () => clock
  })
  await store.refresh()
  clock = 6000
  const pending = deferred()
  next = pending.promise
  const commits = []
  let reentrantRequest
  store.subscribe(() => {
    commits.push(store.getSnapshot())
    if (store.getSnapshot().records === null) reentrantRequest = store.refresh()
  })
  const request = store.refresh()
  assert.equal(reentrantRequest, request)
  assert.deepEqual(store.getSnapshot(), { records: null, error: false, updatedAt: 0 })
  pending.reject(new Error('offline'))
  await request
  assert.equal(loads, 2)
  assert.deepEqual(commits, [
    { records: null, error: false, updatedAt: 0 },
    { records: [], error: true, updatedAt: 0 }
  ])
})

test('a roster that expires during a failed request is not retained', async () => {
  let clock = 1000
  let next = Promise.resolve([{ name: 'Mandi' }])
  const store = createDirectoryStore(() => next, { maxAgeMs: 5000, now: () => clock })
  await store.refresh()
  const pending = deferred()
  next = pending.promise
  const request = store.refresh()
  clock = 6000
  pending.reject(new Error('slow offline response'))
  await request
  assert.deepEqual(store.getSnapshot(), { records: [], error: true, updatedAt: 0 })
})

test('unsubscribed listeners no longer receive snapshot commits', async () => {
  const store = createDirectoryStore(async () => [])
  let commits = 0
  const unsubscribe = store.subscribe(() => { commits++ })
  await store.refresh()
  assert.equal(commits, 1)
  unsubscribe()
  await store.refresh()
  assert.equal(commits, 1)
})
