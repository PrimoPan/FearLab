import { cn } from '../../lib/cn'

export const publicationLayoutStyles = {
  page: cn(
    'relative z-[1] mx-auto w-[min(var(--page-max),calc(100%-(var(--gutter)*2)))]',
    'pt-[clamp(1.6rem,4vw,2.8rem)] pb-20 max-[700px]:pt-[1.3rem]'
  ),
  archiveLayout: cn(
    'mt-[clamp(1.35rem,3vw,2.1rem)] grid grid-cols-[minmax(6.75rem,7.5rem)_minmax(0,1fr)]',
    'items-start gap-[clamp(1.4rem,3vw,2.75rem)] max-[899px]:mt-[1.1rem] max-[899px]:block'
  ),
  archive: 'grid',
  hero: 'border-b border-line pb-[clamp(1.8rem,4vw,3rem)]',
  eyebrow: cn(
    'mb-[1.35rem] flex flex-wrap items-center gap-[0.7rem]',
    'max-[700px]:mb-4'
  ),
  eyebrowMeta: cn(
    'inline-flex min-h-8 items-center rounded-full border px-[0.78rem] pt-[0.35rem] pb-[0.32rem] pl-[0.9rem]',
    'font-mono text-[0.68rem] leading-none tracking-[0.18em] text-accent uppercase',
    '[border-color:color-mix(in_srgb,var(--accent)_38%,transparent)]',
    '[background:color-mix(in_srgb,var(--panel-strong)_76%,transparent)]',
    '[box-shadow:0_10px_26px_color-mix(in_srgb,var(--bg)_20%,transparent)]',
    'max-[700px]:min-h-7 max-[700px]:px-[0.58rem] max-[700px]:pt-[0.28rem]',
    'max-[700px]:pb-[0.24rem] max-[700px]:pl-[0.7rem] max-[700px]:text-[0.58rem]'
  ),
  heroCopy: 'max-w-[58rem]',
  heroHeadline: cn(
    'm-0 text-[clamp(3.5rem,9vw,7rem)] leading-[0.88] tracking-[-0.075em]',
    'max-[700px]:text-[clamp(2.8rem,15vw,4.6rem)] max-[700px]:leading-[0.92]'
  ),
  heroLead: cn(
    'mt-[1.35rem] mb-0 max-w-[46rem] text-[clamp(1.08rem,1.8vw,1.32rem)] leading-[1.68] text-ink-soft',
    'max-[700px]:mt-4 max-[700px]:text-[1.05rem] max-[700px]:leading-[1.66]'
  ),
  yearNav: cn(
    'sticky top-[calc(var(--sticky-header-offset)+1rem)] z-[12] grid max-h-[calc(100svh-var(--sticky-header-offset)-2rem)]',
    'self-start overflow-y-auto rounded-2xl border p-[0.72rem] font-mono tracking-[0.13em] uppercase',
    'gap-3 [border-color:color-mix(in_srgb,var(--accent)_12%,var(--line))]',
    '[background:linear-gradient(145deg,var(--publication-nav-highlight),transparent_46%),var(--publication-nav)]',
    '[box-shadow:0_14px_32px_color-mix(in_srgb,var(--bg)_22%,transparent),inset_0_1px_0_color-mix(in_srgb,white_10%,transparent)]',
    '[scrollbar-color:color-mix(in_srgb,var(--accent)_42%,transparent)_transparent] [scrollbar-width:thin]',
    'backdrop-blur-[22px] backdrop-saturate-[1.15] [transition:top_260ms_cubic-bezier(0.16,1,0.3,1)]',
    'max-[899px]:top-[calc(var(--sticky-header-offset)+0.45rem)] max-[899px]:block max-[899px]:max-h-none',
    'max-[899px]:w-full max-[899px]:overflow-visible max-[899px]:rounded-[0.9rem] max-[899px]:px-[0.78rem] max-[899px]:py-[0.66rem]',
    'max-[899px]:opacity-100 max-[899px]:will-change-transform max-[899px]:[transform:translateY(0)]',
    'max-[899px]:[transition:top_260ms_cubic-bezier(0.16,1,0.3,1),transform_260ms_cubic-bezier(0.16,1,0.3,1),opacity_170ms_ease]',
    "max-[899px]:[main[data-header-visible='false']_&]:pointer-events-none max-[899px]:[main[data-header-visible='false']_&]:opacity-0",
    "max-[899px]:[main[data-header-visible='false']_&]:[transform:translateY(calc(-100%-var(--site-header-height)-1rem))]",
    'max-[700px]:mx-[calc(var(--gutter)*-0.35)] max-[700px]:w-[calc(100%+(var(--gutter)*0.7))]'
  ),
  yearNavLabel: 'px-[0.48rem] pt-[0.22rem] text-[0.62rem] text-accent max-[899px]:hidden',
  yearNavList: 'm-0 grid list-none gap-[0.3rem] p-0 max-[899px]:hidden',
  yearNavLink: cn(
    'relative isolate flex min-h-[2.28rem] items-center justify-between gap-[0.45rem] rounded-[0.68rem] border border-transparent',
    'px-[0.52rem] pt-[0.48rem] pb-[0.44rem] pl-[0.62rem] text-[0.82rem] leading-none tracking-[0.06em] text-ink-soft no-underline',
    '[transition:color_160ms_ease,border-color_160ms_ease]',
    'hover:text-ink hover:[border-color:color-mix(in_srgb,var(--accent)_25%,transparent)]',
    'focus-visible:text-ink focus-visible:[border-color:color-mix(in_srgb,var(--accent)_25%,transparent)]',
    "[&[aria-current='location']]:text-site [&[aria-current='location']:hover]:text-site",
    "[&[aria-current='location']:focus-visible]:text-site"
  ),
  yearNavActive: cn(
    'absolute inset-0 -z-10 rounded-[inherit]',
    '[background:linear-gradient(115deg,var(--accent),color-mix(in_srgb,var(--accent)_68%,white))]',
    '[box-shadow:0_8px_18px_color-mix(in_srgb,var(--accent)_22%,transparent)]'
  ),
  yearNavValue: 'relative z-[1]',
  yearNavCount: cn(
    'relative z-[1] inline-grid min-h-[1.42rem] min-w-[1.42rem] place-items-center rounded-full',
    'text-[0.62rem] [background:color-mix(in_srgb,var(--text-soft)_12%,transparent)]'
  ),
  yearNavCompact: cn(
    'hidden text-accent',
    'max-[899px]:grid max-[899px]:grid-cols-[auto_minmax(11rem,18rem)] max-[899px]:items-center',
    'max-[899px]:justify-between max-[899px]:gap-4 max-[899px]:text-[0.66rem]',
    'max-[700px]:grid-cols-1 max-[700px]:gap-[0.42rem]'
  ),
  yearSelect: cn(
    'w-full min-h-[2.65rem] appearance-none rounded-[0.68rem] border px-[0.88rem] pt-[0.48rem] pr-9 pb-[0.44rem]',
    'font-sans text-[0.96rem] font-[650] tracking-normal text-ink outline-none',
    '[border-color:color-mix(in_srgb,var(--accent)_24%,var(--line))]',
    '[background:linear-gradient(45deg,transparent_50%,var(--accent)_50%)_calc(100%-1rem)_52%/0.42rem_0.42rem_no-repeat,linear-gradient(135deg,var(--accent)_50%,transparent_50%)_calc(100%-0.72rem)_52%/0.42rem_0.42rem_no-repeat,color-mix(in_srgb,var(--panel-strong)_86%,transparent)]',
    'focus-visible:border-accent focus-visible:[box-shadow:0_0_0_3px_color-mix(in_srgb,var(--accent)_18%,transparent)]'
  ),
  yearGroup: cn(
    'grid grid-cols-[minmax(0,1fr)] gap-[1.2rem] pt-[clamp(2.6rem,6vw,5rem)]',
    '[scroll-margin-top:calc(var(--sticky-header-offset)+1rem)]',
    'max-[899px]:[scroll-margin-top:calc(var(--sticky-header-offset)+5.85rem)]',
    "max-[899px]:[main[data-header-visible='false']_&]:[scroll-margin-top:calc(var(--sticky-header-offset)+1rem)]",
    'max-[700px]:gap-[1.15rem] max-[700px]:pt-[3.2rem]'
  ),
  yearHeader: 'flex items-baseline gap-[0.9rem] max-[700px]:gap-[0.8rem]',
  yearHeading: cn(
    'm-0 text-[clamp(2.6rem,5.5vw,4.75rem)] leading-[0.9] tracking-[-0.075em]',
    '[color:color-mix(in_srgb,var(--text)_88%,var(--accent)_12%)] max-[700px]:text-[2.7rem]'
  ),
  yearCount: 'm-0 font-mono text-[0.66rem] tracking-[0.13em] text-ink-soft uppercase',
  publicationList: 'border-t border-line'
} as const
