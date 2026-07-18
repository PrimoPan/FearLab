import { motion } from 'framer-motion'
import { useEffect, useId, useState, type MouseEvent } from 'react'
import type { PublicationYearGroup } from '../../lib/publications'
import { cn } from '../../lib/cn'
import { publicationLayoutStyles } from './publicationLayoutStyles'

type PublicationYearNavProps = {
  groups: readonly PublicationYearGroup[]
}

const describeWorkCount = (count: number) => `${count} ${count === 1 ? 'work' : 'works'}`

export function PublicationYearNav({ groups }: PublicationYearNavProps) {
  const selectId = useId()
  const [activeYear, setActiveYear] = useState(groups[0]?.year ?? 0)

  useEffect(() => {
    let frameId = 0

    const updateActiveYear = () => {
      frameId = 0
      const readingLine = Math.min(window.innerHeight * 0.34, 300)
      let nextYear = groups[0]?.year

      for (const group of groups) {
        const section = document.getElementById(`publications-${group.year}`)

        if (!section) continue
        if (section.getBoundingClientRect().top <= readingLine) {
          nextYear = group.year
        } else {
          break
        }
      }

      if (nextYear !== undefined) {
        setActiveYear((currentYear) => (currentYear === nextYear ? currentYear : nextYear))
      }
    }

    const scheduleUpdate = () => {
      if (frameId !== 0) return
      frameId = window.requestAnimationFrame(updateActiveYear)
    }

    updateActiveYear()
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)

    return () => {
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      window.cancelAnimationFrame(frameId)
    }
  }, [groups])

  const jumpToYear = (year: number) => {
    const section = document.getElementById(`publications-${year}`)
    if (!section) return

    setActiveYear(year)
    section.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start'
    })
  }

  const handleYearClick = (event: MouseEvent<HTMLAnchorElement>, year: number) => {
    event.preventDefault()
    jumpToYear(year)
  }

  return (
    <nav
      className={publicationLayoutStyles.yearNav}
      aria-label="Jump to publication year"
      data-publication-year-nav
    >
      <span className={publicationLayoutStyles.yearNavLabel}>Years</span>

      <ol className={publicationLayoutStyles.yearNavList}>
        {groups.map((group) => {
          const isActive = group.year === activeYear

          return (
            <li key={group.year}>
              <a
                className={publicationLayoutStyles.yearNavLink}
                href={`#publications-${group.year}`}
                aria-current={isActive ? 'location' : undefined}
                onClick={(event) => handleYearClick(event, group.year)}
              >
                {isActive && (
                  <motion.span
                    className={publicationLayoutStyles.yearNavActive}
                    layoutId="publication-year-active"
                    transition={{ type: 'spring', stiffness: 470, damping: 42 }}
                    aria-hidden="true"
                  />
                )}
                <span className={publicationLayoutStyles.yearNavValue}>{group.year}</span>
                <span
                  className={cn(
                    publicationLayoutStyles.yearNavCount,
                    isActive && '[background:color-mix(in_srgb,var(--bg)_13%,transparent)]'
                  )}
                  aria-label={describeWorkCount(group.publications.length)}
                >
                  {group.publications.length}
                </span>
              </a>
            </li>
          )
        })}
      </ol>

      <label className={publicationLayoutStyles.yearNavCompact} htmlFor={selectId}>
        <span>Browse year</span>
        <select
          className={publicationLayoutStyles.yearSelect}
          id={selectId}
          value={activeYear}
          onChange={(event) => jumpToYear(Number(event.target.value))}
        >
          {groups.map((group) => (
            <option key={group.year} value={group.year}>
              {group.year} · {describeWorkCount(group.publications.length)}
            </option>
          ))}
        </select>
      </label>
    </nav>
  )
}
