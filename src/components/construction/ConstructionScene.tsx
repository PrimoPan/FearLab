import { motion } from 'framer-motion'
import { easeCurve } from '../../lib/animations'
import { cn } from '../../lib/cn'
import { ConstructionCat } from './ConstructionCat'
import { constructionClasses } from './constructionClasses'

const absolutePart = 'absolute block'
const frameEdge = cn(
  absolutePart,
  'rounded-full bg-[color-mix(in_srgb,var(--text)_18%,var(--line))]'
)
const buildRow = cn(
  'absolute right-[1.4rem] left-[1.4rem] h-8 origin-left rounded-2xl',
  'bg-[repeating-linear-gradient(135deg,color-mix(in_srgb,var(--accent)_86%,transparent)_0_14px,color-mix(in_srgb,var(--accent-strong)_90%,transparent)_14px_28px)]',
  'shadow-[0_0_0_1px_color-mix(in_srgb,var(--accent)_22%,transparent)]',
  'animate-[build-in_2.8s_ease-in-out_infinite] motion-reduce:animate-none'
)

export function ConstructionScene() {
  return (
    <motion.div
      className={constructionClasses.panel}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.16, duration: 0.8, ease: easeCurve }}
      aria-label="Construction animation"
    >
      <div
        className={cn(
          'absolute top-[2.2rem] left-[2.1rem] h-48 w-64',
          'max-[700px]:top-[1.2rem] max-[700px]:left-[1.1rem]',
          'max-[700px]:origin-top-left max-[700px]:scale-[.86]'
        )}
        aria-hidden="true"
      >
        <span
          className={cn(
            absolutePart,
            'bottom-0 left-0 h-[8.8rem] w-[.9rem] rounded-full',
            'bg-[color-mix(in_srgb,var(--text)_12%,var(--accent))]'
          )}
        />
        <span
          className={cn(
            absolutePart,
            'top-0 left-[.4rem] h-[.8rem] w-48 origin-left rounded-full',
            'bg-[color-mix(in_srgb,var(--text)_10%,var(--accent))]',
            'animate-[arm-sway_4.6s_ease-in-out_infinite] motion-reduce:animate-none'
          )}
        />
        <span
          className={cn(
            absolutePart,
            'top-[-.05rem] left-0 h-[.95rem] w-9 rounded-full',
            'bg-[color-mix(in_srgb,var(--accent)_74%,black_6%)]'
          )}
        />
        <span
          className={cn(
            absolutePart,
            'top-[.35rem] left-40 h-[4.8rem] w-0.5',
            'bg-[color-mix(in_srgb,var(--text)_54%,transparent)]',
            'animate-[cable-drop_2.6s_ease-in-out_infinite] motion-reduce:animate-none'
          )}
        />
        <span
          className={cn(
            absolutePart,
            'top-20 left-[9.55rem] h-[1.05rem] w-[.9rem] rounded-b-[.8rem]',
            'border-2 border-t-0 border-[color-mix(in_srgb,var(--accent)_70%,var(--text)_10%)]',
            'animate-[cable-drop_2.6s_ease-in-out_infinite] motion-reduce:animate-none'
          )}
        />
      </div>

      <div
        className={cn(
          'absolute bottom-[1.02rem] left-[clamp(.95rem,3vw,1.6rem)] z-[3] h-28 w-[10.5rem]',
          'animate-[cat-bob_3.1s_ease-in-out_infinite] motion-reduce:animate-none',
          'max-[700px]:bottom-[.42rem] max-[700px]:left-[.12rem]',
          'max-[700px]:origin-bottom-left max-[700px]:[transform:scale(.58)]'
        )}
        aria-hidden="true"
      >
        <ConstructionCat />
      </div>

      <div
        className={cn(
          'absolute right-[clamp(1.1rem,4vw,2.6rem)] bottom-12 z-[2] h-64',
          'w-[min(24rem,calc(100%-4.5rem))]',
          'max-[700px]:right-3 max-[700px]:bottom-[1.18rem] max-[700px]:left-[4.95rem]',
          'max-[700px]:h-[9.35rem] max-[700px]:w-auto'
        )}
        aria-hidden="true"
      >
        <span className={cn(frameEdge, 'top-0 left-0 h-full w-[.85rem]')} />
        <span className={cn(frameEdge, 'top-0 right-0 h-full w-[.85rem]')} />
        <span className={cn(frameEdge, 'right-0 bottom-0 left-0 h-[.85rem]')} />

        <span className={cn(buildRow, 'bottom-6 [animation-delay:0s]')} />
        <span className={cn(buildRow, 'bottom-[4.4rem] [animation-delay:.35s]')} />
        <span className={cn(buildRow, 'bottom-[7.3rem] [animation-delay:.7s]')} />
        <span className={cn(buildRow, 'bottom-[10.2rem] [animation-delay:1.05s]')} />

        <span
          className={cn(
            'absolute -top-[.9rem] right-0 inline-flex min-h-8 items-center justify-center',
            'rounded-full border border-[color-mix(in_srgb,var(--accent)_32%,transparent)]',
            'bg-[color-mix(in_srgb,var(--panel-strong)_92%,transparent)] px-[.9rem]',
            'font-mono text-[.68rem] tracking-[.18em] text-accent uppercase'
          )}
        >
          assembling
        </span>
      </div>

      <div
        className={cn(
          'absolute right-0 bottom-0 left-0 h-[1.1rem]',
          'bg-[repeating-linear-gradient(-45deg,color-mix(in_srgb,var(--accent)_92%,transparent)_0_18px,color-mix(in_srgb,var(--panel-strong)_88%,transparent)_18px_36px)]'
        )}
        aria-hidden="true"
      />
    </motion.div>
  )
}
