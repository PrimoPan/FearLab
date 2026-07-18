import { motion } from 'framer-motion'
import type { PersonRecord } from '../../data/people'
import { reveal, staggerIn } from '../../lib/animations'
import { PersonBackButton } from './PersonBackButton'
import { PersonInfoBubbles } from './PersonInfoBubbles'
import { PersonStageHeading } from './PersonStageHeading'

type PersonDetailPanelProps = {
  person: PersonRecord
  onClose: () => void
}

export function PersonDetailPanel(props: PersonDetailPanelProps) {
  return (
    <motion.div
      className="grid h-full min-h-0 w-[min(var(--person-panel-width,31rem),100%)] grid-rows-[auto_minmax(0,1fr)_auto] gap-[0.78rem] overflow-hidden [transform:translateX(var(--person-panel-shift,0px))] max-[700px]:hidden"
      initial="hidden"
      animate="visible"
      variants={staggerIn}
    >
      <motion.div
        className="max-w-[min(var(--person-copy-width,28rem),100%)] rounded-[1.4rem] border border-[color-mix(in_srgb,var(--line)_96%,transparent)] bg-[color-mix(in_srgb,var(--panel-strong)_86%,transparent)] px-[1.15rem] pt-[1.05rem] pb-[1.22rem] shadow-site backdrop-blur-[18px]"
        variants={reveal}
      >
        <PersonStageHeading person={props.person} />
      </motion.div>

      <motion.div
        className="grid min-h-0 content-end gap-[0.8rem] self-end [grid-template-columns:repeat(2,minmax(0,1fr))] max-[900px]:grid-cols-1"
        variants={staggerIn}
      >
        <PersonInfoBubbles person={props.person} />
      </motion.div>

      <PersonBackButton onClick={props.onClose} />
    </motion.div>
  )
}
