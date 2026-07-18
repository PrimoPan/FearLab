import { publications2014 } from './publications/2014'
import { publications2015 } from './publications/2015'
import { publications2016 } from './publications/2016'
import { publications2017 } from './publications/2017'
import { publications2018 } from './publications/2018'
import { publications2019 } from './publications/2019'
import { publications2020 } from './publications/2020'
import { publications2022 } from './publications/2022'
import { publications2024 } from './publications/2024'
import { publications2025 } from './publications/2025'
import { publications2026 } from './publications/2026'
import type { PublicationRecord } from './publications/types'

export type {
  PublicationKind,
  PublicationRecognition,
  PublicationRecord
} from './publications/types'

export const publications: readonly PublicationRecord[] = [
  ...publications2026,
  ...publications2025,
  ...publications2024,
  ...publications2022,
  ...publications2020,
  ...publications2019,
  ...publications2018,
  ...publications2017,
  ...publications2016,
  ...publications2015,
  ...publications2014
]
