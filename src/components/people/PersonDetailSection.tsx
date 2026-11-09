import { useRef, type CSSProperties, type RefObject } from 'react'
import { motion } from 'framer-motion'
import type { PersonRecord } from '../../data/people'
import { easeCurve, reveal, staggerIn } from '../../lib/animations'
import { cn } from '../../lib/cn'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { PersonBackButton } from './PersonBackButton'
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
  const isMobile = useMediaQuery('(width < 700px)')
  const splitDesktop = props.person.desktopLayout === 'split' && !isMobile

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
    '--person-mobile-photo-aspect': props.person.mobilePhotoAspectRatio,
    '--person-photo-brightness': props.person.photoBrightness ?? 1.05,
    '--person-backdrop-brightness': props.person.backdropBrightness ?? 0.9
  } as CSSProperties

  const scrollToStory = () => {
    storyRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <motion.section
      ref={props.detailRef}
      className="relative z-[1] mt-8 ml-[calc(50%_-_50vw)] w-screen scroll-mt-[calc(var(--site-header-height)_+_0.7rem)] overflow-hidden border-y border-[color-mix(in_srgb,var(--line)_92%,transparent)] bg-[linear-gradient(180deg,color-mix(in_srgb,var(--bg-layer)_56%,transparent),color-mix(in_srgb,var(--bg)_94%,transparent))] pb-0"
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
      {splitDesktop ? (
        <section className="mx-auto grid min-h-[calc(100svh-var(--site-header-height))] w-[min(var(--page-max),calc(100%_-_(var(--gutter)_*_2)))] grid-cols-[minmax(0,2fr)_minmax(0,3fr)] items-center gap-[clamp(1rem,3vw,3rem)] py-[clamp(1.5rem,4vw,3.5rem)]">
          <PersonDetailPanel person={props.person} onClose={props.onClose} />
          <img
            src={props.person.lifePhoto}
            alt={props.person.lifePhotoAlt}
            className="aspect-[4/5] w-full rounded-[1.4rem] object-cover [object-position:var(--person-photo-position)] min-[1100px]:aspect-[4/3]"
          />
        </section>
      ) : (
        <section className={cn(
          'relative isolate grid h-[calc(100svh-var(--site-header-height))] min-h-[calc(100svh-var(--site-header-height))] bg-[color-mix(in_srgb,var(--bg-layer)_42%,transparent)] max-[700px]:min-h-[calc(100svh-6.8rem)] max-[700px]:grid-rows-[auto_minmax(0,1fr)]',
          props.person.mobilePhotoAspectRatio && 'max-[700px]:h-auto max-[700px]:min-h-0 max-[700px]:grid-rows-[auto_auto]'
        )}>
          <div
            className={cn(
              'relative z-[1] mx-auto flex h-full min-h-0 items-stretch pt-[clamp(1rem,2.4vw,1.8rem)] [grid-area:1/1]',
              'w-[min(var(--page-max),calc(100%_-_(var(--gutter)_*_2)))]',
              props.person.storySide === 'left' ? 'justify-start' : 'justify-end',
              'max-[900px]:w-[calc(100%_-_(var(--gutter)_*_2))]',
              'max-[700px]:block max-[700px]:h-full max-[700px]:min-h-0 max-[700px]:justify-start max-[700px]:pt-4 max-[700px]:pb-[0.8rem] max-[700px]:[grid-area:auto]'
            )}
          >
            <PersonDetailPanel person={props.person} onClose={props.onClose} />
            <PersonDetailMobileIntro person={props.person} onScrollToStory={scrollToStory} />
          </div>

          <PersonStagePoster
            person={props.person}
            photoSrc={isMobile && props.person.lifePhotoMobile ? props.person.lifePhotoMobile : props.person.lifePhoto}
            photoScaleStart={photoScaleStart}
            photoScaleEnd={photoScaleEnd}
          />
        </section>
      )}

      <motion.section
        ref={storyRef}
        className="mx-auto hidden w-[min(var(--page-max),calc(100%_-_(var(--gutter)_*_2)))] gap-4 pt-[clamp(1.35rem,3vw,2.4rem)] pb-[clamp(2.4rem,5vw,4rem)] max-[700px]:grid max-[700px]:pt-[1.15rem] max-[700px]:pb-4"
        initial="hidden"
        animate="visible"
        variants={staggerIn}
      >
        <motion.div className="hidden max-[700px]:block" variants={reveal}>
          <p className="m-0 text-[0.7rem] text-accent">{props.person.positionLabel}</p>
        </motion.div>

        <motion.div
          className="grid gap-[0.8rem] [grid-template-columns:repeat(2,minmax(0,1fr))] max-[900px]:grid-cols-1"
          variants={staggerIn}
        >
          <PersonInfoBubbles person={props.person} />
        </motion.div>

        <PersonBackButton onClick={props.onClose} />
      </motion.section>
    </motion.section>
  )
}
