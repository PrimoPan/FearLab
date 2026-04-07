import { motion } from 'framer-motion'
import type { PersonRecord } from '../../data/people'
import { reveal, staggerIn } from '../../lib/animations'
import { PersonInfoBubbles } from './PersonInfoBubbles'
import { PersonStageHeading } from './PersonStageHeading'

type PersonDetailPanelProps = {
  person: PersonRecord
  onClose: () => void
}

export function PersonDetailPanel(props: PersonDetailPanelProps) {
  return (
    <motion.div
      className="person-stage__panel"
      initial="hidden"
      animate="visible"
      variants={staggerIn}
    >
      <motion.div className="person-stage__copy" variants={reveal}>
        <PersonStageHeading person={props.person} />
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
    </motion.div>
  )
}
