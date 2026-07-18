import { motion } from 'framer-motion'
import { chiAcceptedPapers, chiWorkshops, newsMoments } from '../../content/siteContent'
import { reveal, staggerIn } from '../../lib/animations'
import { cn } from '../../lib/cn'
import { Eyebrow } from '../ui/Eyebrow'
import { FocusList } from '../ui/FocusList'

const headlineClasses = cn(
  'm-0 max-w-[8.5ch] text-[clamp(3rem,9vw,6.1rem)] leading-[0.93] tracking-[-0.06em]',
  'max-[700px]:max-w-[7.2ch] max-[700px]:text-[clamp(2.45rem,12vw,3.9rem)] max-[700px]:leading-[0.96]'
)

const leadClasses = cn(
  'm-0 mt-[1.35rem] max-w-[38rem] text-[clamp(1rem,1.6vw,1.2rem)] leading-[1.8] text-ink',
  'max-[700px]:mt-4 max-[700px]:text-[0.98rem] max-[700px]:leading-[1.65]'
)

const spotlightClasses = cn(
  'relative grid content-start gap-[1.2rem] overflow-hidden rounded-[2rem] border p-[clamp(1.4rem,3vw,2rem)]',
  'border-[color-mix(in_srgb,var(--accent)_26%,var(--line))] shadow-site',
  '[background:radial-gradient(circle_at_top_right,color-mix(in_srgb,var(--accent)_18%,transparent),transparent_34%),linear-gradient(180deg,color-mix(in_srgb,var(--panel-strong)_92%,transparent),color-mix(in_srgb,var(--panel)_90%,transparent))]',
  "before:pointer-events-none before:absolute before:inset-0 before:content-['']",
  'before:[background:linear-gradient(135deg,color-mix(in_srgb,white_8%,transparent),transparent_38%),repeating-linear-gradient(120deg,transparent_0_20px,color-mix(in_srgb,var(--accent)_8%,transparent)_20px_21px)]',
  '[&>*]:relative [&>*]:z-[1]'
)

const monoLabelClasses = 'font-mono text-[0.62rem] tracking-[0.18em] text-accent uppercase'

const newsPillClasses = cn(
  'inline-flex min-h-8 items-center rounded-full border px-[0.82rem] pb-[0.3rem] pt-[0.34rem]',
  'border-[color-mix(in_srgb,var(--accent)_42%,transparent)] bg-[color-mix(in_srgb,var(--accent)_14%,transparent)]',
  'font-mono text-[0.66rem] tracking-[0.18em] text-[color-mix(in_srgb,var(--text)_92%,var(--accent)_8%)] uppercase'
)

const metaPillClasses = cn(
  'inline-flex min-h-8 items-center rounded-full border px-[0.84rem]',
  'border-[color-mix(in_srgb,var(--accent)_24%,transparent)] bg-[color-mix(in_srgb,var(--panel-strong)_88%,transparent)]',
  'font-mono text-[0.58rem] tracking-[0.18em] text-[color-mix(in_srgb,var(--text)_88%,var(--accent)_12%)] uppercase'
)

const statClasses = cn(
  'grid gap-[0.35rem] rounded-[1.25rem] border px-[1.05rem] py-4',
  'border-[color-mix(in_srgb,var(--accent)_22%,transparent)] bg-[color-mix(in_srgb,var(--panel-strong)_78%,transparent)]'
)

export function NewsHero() {
  return (
    <motion.section
      className="grid grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] items-stretch gap-[clamp(1.4rem,3vw,2.4rem)] max-[1024px]:grid-cols-1"
      initial="hidden"
      animate="visible"
      variants={staggerIn}
    >
      <motion.div className="grid content-start" variants={staggerIn}>
        <Eyebrow label="News" variants={reveal}>
          <span className={newsPillClasses}>
            Recent Highlight
          </span>
        </Eyebrow>

        <motion.h1 className={headlineClasses} variants={reveal}>
          Meet Us at CHI&apos;26.
        </motion.h1>

        <motion.p className={leadClasses} variants={reveal}>
          Say hi to the FEAR team in Barcelona. This year we are showing up with
          accepted papers and co-organized workshops across the CHI 2026 program.
        </motion.p>

        <motion.div className="mt-[1.3rem] flex flex-wrap gap-[0.65rem]" variants={reveal}>
          {['CHI 2026', 'Barcelona', 'FEAR Lab x HKUST(GZ)'].map((label) => (
            <span
              key={label}
              className={metaPillClasses}
            >
              {label}
            </span>
          ))}
        </motion.div>

        <FocusList items={newsMoments} wide className="mt-6" variants={reveal} />
      </motion.div>

      <motion.aside className={spotlightClasses} variants={reveal}>
        <span className={monoLabelClasses}>At a glance</span>
        <h2 className="m-0 max-w-[12ch] text-[clamp(2rem,4vw,3rem)] leading-[0.95] tracking-[-0.05em]">
          News | Meet Us at CHI&apos;26!
        </h2>
        <p className="m-0 max-w-[30rem] text-base leading-[1.75] text-ink-soft">
          FEAR Lab is bringing two accepted papers and two co-organized workshops
          into this year&apos;s CHI conversation.
        </p>
        <div className="grid grid-cols-2 gap-[0.8rem] max-[700px]:grid-cols-1">
          <NewsStat value={chiAcceptedPapers.length} label="Accepted Papers" />
          <NewsStat value={chiWorkshops.length} label="Co-organized Workshops" />
        </div>
      </motion.aside>
    </motion.section>
  )
}

function NewsStat({ value, label }: { value: number; label: string }) {
  return (
    <div className={statClasses}>
      <span className="text-[clamp(1.8rem,3vw,2.5rem)] font-bold leading-none tracking-[-0.06em]">
        {value}
      </span>
      <span className="font-mono text-[0.54rem] tracking-[0.18em] text-ink-soft uppercase">
        {label}
      </span>
    </div>
  )
}
