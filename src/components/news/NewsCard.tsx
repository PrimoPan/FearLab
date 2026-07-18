import { motion } from 'framer-motion'
import { reveal } from '../../lib/animations'
import { cn } from '../../lib/cn'

type NewsCardMetaPill = {
  label: string
  accent?: boolean
}

type NewsCardProps = {
  label: string
  title: string
  variant?: 'default' | 'workshop'
  compact?: boolean
  metaPills?: readonly NewsCardMetaPill[]
}

const cardClasses = cn(
  'relative grid gap-4 overflow-hidden rounded-[1.6rem] border border-[color-mix(in_srgb,var(--line)_92%,transparent)]',
  'px-[1.3rem] pb-[1.35rem] pt-5 [background:linear-gradient(180deg,color-mix(in_srgb,var(--panel-strong)_94%,transparent),color-mix(in_srgb,var(--panel)_92%,transparent))]',
  'shadow-[0_24px_52px_color-mix(in_srgb,var(--bg)_18%,transparent),inset_0_1px_0_color-mix(in_srgb,white_18%,transparent)]',
  "before:pointer-events-none before:absolute before:inset-0 before:content-[''] [&>*]:relative [&>*]:z-[1]",
  'max-[700px]:min-h-0 max-[700px]:px-4 max-[700px]:pb-[1.1rem] max-[700px]:pt-[1.05rem]'
)

const defaultOverlay = 'before:[background:radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--glow)_18%,transparent),transparent_36%),linear-gradient(180deg,color-mix(in_srgb,white_4%,transparent),transparent_34%)]'
const workshopOverlay = 'before:[background:radial-gradient(circle_at_top_right,color-mix(in_srgb,#ff8b61_16%,transparent),transparent_36%),linear-gradient(180deg,color-mix(in_srgb,white_4%,transparent),transparent_34%)]'

const labelClasses = cn(
  'inline-flex min-h-8 w-fit items-center rounded-full border px-[0.74rem]',
  'border-[color-mix(in_srgb,var(--accent)_22%,transparent)] bg-[color-mix(in_srgb,var(--panel-strong)_86%,transparent)]',
  'font-mono text-[0.56rem] tracking-[0.18em] text-accent uppercase'
)

const metaPillClasses = cn(
  'inline-flex min-h-8 items-center rounded-full border border-[color-mix(in_srgb,var(--line)_96%,transparent)]',
  'bg-[color-mix(in_srgb,var(--panel-strong)_88%,transparent)] px-[0.78rem]',
  'font-mono text-[0.58rem] tracking-[0.18em] text-[color-mix(in_srgb,var(--text)_92%,transparent)] uppercase'
)

const titleClasses = cn(
  'm-0 max-w-[16ch] text-[clamp(1.35rem,2.4vw,2.15rem)] leading-[1.18] tracking-[-0.05em]',
  'max-[700px]:max-w-none max-[700px]:text-[clamp(1.28rem,7vw,1.72rem)]'
)

const accentMetaClasses = cn(
  'border-[color-mix(in_srgb,var(--accent)_26%,transparent)] bg-[color-mix(in_srgb,var(--accent)_20%,transparent)]',
  'text-[color-mix(in_srgb,var(--text)_84%,var(--accent)_16%)]'
)

export function NewsCard(props: NewsCardProps) {
  const isWorkshop = props.variant === 'workshop'

  return (
    <motion.article
      className={cn(
        cardClasses,
        props.compact ? 'min-h-72' : 'min-h-[22rem]',
        isWorkshop ? workshopOverlay : defaultOverlay
      )}
      variants={reveal}
    >
      <span
        className={cn(
          labelClasses,
          isWorkshop && 'border-[color-mix(in_srgb,#ff8b61_28%,transparent)] text-[#ffb28f]'
        )}
      >
        {props.label}
      </span>
      <h3 className={titleClasses}>
        {props.title}
      </h3>

      {props.metaPills?.length ? (
        <div className="mt-auto flex flex-wrap gap-[0.6rem]">
          {props.metaPills.map((pill) => (
            <span
              key={pill.label}
              className={cn(
                metaPillClasses,
                pill.accent && accentMetaClasses
              )}
            >
              {pill.label}
            </span>
          ))}
        </div>
      ) : null}
    </motion.article>
  )
}
