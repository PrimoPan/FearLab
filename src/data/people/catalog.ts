import { euphieYang } from './members/euphieYang'
import { hongniYe } from './members/hongniYe'
import { mengxuPan } from './members/mengxuPan'
import { mirjanaPrpa } from './members/mirjanaPrpa'
import { primoPan } from './members/primoPan'
import { qiyuanCheng } from './members/qiyuanCheng'
import { xingyuGao } from './members/xingyuGao'
import { ziruiZhao } from './members/ziruiZhao'
import type { PersonGroup, PersonGroupKey, PersonRecord } from './types'

const roleOrder: PersonGroupKey[] = ['faculty', 'phd', 'mphil', 'ra', 'intern']

const groupLabels: Record<PersonGroupKey, string> = {
  faculty: 'Faculty',
  phd: 'PhD Students',
  mphil: 'MPhil Students',
  ra: 'Research Assistants',
  intern: 'Research Interns'
}

const peopleCatalog: PersonRecord[] = [
  mirjanaPrpa,
  hongniYe,
  mengxuPan,
  primoPan,
  qiyuanCheng,
  xingyuGao,
  ziruiZhao,
  euphieYang
]

export const people: PersonRecord[] = [...peopleCatalog].sort((left, right) => {
  const orderDelta = roleOrder.indexOf(left.groupKey) - roleOrder.indexOf(right.groupKey)

  return orderDelta || left.name.localeCompare(right.name)
})

export const peopleBySlug = Object.fromEntries(
  people.map((person) => [person.slug, person])
) as Record<string, PersonRecord>

export const peopleGroups: PersonGroup[] = roleOrder.map((key) => ({
  key,
  label: groupLabels[key],
  people: people.filter((person) => person.groupKey === key)
}))
