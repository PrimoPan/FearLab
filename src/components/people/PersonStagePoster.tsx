import { motion } from 'framer-motion'
import type { PersonRecord } from '../../data/people'

type PersonStagePosterProps = {
  person: PersonRecord
  photoScaleStart: number
  photoScaleEnd: number
}

export function PersonStagePoster(props: PersonStagePosterProps) {
  return (
    <div className="person-stage__poster">
      {props.person.photoContain ? (
        <motion.img
          className="person-stage__backdrop"
          src={props.person.lifePhoto}
          alt=""
          aria-hidden="true"
          initial={{ scale: 1.04, y: 10 }}
          animate={{ scale: [1.04, 1.08], y: [10, -14] }}
          transition={{
            duration: 18,
            ease: 'easeInOut',
            repeat: Infinity,
            repeatType: 'reverse'
          }}
        />
      ) : null}

      <motion.img
        className="person-stage__image"
        src={props.person.lifePhoto}
        alt={props.person.lifePhotoAlt}
        initial={{ scale: props.photoScaleStart, y: 12 }}
        animate={{ scale: [props.photoScaleStart, props.photoScaleEnd], y: [12, -46] }}
        transition={{
          duration: 16,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'reverse'
        }}
      />

      <div className="person-stage__veil" />
    </div>
  )
}
