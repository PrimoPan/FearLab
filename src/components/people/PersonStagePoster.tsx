import { motion } from 'framer-motion'
import type { PersonRecord } from '../../data/people'
import { cn } from '../../lib/cn'

type PersonStagePosterProps = {
  person: PersonRecord
  photoScaleStart: number
  photoScaleEnd: number
}

export function PersonStagePoster(props: PersonStagePosterProps) {
  return (
    <div className="relative h-full min-h-[inherit] overflow-hidden bg-[radial-gradient(circle_at_50%_36%,color-mix(in_srgb,var(--glow)_32%,transparent),transparent_54%),color-mix(in_srgb,var(--bg-layer)_54%,transparent)] [grid-area:1/1] max-[700px]:min-h-0 max-[700px]:[grid-area:auto]">
      {props.person.photoContain ? (
        <motion.img
          className="absolute -inset-[6%] h-[112%] w-[112%] object-cover [filter:blur(26px)_saturate(0.88)_brightness(var(--person-backdrop-brightness,0.9))] [object-position:var(--person-photo-position)] [will-change:transform] opacity-[0.68]"
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
        className={cn(
          'absolute -inset-[3%] h-[106%] w-[106%] object-cover [filter:brightness(var(--person-photo-brightness,1.05))] [image-orientation:from-image] [object-position:var(--person-photo-position)] [will-change:transform]',
          'max-[700px]:inset-0 max-[700px]:h-full max-[700px]:w-full max-[700px]:[object-position:var(--person-photo-position-mobile)]',
          props.person.photoContain &&
            'inset-0 h-full w-full object-contain [filter:brightness(var(--person-photo-brightness,1.05))_drop-shadow(0_28px_42px_color-mix(in_srgb,var(--bg)_28%,transparent))]'
        )}
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

      <div
        className={cn(
          'pointer-events-none absolute inset-0',
          props.person.storySide === 'left'
            ? 'bg-[linear-gradient(90deg,rgba(6,7,12,0.88)_0%,rgba(6,7,12,0.66)_26%,rgba(6,7,12,0.24)_50%,rgba(6,7,12,0.06)_100%),linear-gradient(180deg,rgba(6,7,12,0.08)_0%,rgba(6,7,12,0.68)_100%)]'
            : 'bg-[linear-gradient(270deg,rgba(6,7,12,0.88)_0%,rgba(6,7,12,0.66)_26%,rgba(6,7,12,0.24)_50%,rgba(6,7,12,0.06)_100%),linear-gradient(180deg,rgba(6,7,12,0.08)_0%,rgba(6,7,12,0.68)_100%)]',
          'max-[700px]:bg-[linear-gradient(180deg,rgba(6,7,12,0.08)_0%,rgba(6,7,12,0.04)_24%,rgba(6,7,12,0.18)_72%,rgba(6,7,12,0.72)_100%)]'
        )}
      />
    </div>
  )
}
