import { useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { navItems } from '../../content/siteContent'
import type { Theme } from '../../app/theme'

type SiteHeaderProps = {
  theme: Theme
  onToggleTheme: () => void
}

export function SiteHeader(props: SiteHeaderProps) {
  const location = useLocation()
  const navRef = useRef<HTMLElement | null>(null)
  const nextThemeLabel =
    props.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'

  useEffect(() => {
    const centerActiveItem = () => {
      const navElement = navRef.current
      const activeItem = navElement?.querySelector<HTMLElement>('.site-nav__link--active')

      if (!navElement || !activeItem) {
        return
      }

      const navRect = navElement.getBoundingClientRect()
      const itemRect = activeItem.getBoundingClientRect()
      const targetScrollLeft =
        navElement.scrollLeft +
        (itemRect.left - navRect.left) -
        (navElement.clientWidth - activeItem.offsetWidth) / 2

      navElement.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'auto'
      })
    }

    const frame = window.requestAnimationFrame(centerActiveItem)
    const settleTimer = window.setTimeout(centerActiveItem, 180)
    window.addEventListener('resize', centerActiveItem)

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(settleTimer)
      window.removeEventListener('resize', centerActiveItem)
    }
  }, [location.pathname])

  return (
    <header className="site-header">
      <Link className="site-brand" to="/">
        <span className="site-brand__mark">FEAR Lab</span>
        <span className="site-brand__meta">HKUST(GZ)</span>
      </Link>

      <nav ref={navRef} className="site-nav" aria-label="Primary">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `site-nav__link${isActive ? ' site-nav__link--active' : ''}${
                item.isFeatured ? ' site-nav__link--featured' : ''
              }`
            }
          >
            <span className="site-nav__label">{item.label}</span>
            {item.featuredLabel ? (
              <span className="site-nav__feature">
                <span className="site-nav__feature-dot" aria-hidden="true" />
                {item.featuredLabel}
              </span>
            ) : null}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        className="theme-toggle"
        onClick={props.onToggleTheme}
        aria-label={nextThemeLabel}
      >
        <span className="theme-toggle__label">mode</span>
        <span className="theme-toggle__chip">{props.theme === 'dark' ? 'Dark' : 'Light'}</span>
      </button>
    </header>
  )
}
