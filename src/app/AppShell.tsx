import { useEffect, useState } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { SiteHeader } from '../components/layout/SiteHeader'
import { constructionCopy } from '../content/siteContent'
import { ConstructionPage } from '../pages/ConstructionPage'
import { HomePage } from '../pages/HomePage'
import { NewsPage } from '../pages/NewsPage'
import { PeoplePage } from '../pages/PeoplePage'
import { PersonRedirectPage } from '../pages/PersonRedirectPage'
import { detectInitialTheme, themeStorageKey, toggleTheme, type Theme } from './theme'

export function AppShell() {
  const [theme, setTheme] = useState<Theme>(detectInitialTheme)
  const location = useLocation()

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
    <main className="page-shell">
      <div className="ambient ambient-a" aria-hidden="true" />
      <div className="ambient ambient-b" aria-hidden="true" />

      <SiteHeader theme={theme} onToggleTheme={() => setTheme(toggleTheme)} />

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/projects" element={<ConstructionPage {...constructionCopy.projects} />} />
        <Route
          path="/publications"
          element={<ConstructionPage {...constructionCopy.publications} />}
        />
        <Route path="/people" element={<PeoplePage />} />
        <Route path="/people/:slug" element={<PersonRedirectPage />} />
        <Route path="/contact" element={<ConstructionPage {...constructionCopy.contact} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
  )
}
