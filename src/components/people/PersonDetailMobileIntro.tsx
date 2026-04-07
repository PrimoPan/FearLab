import { motion } from 'framer-motion'
import type { PersonRecord } from '../../data/people'
import { reveal, staggerIn } from '../../lib/animations'
import { PersonStageHeading } from './PersonStageHeading'

type PersonDetailMobileIntroProps = {
  person: PersonRecord
  onScrollToStory: () => void
}

export function PersonDetailMobileIntro(props: PersonDetailMobileIntroProps) {
  return (
    <motion.div
      className="person-stage__intro"
      initial="hidden"
      animate="visible"
      variants={staggerIn}
    >
      <motion.div className="person-stage__copy" variants={reveal}>
        <PersonStageHeading person={props.person} />
      </motion.div>

      <motion.button
        variants={reveal}
        type="button"
        className="person-stage__scrollcue"
        onClick={props.onScrollToStory}
        aria-label={`Scroll to ${props.person.name}'s profile details`}
      >
        <span className="person-stage__scrollcue-shell" aria-hidden="true">
          <span className="person-stage__scrollcue-dot" />
          <span className="person-stage__scrollcue-arrow" />
        </span>
      </motion.button>
    </motion.div>
  )
}
