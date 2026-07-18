import { cn } from '../../lib/cn'

export const constructionClasses = {
  page: cn(
    'relative z-[1] mx-auto grid min-h-[calc(100vh-var(--site-header-height))]',
    'w-[min(var(--page-max),calc(100%-(var(--gutter)*2)))]',
    'grid-cols-[minmax(0,1fr)_minmax(320px,0.94fr)] items-start',
    'gap-[clamp(2rem,4vw,4.5rem)] pt-[clamp(1.4rem,4vw,2.6rem)] pb-12',
    'max-[1024px]:min-h-0 max-[1024px]:grid-cols-1 max-[1024px]:gap-[1.2rem]'
  ),
  hero: cn(
    'col-start-1 max-w-[35rem] self-center',
    'max-[1024px]:w-full max-[1024px]:max-w-none'
  ),
  eyebrow: 'mb-[1.35rem] flex flex-wrap items-center gap-[.7rem] max-[700px]:mb-4',
  eyebrowMeta: cn(
    'inline-flex min-h-8 items-center rounded-full pl-[.9rem] pr-[.78rem] pt-[.35rem] pb-[.32rem]',
    'border border-[color-mix(in_srgb,var(--accent)_38%,transparent)]',
    'bg-[color-mix(in_srgb,var(--panel-strong)_76%,transparent)]',
    'font-mono text-[.68rem] leading-none tracking-[.18em] text-accent uppercase',
    'shadow-[0_10px_26px_color-mix(in_srgb,var(--bg)_20%,transparent)]',
    'max-[700px]:min-h-7 max-[700px]:pl-[.7rem] max-[700px]:pr-[.58rem] max-[700px]:pt-[.28rem]',
    'max-[700px]:pb-[.24rem] max-[700px]:text-[.58rem]'
  ),
  headline: cn(
    'm-0 max-w-[11ch] text-[clamp(3rem,9vw,6.1rem)] leading-[.93] tracking-[-.06em]',
    'max-[700px]:max-w-[6.6ch] max-[700px]:text-[clamp(2.45rem,12vw,3.9rem)]',
    'max-[700px]:leading-[.96]'
  ),
  lead: cn(
    'mt-[1.35rem] mb-0 text-[clamp(1rem,1.6vw,1.2rem)] leading-[1.8] text-ink',
    'max-[700px]:mt-4 max-[700px]:text-[.98rem] max-[700px]:leading-[1.65]'
  ),
  focusList: cn(
    'col-start-1 m-0 grid max-w-[34rem] list-none gap-[.8rem] self-start p-0',
    'max-[1024px]:col-auto max-[1024px]:w-full max-[1024px]:max-w-none'
  ),
  focusItem: cn(
    'relative pl-[1.1rem] text-[.98rem] leading-[1.75] text-ink-soft',
    'before:absolute before:top-[.78rem] before:left-0 before:size-[.42rem]',
    'before:rounded-full before:bg-accent',
    'before:shadow-[0_0_18px_color-mix(in_srgb,var(--accent)_30%,transparent)]',
    'max-[700px]:pl-[.95rem] max-[700px]:text-[.9rem] max-[700px]:leading-[1.58]'
  ),
  panel: cn(
    'relative col-start-2 row-[1/span_2] min-h-[28rem] overflow-hidden rounded-[2rem]',
    'border border-line shadow-site',
    'bg-[linear-gradient(180deg,color-mix(in_srgb,var(--panel-strong)_92%,transparent),color-mix(in_srgb,var(--panel)_78%,transparent))]',
    'before:absolute before:inset-0 before:opacity-[.24]',
    'before:bg-[linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)]',
    'before:bg-[length:2rem_2rem]',
    'max-[1024px]:col-auto max-[1024px]:row-auto max-[1024px]:min-h-[22rem] max-[1024px]:w-full',
    'max-[700px]:min-h-[18.8rem] max-[700px]:rounded-[1.4rem]'
  )
} as const
