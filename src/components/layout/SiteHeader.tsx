import { useEffect, useRef, type FocusEventHandler, type RefObject } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import type { Theme } from '../../app/theme'
import { navItems } from '../../content/siteContent'
import { cn } from '../../lib/cn'

type SiteHeaderProps = {
  theme: Theme
  onToggleTheme: () => void
  isVisible: boolean
  isScrolled: boolean
  headerRef: RefObject<HTMLElement | null>
  onFocusCapture: FocusEventHandler<HTMLElement>
  onBlurCapture: FocusEventHandler<HTMLElement>
}

const headerClasses = cn(
  'sticky top-0 z-30 flex flex-wrap items-center gap-x-4 gap-y-[0.9rem] px-[var(--gutter)] pb-[0.7rem] pt-4',
  'border-b border-[color-mix(in_srgb,var(--line)_88%,transparent)] backdrop-blur-[18px]',
  '[background:linear-gradient(180deg,color-mix(in_srgb,var(--bg-layer)_88%,transparent),color-mix(in_srgb,var(--bg-layer)_54%,transparent))]',
  '[transition:transform_260ms_cubic-bezier(0.16,1,0.3,1),opacity_180ms_ease,box-shadow_220ms_ease,border-color_220ms_ease] will-change-transform',
  "[main[data-page='publications']_&]:[background:linear-gradient(180deg,color-mix(in_srgb,var(--publication-nav)_94%,transparent),color-mix(in_srgb,var(--publication-nav)_72%,transparent))]",
  'max-[900px]:pt-[0.9rem]'
)

const navClasses = cn(
  'flex min-w-0 flex-[1_1_32rem] items-center justify-center gap-[0.35rem] overflow-x-auto rounded-full border border-line p-1',
  'bg-[color-mix(in_srgb,var(--panel)_84%,transparent)] shadow-[0_10px_24px_color-mix(in_srgb,var(--bg)_18%,transparent)]',
  '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
  'min-[901px]:max-[1050px]:order-3 min-[901px]:max-[1050px]:basis-full min-[901px]:max-[1050px]:justify-start',
  'max-[900px]:order-3 max-[900px]:basis-full max-[900px]:justify-start'
)

const navLinkClasses = cn(
  'group/nav-link inline-flex min-h-8 items-center justify-center gap-[0.48rem] whitespace-nowrap rounded-full border border-transparent px-[0.85rem] text-ink-soft no-underline',
  '[transition:color_160ms_ease,background-color_160ms_ease,border-color_160ms_ease,transform_160ms_ease]',
  'hover:-translate-y-px hover:text-ink aria-[current=page]:[background:var(--accent)] aria-[current=page]:text-site'
)

const featuredLinkClasses = cn(
  'border-[color-mix(in_srgb,var(--accent)_22%,transparent)] py-0 pl-[0.42rem] pr-2',
  '[background:linear-gradient(135deg,color-mix(in_srgb,var(--accent)_10%,transparent),color-mix(in_srgb,var(--panel-strong)_96%,transparent))]',
  'shadow-[0_14px_34px_color-mix(in_srgb,var(--accent)_9%,transparent)]',
  'hover:border-[color-mix(in_srgb,var(--accent)_44%,transparent)] hover:shadow-[0_16px_38px_color-mix(in_srgb,var(--accent)_14%,transparent)]',
  'aria-[current=page]:border-[color-mix(in_srgb,var(--accent)_72%,transparent)] aria-[current=page]:shadow-[0_0_0_1px_color-mix(in_srgb,white_12%,transparent),0_14px_30px_color-mix(in_srgb,var(--accent)_22%,transparent)]'
)

const featureClasses = cn(
  'inline-flex min-h-[1.45rem] items-center gap-[0.32rem] rounded-full bg-[color-mix(in_srgb,var(--accent)_14%,transparent)] px-[0.54rem]',
  'font-mono text-[0.51rem] tracking-[0.14em] text-accent uppercase',
  'group-aria-[current=page]/nav-link:bg-[color-mix(in_srgb,white_22%,transparent)] group-aria-[current=page]/nav-link:text-[color-mix(in_srgb,var(--bg)_82%,black_18%)]'
)

