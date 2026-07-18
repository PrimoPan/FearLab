import { motion } from 'framer-motion'
import type { PersonRecord } from '../../data/people'
import { reveal } from '../../lib/animations'
import { cn } from '../../lib/cn'

type PersonInfoBubblesProps = {
  person: PersonRecord
}

const bubbleClasses = cn(
  'relative grid min-h-full gap-3 overflow-hidden border px-[1.05rem] pt-4 pb-[1.05rem]',
  'rounded-[1.35rem_1.35rem_1.18rem_0.92rem] border-[color-mix(in_srgb,var(--line)_92%,transparent)]',
  'bg-[linear-gradient(180deg,color-mix(in_srgb,var(--panel-strong)_96%,transparent),color-mix(in_srgb,var(--panel)_92%,transparent))]',
  'shadow-[0_24px_46px_color-mix(in_srgb,var(--bg)_14%,transparent),inset_0_1px_0_color-mix(in_srgb,white_28%,transparent),inset_0_-1px_0_color-mix(in_srgb,black_10%,transparent)]',
  'backdrop-blur-[28px] backdrop-saturate-[145%] before:pointer-events-none before:absolute before:inset-0 before:content-["_"]',
  'before:bg-[radial-gradient(circle_at_top_left,color-mix(in_srgb,white_18%,transparent),transparent_44%),linear-gradient(180deg,color-mix(in_srgb,white_8%,transparent),transparent_40%)]',
  '[&>*]:relative [&>*]:z-[1] max-[700px]:p-4'
)

const labelClasses =
  'font-mono text-[0.58rem] tracking-[0.18em] text-accent uppercase'

const paragraphClasses =
  'm-0 text-[0.98rem] leading-[1.72] text-[color-mix(in_srgb,var(--text)_94%,transparent)]'

export function PersonInfoBubbles(props: PersonInfoBubblesProps) {
  return (
    <>
      {props.person.emails.length > 0 || props.person.website ? (
        <motion.div variants={reveal} className={bubbleClasses}>
          <span className={labelClasses}>Email</span>
          <div className="grid gap-[0.35rem]">
            {props.person.emails.map((email) => (
              <a
                key={email}
                className="break-words text-[0.95rem] leading-[1.5] text-[color-mix(in_srgb,var(--text)_94%,transparent)] no-underline"
                href={`mailto:${email}`}
              >
                {email}
              </a>
            ))}
          </div>

          {props.person.website ? (
            <a
              className="mt-[0.15rem] inline-flex min-h-8 w-fit items-center justify-center rounded-full border border-[color-mix(in_srgb,var(--accent)_24%,var(--line))] bg-[color-mix(in_srgb,var(--panel-strong)_92%,transparent)] px-[0.78rem] text-[0.72rem] tracking-[0.04em] text-[color-mix(in_srgb,var(--text)_94%,transparent)] no-underline"
              href={props.person.website}
              target="_blank"
              rel="noreferrer"
            >
              Visit personal site
            </a>
          ) : null}
        </motion.div>
      ) : null}

      <motion.div variants={reveal} className={bubbleClasses}>
        <span className={labelClasses}>Research Interest</span>
        <p className={paragraphClasses}>{props.person.researchInterest}</p>
      </motion.div>

      <motion.div
        variants={reveal}
        className={cn(
          bubbleClasses,
          'people-bio-scroll col-span-full max-h-[min(13.75rem,27vh)] gap-[0.9rem] overflow-auto pr-[0.9rem] [scrollbar-color:color-mix(in_srgb,var(--accent)_34%,transparent)_color-mix(in_srgb,var(--panel-strong)_48%,transparent)] [scrollbar-gutter:stable] [scrollbar-width:thin]',
          'max-[900px]:col-auto max-[700px]:max-h-none'
        )}
      >
        <span className={labelClasses}>Introduction</span>
        {props.person.bioParagraphs.map((paragraph) => (
          <p key={paragraph} className={paragraphClasses}>
            {paragraph}
          </p>
        ))}
      </motion.div>
    </>
  )
}
