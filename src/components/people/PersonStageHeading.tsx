import type { PersonRecord } from '../../data/people'
import { Eyebrow } from '../ui/Eyebrow'

type PersonStageHeadingProps = {
  person: PersonRecord
}

export function PersonStageHeading(props: PersonStageHeadingProps) {
  return (
    <>
      <Eyebrow className="mb-[0.9rem]" label="People" />

      <h1 className="m-0 text-[clamp(2.8rem,7vw,4.6rem)] leading-[0.92] tracking-[-0.06em] max-[700px]:text-[clamp(2.3rem,12vw,3.7rem)]">
        {props.person.name}
      </h1>

      <p className="mt-4 mb-0 text-[clamp(1rem,1.7vw,1.18rem)] leading-[1.6] text-[color-mix(in_srgb,var(--text)_80%,var(--accent)_20%)] max-[700px]:hidden">
        {props.person.positionLabel}
      </p>
    </>
  )
}
