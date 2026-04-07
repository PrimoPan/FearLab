import type { PersonRecord } from '../../data/people'

type PersonStageHeadingProps = {
  person: PersonRecord
}

export function PersonStageHeading(props: PersonStageHeadingProps) {
  return (
    <>
      <div className="eyebrow eyebrow--detail">
        <span className="eyebrow__meta">People</span>
      </div>

      <h1 className="person-stage__name">{props.person.name}</h1>

      <p className="person-stage__position">{props.person.positionLabel}</p>
    </>
  )
}
