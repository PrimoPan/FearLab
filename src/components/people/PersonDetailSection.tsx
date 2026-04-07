import { useRef, type CSSProperties, type RefObject } from 'react'
import { motion } from 'framer-motion'
import type { PersonRecord } from '../../data/people'
import { easeCurve, reveal, staggerIn } from '../../lib/animations'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { PersonDetailMobileIntro } from './PersonDetailMobileIntro'
import { PersonDetailPanel } from './PersonDetailPanel'
import { PersonInfoBubbles } from './PersonInfoBubbles'
import { PersonStagePoster } from './PersonStagePoster'

type PersonDetailSectionProps = {
  person: PersonRecord
  detailRef: RefObject<HTMLElement | null>
  onClose: () => void
}

export function PersonDetailSection(props: PersonDetailSectionProps) {
  const storyRef = useRef<HTMLElement | null>(null)
  const isMobile = useMediaQuery('(max-width: 700px)')

  const photoScaleStart = isMobile
    ? props.person.photoScaleStartMobile ?? props.person.photoScaleStart ?? 1
    : props.person.photoScaleStartDesktop ?? props.person.photoScaleStart ?? 1
  const photoScaleEnd = isMobile
    ? props.person.photoScaleEndMobile ?? props.person.photoScaleEnd ?? 1.04
    : props.person.photoScaleEndDesktop ?? props.person.photoScaleEnd ?? 1.04

  const storyStyle = {
    '--person-photo-position': props.person.photoPositionDesktop,
    '--person-photo-position-mobile': props.person.photoPositionMobile,
    '--person-panel-shift': props.person.desktopPanelShift ?? '0px',
    '--person-panel-width': props.person.desktopPanelWidth ?? '31rem',
    '--person-copy-width': props.person.desktopCopyWidth ?? '28rem',
    '--person-photo-brightness': props.person.photoBrightness ?? 1.05,
    '--person-backdrop-brightness': props.person.backdropBrightness ?? 0.9
  } as CSSProperties

  const scrollToStory = () => {
    storyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.section
      ref={props.detailRef}
      className={`person-page person-page--${props.person.storySide}${
        props.person.photoContain ? ' person-page--contain' : ''
      }`}
      style={storyStyle}
      initial={{
        opacity: 0,
        scale: 0.985,
        clipPath: 'inset(0 0 100% 0 round 2rem)'
      }}
      animate={{
        opacity: 1,
        scale: 1,
        clipPath: 'inset(0 0 0% 0 round 2rem)'
      }}
      exit={{
        opacity: 0,
        scale: 0.99,
        clipPath: 'inset(0 0 100% 0 round 2rem)'
      }}
      transition={{ duration: 0.62, ease: easeCurve }}
    >
      <section className="person-stage">
        <div className="person-stage__content">
          <PersonDetailPanel person={props.person} onClose={props.onClose} />
          <PersonDetailMobileIntro person={props.person} onScrollToStory={scrollToStory} />
        </div>

        <PersonStagePoster
          person={props.person}
          photoScaleStart={photoScaleStart}
          photoScaleEnd={photoScaleEnd}
        />
      </section>

      <motion.section
        ref={storyRef}
        className="person-story"
        initial="hidden"
        animate="visible"
        variants={staggerIn}
      >
        <motion.div className="person-story__meta" variants={reveal}>
          <p className="person-story__position">{props.person.positionLabel}</p>
        </motion.div>

        <motion.div className="person-bubbles" variants={staggerIn}>
          <PersonInfoBubbles person={props.person} />
        </motion.div>

        <motion.button
          variants={reveal}
          type="button"
          className="back-button"
          onClick={props.onClose}
        >
          Go back to all people
        </motion.button>
      </motion.section>
    </motion.section>
  )
}
