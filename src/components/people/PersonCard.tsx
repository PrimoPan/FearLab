import type { RefCallback } from 'react'
import { motion } from 'framer-motion'
import type { PersonRecord } from '../../data/people'
import { reveal } from '../../lib/animations'

type PersonCardProps = {
  person: PersonRecord
  isSelected: boolean
  onOpen: (person: PersonRecord) => void
  buttonRef?: RefCallback<HTMLButtonElement>
}

export function PersonCard(props: PersonCardProps) {
  return (
    <motion.div variants={reveal}>
      <button
        ref={props.buttonRef}
        type="button"
        className={`person-card person-card--flat${
          props.isSelected ? ' person-card--selected' : ''
        }`}
        onClick={() => props.onOpen(props.person)}
      >
        <div className="person-card__media">
          <img
            className="person-card__image"
            src={props.person.idPhoto}
            alt={`${props.person.name} ID portrait`}
          />
        </div>
        <div className="person-card__body">
          <p className="person-card__position">{props.person.positionLabel}</p>
          <h3 className="person-card__name">{props.person.name}</h3>
          <span className="person-card__cta">Open profile</span>
        </div>
      </button>
    </motion.div>
  )
}
