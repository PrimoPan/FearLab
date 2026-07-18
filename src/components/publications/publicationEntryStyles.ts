import { cn } from '../../lib/cn'

export const publicationEntryStyles = {
  article: cn(
    'group/entry relative grid grid-cols-[minmax(0,1.35fr)_minmax(12rem,0.65fr)]',
    'gap-[clamp(1.5rem,4vw,3.5rem)] border-b border-line',
    'px-[clamp(0.6rem,1.5vw,1.1rem)] py-[clamp(1.45rem,3vw,2.25rem)]',
    '[transition:background-color_180ms_ease]',
    'before:absolute before:top-[1.1rem] before:bottom-[1.1rem] before:left-0 before:w-0.5',
    "before:origin-center before:scale-y-0 before:rounded-full before:bg-accent before:content-['']",
    'before:[transition:transform_180ms_ease] hover:before:scale-y-100 focus-within:before:scale-y-100',
    'hover:[background:linear-gradient(90deg,color-mix(in_srgb,var(--panel)_68%,var(--publication-nav-highlight)),transparent_78%)]',
    'focus-within:[background:linear-gradient(90deg,color-mix(in_srgb,var(--panel)_68%,var(--publication-nav-highlight)),transparent_78%)]',
    'max-[1024px]:grid-cols-[minmax(0,1fr)_minmax(10rem,0.48fr)] max-[1024px]:gap-[1.4rem]',
    'max-[700px]:grid-cols-1 max-[700px]:gap-[1.15rem] max-[700px]:px-[0.55rem]',
    'max-[700px]:pt-[1.35rem] max-[700px]:pb-6 max-[700px]:before:top-[0.9rem] max-[700px]:before:bottom-[0.9rem]'
  ),
  body: 'grid min-w-0 content-start gap-[0.78rem]',
  badges: 'flex min-h-[1.65rem] flex-wrap items-center gap-[0.42rem]',
  badge: cn(
    'inline-flex min-h-[1.62rem] items-center justify-center gap-[0.34rem]',
    'font-sans text-[0.68rem] leading-none font-[720] tracking-[0.075em]'
  ),
  venueBadge: cn(
    '[--venue-color:#aab3c7] rounded-full border px-[0.65rem] pt-[0.35rem] pb-[0.32rem] uppercase',
    '[border-color:color-mix(in_srgb,var(--venue-color)_42%,var(--line))]',
    '[background:color-mix(in_srgb,var(--venue-color)_14%,var(--panel))]',
    '[box-shadow:inset_0_1px_0_color-mix(in_srgb,white_8%,transparent)]',
    '[color:color-mix(in_srgb,var(--venue-color)_76%,var(--text))]',
    '[transition:background-color_180ms_ease,border-color_180ms_ease,transform_180ms_ease]',
    'group-hover/entry:-translate-y-px group-hover/entry:[border-color:color-mix(in_srgb,var(--venue-color)_58%,var(--line))]',
    'group-hover/entry:[background:color-mix(in_srgb,var(--venue-color)_20%,var(--panel))]',
    'group-focus-within/entry:-translate-y-px group-focus-within/entry:[border-color:color-mix(in_srgb,var(--venue-color)_58%,var(--line))]',
    'group-focus-within/entry:[background:color-mix(in_srgb,var(--venue-color)_20%,var(--panel))]'
  ),
  recognitionBadge: cn(
    'rounded-full border px-[0.62rem] pt-[0.35rem] pb-[0.32rem] uppercase',
    '[border-color:color-mix(in_srgb,#f1c65f_48%,var(--line))]',
    '[background:linear-gradient(150deg,color-mix(in_srgb,#f1c65f_24%,var(--panel)),color-mix(in_srgb,#d8982d_13%,var(--panel)))]',
    '[color:color-mix(in_srgb,#f7d878_78%,var(--text))]'
  ),
  nominationBadge: cn(
    '[border-color:color-mix(in_srgb,#e7a85b_42%,var(--line))]',
    '[background:color-mix(in_srgb,#e7a85b_14%,var(--panel))]',
    '[color:color-mix(in_srgb,#edbd79_74%,var(--text))]'
  ),
  badgeIcon: "font-['Apple_Color_Emoji','Segoe_UI_Emoji',sans-serif] text-[0.8rem] tracking-normal",
  title: cn(
    'm-0 max-w-[34ch] text-[clamp(1.48rem,2.35vw,2.08rem)] leading-[1.22] font-semibold tracking-[-0.028em]',
    "[font-family:'Iowan_Old_Style','Palatino_Linotype','Book_Antiqua',Georgia,serif] text-ink [overflow-wrap:anywhere]",
    '[transition:color_180ms_ease]',
    'group-hover/entry:[color:color-mix(in_srgb,var(--text)_78%,var(--accent)_22%)]',
    'group-focus-within/entry:[color:color-mix(in_srgb,var(--text)_78%,var(--accent)_22%)]',
    'max-[700px]:max-w-none max-[700px]:text-[clamp(1.45rem,6.9vw,1.82rem)]'
  ),
  authors: cn(
    'mt-[0.08rem] mb-0 text-[1.04rem] leading-[1.76] text-ink-soft',
    'max-[700px]:mt-0 max-[700px]:text-[0.98rem] max-[700px]:leading-[1.72]'
  ),
  author: 'text-inherit',
  memberAuthor: cn(
    'font-[650] text-ink underline decoration-1 underline-offset-[0.23em]',
    '[text-decoration-color:color-mix(in_srgb,var(--accent)_72%,transparent)]',
    '[transition:color_160ms_ease,text-decoration-color_160ms_ease]',
    'hover:text-accent hover:decoration-accent focus-visible:text-accent focus-visible:decoration-accent'
  ),
  meta: cn(
    'grid content-start gap-[0.72rem] text-[0.86rem] leading-[1.62] text-ink-soft',
    'max-[700px]:gap-[0.52rem]'
  ),
  venue: cn(
    'm-0 max-w-[35ch] italic [overflow-wrap:anywhere]',
    '[color:color-mix(in_srgb,var(--text-soft)_92%,var(--text))]'
  ),
  date: 'font-mono text-[0.66rem] tracking-[0.13em] text-accent uppercase',
  action: cn(
    'mt-[0.18rem] inline-flex w-fit items-center gap-[0.4rem] border-b no-underline',
    'font-mono text-[0.64rem] tracking-[0.06em] text-ink normal-case',
    '[border-color:color-mix(in_srgb,var(--accent)_48%,transparent)]',
    '[transition:color_160ms_ease,border-color_160ms_ease,gap_160ms_ease]',
    'hover:gap-[0.55rem] hover:border-accent hover:text-accent',
    'focus-visible:gap-[0.55rem] focus-visible:border-accent focus-visible:text-accent'
  )
} as const

export const venueToneClasses = {
  amber: '[--venue-color:#efb95f]',
  blue: '[--venue-color:#77a8ff]',
  coral: '[--venue-color:#ff746c]',
  cyan: '[--venue-color:#5fd2d5]',
  green: '[--venue-color:#78c995]',
  slate: '[--venue-color:#a8b3ca]',
  violet: '[--venue-color:#b69aff]'
} as const
