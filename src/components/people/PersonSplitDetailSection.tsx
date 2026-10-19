import type { RefObject } from 'react'
import { motion } from 'framer-motion'
import type { PersonRecord } from '../../data/people'
import { easeCurve, staggerIn } from '../../lib/animations'
import { PersonBackButton } from './PersonBackButton'
import { PersonInfoBubbles } from './PersonInfoBubbles'
import { PersonStageHeading } from './PersonStageHeading'

type PersonSplitDetailSectionProps = {
  person: PersonRecord
  detailRef: RefObject<HTMLElement | null>
  onClose: () => void
}

// Keep the entire photograph in its own column; text never overlays the subject.
// Natural document height also keeps long biographies accessible on short screens.
export function PersonSplitDetailSection(props: PersonSplitDetailSectionProps) {
  return (
    <motion.section
      ref={props.detailRef}
      className="relative mt-8 ml-[calc(50%_-_50vw)] w-screen scroll-mt-[calc(var(--site-header-height)_+_1rem)] border-t border-line pt-[clamp(1.5rem,4vw,3rem)] pb-8"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.4, ease: easeCurve }}
    >
      <div className="mx-auto grid w-[min(1600px,calc(100%_-_(var(--gutter)_*_2)))] min-w-0 items-start gap-x-[clamp(1.5rem,4vw,3rem)] gap-y-6 min-[1000px]:grid-cols-[minmax(20rem,0.8fr)_minmax(0,1.6fr)]">
        <header className="min-w-0 [overflow-wrap:anywhere] min-[1000px]:col-start-1 min-[1000px]:row-start-1 min-[1000px]:[&_h1]:text-[clamp(2.6rem,4vw,4rem)]">
          <PersonStageHeading person={props.person} />
          <p className="mt-4 mb-0 hidden text-ink-soft max-[700px]:block">
            {props.person.positionLabel}
          </p>
        </header>

        <figure className="m-0 w-full min-w-0 justify-self-center max-[999px]:w-[calc(100vw_-_1rem)] min-[1000px]:col-start-2 min-[1000px]:row-span-2 min-[1000px]:row-start-1">
          <img
            className="block aspect-square h-auto w-full rounded-[1.4rem] border border-line object-contain [image-orientation:from-image]"
            src={props.person.lifePhoto}
            alt={props.person.lifePhotoAlt}
            width={1254}
            height={1254}
            decoding="async"
          />
        </figure>

        <motion.div
          className="grid min-w-0 grid-cols-1 gap-4 [overflow-wrap:anywhere] min-[1000px]:col-start-1 min-[1000px]:row-start-2"
          initial="hidden"
          animate="visible"
          variants={staggerIn}
        >
          <PersonInfoBubbles person={props.person} expanded />
        </motion.div>

        <div className="min-w-0 min-[1000px]:col-start-1">
          <PersonBackButton onClick={props.onClose} />
        </div>
      </div>
    </motion.section>
  )
}
