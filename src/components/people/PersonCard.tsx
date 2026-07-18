import type { RefCallback } from 'react'
import { motion } from 'framer-motion'
import type { PersonRecord } from '../../data/people'
import { reveal } from '../../lib/animations'
import { cn } from '../../lib/cn'

type PersonCardProps = {
  person: PersonRecord
  isSelected: boolean
  onOpen: (person: PersonRecord) => void
  buttonRef?: RefCallback<HTMLButtonElement>
}

export function PersonCard(props: PersonCardProps) {
  return (
    <motion.div className="h-full" variants={reveal}>
      <button
        ref={props.buttonRef}
        type="button"
        className="group flex h-full w-full cursor-pointer flex-col items-stretch overflow-visible border-0 bg-transparent p-0 text-left text-inherit no-underline transition-transform duration-200 ease-out hover:-translate-y-[3px]"
        onClick={() => props.onOpen(props.person)}
      >
        <div
          className={cn(
            'relative aspect-[0.86] w-full overflow-hidden rounded-[1.35rem] border',
            'border-[color-mix(in_srgb,var(--line)_80%,transparent)] bg-[color-mix(in_srgb,var(--panel-strong)_78%,transparent)]',
            'shadow-[0_20px_44px_color-mix(in_srgb,var(--bg)_22%,transparent)]',
            'max-[520px]:aspect-[0.9]',
            props.isSelected &&
              'border-[color-mix(in_srgb,var(--accent)_78%,transparent)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_38%,transparent),0_22px_52px_color-mix(in_srgb,var(--bg)_26%,transparent)]'
          )}
        >
          <img
            className="h-full w-full scale-[1.02] object-cover object-top [image-orientation:from-image] transition-transform duration-[260ms] group-hover:scale-[1.06]"
            src={props.person.idPhoto}
            alt={`${props.person.name} ID portrait`}
          />
        </div>
        <div className="grid w-full gap-[0.38rem] px-[0.05rem] pt-[0.95rem]">
          <p className="m-0 font-mono text-[0.66rem] tracking-[0.18em] text-accent uppercase">
            {props.person.positionLabel}
          </p>
          <h3 className="m-0 text-[clamp(1.2rem,2vw,1.55rem)] leading-[1.08] tracking-[-0.03em]">
            {props.person.name}
          </h3>
          <span className="mt-[0.35rem] inline-flex items-center font-mono text-[0.58rem] tracking-[0.18em] text-ink-soft uppercase">
            Open profile
          </span>
        </div>
      </button>
    </motion.div>
  )
}