const themeToggleClasses = cn(
  'ml-auto inline-flex cursor-pointer items-center gap-[0.45rem] rounded-full border border-line py-[0.28rem] pl-[0.62rem] pr-[0.34rem]',
  'bg-[color-mix(in_srgb,var(--panel)_82%,transparent)] text-ink-soft opacity-[0.82] shadow-[0_10px_24px_color-mix(in_srgb,var(--bg)_18%,transparent)]',
  'transition-[opacity,border-color,background-color] duration-[160ms] hover:border-[color-mix(in_srgb,var(--accent)_45%,var(--line))] hover:opacity-100',
  'max-[900px]:ml-0 max-[520px]:pl-2 max-[520px]:pr-[0.34rem]'
)

const themeChipClasses = cn(
  'inline-flex min-h-[1.7rem] min-w-[4.4rem] items-center justify-center rounded-full px-[0.58rem]',
  'bg-[color-mix(in_srgb,var(--accent)_16%,transparent)] font-mono text-[0.62rem] tracking-[0.18em] text-accent uppercase'
)

export function SiteHeader(props: SiteHeaderProps) {
  const location = useLocation()
  const navRef = useRef<HTMLElement | null>(null)
  const nextThemeLabel = props.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  useEffect(() => {
    const centerActiveItem = () => {
      const nav = navRef.current
      const activeItem = nav?.querySelector<HTMLElement>('[aria-current="page"]')
      if (!nav || !activeItem) return

      const navRect = nav.getBoundingClientRect()
      const itemRect = activeItem.getBoundingClientRect()
      const left = nav.scrollLeft + itemRect.left - navRect.left - (nav.clientWidth - activeItem.offsetWidth) / 2
      nav.scrollTo({ left: Math.max(0, left), behavior: 'auto' })
    }

    const frame = window.requestAnimationFrame(centerActiveItem)
    const timer = window.setTimeout(centerActiveItem, 180)
    window.addEventListener('resize', centerActiveItem)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
      window.removeEventListener('resize', centerActiveItem)
    }
  }, [location.pathname])

  return (
    <header
      ref={props.headerRef}
      className={cn(
        headerClasses,
        props.isScrolled && 'border-[color-mix(in_srgb,var(--accent)_16%,var(--line))] shadow-[0_16px_42px_color-mix(in_srgb,var(--bg)_28%,transparent)]',
        !props.isVisible && '-translate-y-[calc(100%+1px)] opacity-0 pointer-events-none focus-within:translate-y-0 focus-within:opacity-100 focus-within:pointer-events-auto'
      )}
      onFocusCapture={props.onFocusCapture}
      onBlurCapture={props.onBlurCapture}
    >
      <Link className="flex min-w-max flex-col gap-[0.12rem] no-underline max-[520px]:flex-[1_1_auto]" to="/">
        <span className="text-base font-bold tracking-[-0.04em]">FEAR Lab</span>
        <span className="font-mono text-[0.58rem] tracking-[0.18em] text-ink-soft uppercase">HKUST(GZ)</span>
      </Link>

      <nav ref={navRef} className={navClasses} aria-label="Primary">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={cn(navLinkClasses, item.isFeatured && featuredLinkClasses)}
          >
            <span className="relative z-[1]">{item.label}</span>
            {item.featuredLabel ? (
              <span className={featureClasses}>
                <span className="size-[0.34rem] rounded-full bg-current shadow-[0_0_12px_color-mix(in_srgb,var(--accent)_56%,transparent)]" aria-hidden="true" />
                {item.featuredLabel}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        className={themeToggleClasses}
        onClick={props.onToggleTheme}
        aria-label={nextThemeLabel}
      >
        <span className="font-mono text-[0.7rem] tracking-[0.18em] uppercase max-[520px]:hidden">mode</span>
        <span className={themeChipClasses}>
          {props.theme === 'dark' ? 'Dark' : 'Light'}
        </span>
      </button>
    </header>
  )
}
