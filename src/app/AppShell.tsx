import { useEffect, useState, type CSSProperties } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SiteHeader } from '../components/layout/SiteHeader'
import { constructionCopy } from '../content/siteContent'
import { useAutoHideHeader } from '../hooks/useAutoHideHeader'
import { ConstructionPage } from '../pages/ConstructionPage'
import { HomePage } from '../pages/HomePage'
import { NewsPage } from '../pages/NewsPage'
import { PeoplePage } from '../pages/PeoplePage'
import { PersonRedirectPage } from '../pages/PersonRedirectPage'
import { PublicationsPage } from '../pages/PublicationsPage'
import { cn } from '../lib/cn'
import { detectInitialTheme, themeStorageKey, toggleTheme, type Theme } from './theme'

const shellClass = cn(
  'relative min-h-screen overflow-x-clip',
  '[--site-header-height:var(--site-header-offset)]',
  '[--sticky-header-offset:var(--site-header-height)]',
  '[--publication-nav-offset:0px]',
  'bg-[radial-gradient(circle_at_82%_16%,var(--glow),transparent_26%),linear-gradient(180deg,color-mix(in_srgb,var(--bg-layer)_74%,transparent),var(--bg))]'
)

const publicationsShellClass = cn(
  'bg-[radial-gradient(circle_at_82%_8%,color-mix(in_srgb,var(--glow)_88%,transparent),transparent_30rem),radial-gradient(circle_at_8%_42%,color-mix(in_srgb,var(--accent)_10%,transparent),transparent_32rem),linear-gradient(155deg,var(--publication-canvas-start),var(--publication-canvas-end))]',
  'max-[899px]:[--publication-nav-offset:4.85rem]'
)

export function AppShell() {
  const [theme, setTheme] = useState<Theme>(detectInitialTheme)
  const location = useLocation()
  const header = useAutoHideHeader(location.pathname)
  const isPublicationsPage = location.pathname === '/publications'
  const shellStyle = header.height
    ? ({ '--site-header-height': `${header.height}px` } as CSSProperties)
    : undefined

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem(themeStorageKey, theme)
  }, [theme])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [location.pathname])

  useEffect(() => {
    document.title = 'FEAR Lab | HKUST(GZ)'
  }, [location.pathname, location.search])

  return (
    <main
      className={cn(
        shellClass,
        !header.isVisible &&
          '[--sticky-header-offset:0px] [--publication-nav-offset:0px] max-[899px]:[--publication-nav-offset:0px]',
        isPublicationsPage && publicationsShellClass
      )}
      data-page={isPublicationsPage ? 'publications' : 'default'}
      data-header-visible={header.isVisible}
      style={shellStyle}
    >
      <div
        className="pointer-events-none absolute -top-32 -right-28 size-[28rem] rounded-full bg-site-glow opacity-70 blur-[50px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute bottom-0 -left-40 size-[28rem] rounded-full bg-[color-mix(in_srgb,var(--accent)_24%,transparent)] opacity-70 blur-[50px]"
        aria-hidden="true"
      />

      <SiteHeader
        theme={theme}
        onToggleTheme={() => setTheme(toggleTheme)}
        isVisible={header.isVisible}
        isScrolled={header.isScrolled}
        headerRef={header.headerRef}
        onFocusCapture={header.handleFocusCapture}
        onBlurCapture={header.handleBlurCapture}
      />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/projects" element={<ConstructionPage {...constructionCopy.projects} />} />
        <Route path="/publications" element={<PublicationsPage />} />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/people/:slug" element={<PersonRedirectPage />} />
        <Route path="/contact" element={<ConstructionPage {...constructionCopy.contact} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}
