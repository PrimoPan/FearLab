import { useEffect, useState } from 'react'
import { motion, type Variants } from 'framer-motion'

type Theme = 'dark' | 'day'

const easeCurve: [number, number, number, number] = [0.16, 1, 0.3, 1]

const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: easeCurve }
  }
}

const detectInitialTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'dark'
  }

  const storedTheme = window.localStorage.getItem('fearlab-theme')
  if (storedTheme === 'dark' || storedTheme === 'day') {
    return storedTheme
  }

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'day' : 'dark'
}

function ConstructionCat() {
  return (
    <svg className="cat-builder__svg" viewBox="0 0 240 160" aria-hidden="true">
      <g className="cat-builder__tail-group">
        <path
          d="M58 88C34 66 38 40 58 22"
          fill="none"
          stroke="var(--cat-grey-dark)"
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M58 88C38 66 42 42 58 26"
          fill="none"
          stroke="var(--cat-grey)"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <path
          d="M46 54L59 44M43 67L57 58"
          fill="none"
          stroke="var(--cat-stripe)"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </g>

      <g className="cat-builder__back-legs">
        <rect x="74" y="102" width="15" height="39" rx="7.5" fill="var(--cat-grey)" />
        <rect x="98" y="103" width="15" height="38" rx="7.5" fill="var(--cat-grey)" />
        <rect x="70" y="138" width="22" height="7" rx="3.5" fill="var(--cat-grey-dark)" />
        <rect x="94" y="138" width="22" height="7" rx="3.5" fill="var(--cat-grey-dark)" />
      </g>

      <g className="cat-builder__body-group">
        <ellipse cx="108" cy="92" rx="63" ry="38" fill="var(--cat-grey)" />
        <ellipse cx="94" cy="98" rx="32" ry="26" fill="var(--cat-cream)" />
        <path
          d="M83 73C90 78 95 86 95 95M107 67C114 73 117 82 117 92M131 71C137 77 141 85 141 94"
          fill="none"
          stroke="var(--cat-stripe)"
          strokeWidth="5"
          strokeLinecap="round"
          opacity="0.65"
        />
      </g>

      <g className="cat-builder__front-legs">
        <rect x="126" y="102" width="15" height="40" rx="7.5" fill="var(--cat-grey)" />
        <rect x="150" y="101" width="15" height="41" rx="7.5" fill="var(--cat-grey)" />
        <rect x="122" y="139" width="22" height="7" rx="3.5" fill="var(--cat-grey-dark)" />
        <rect x="146" y="139" width="22" height="7" rx="3.5" fill="var(--cat-grey-dark)" />
      </g>

      <g className="cat-builder__head-group">
        <path
          d="M144 56L154 28L165 56"
          fill="var(--cat-grey)"
          stroke="var(--cat-grey-dark)"
          strokeWidth="1.5"
        />
        <path
          d="M163 55L176 28L186 55"
          fill="var(--cat-grey)"
          stroke="var(--cat-grey-dark)"
          strokeWidth="1.5"
        />
        <path d="M152 54L157 40L162 54" fill="var(--cat-ear)" />
        <path d="M171 53L176 39L181 53" fill="var(--cat-ear)" />
        <ellipse
          cx="164"
          cy="77"
          rx="32"
          ry="30"
          fill="var(--cat-grey)"
          stroke="var(--cat-grey-dark)"
          strokeWidth="1.5"
        />
        <path
          d="M151 55C154 60 155 66 154 74M164 52C166 58 167 64 166 72M177 57C175 61 173 67 170 71"
          fill="none"
          stroke="var(--cat-stripe)"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.78"
        />
        <ellipse cx="162" cy="88" rx="25" ry="19" fill="var(--cat-cream)" />
        <ellipse cx="162" cy="92" rx="8.5" ry="5.8" fill="var(--cat-white)" opacity="0.86" />
        <ellipse cx="151" cy="77" rx="8.4" ry="9.4" fill="var(--cat-eye)" />
        <ellipse cx="173" cy="76" rx="8.4" ry="9.4" fill="var(--cat-eye)" />
        <ellipse cx="152" cy="78" rx="3.5" ry="4.6" fill="var(--cat-line)" />
        <ellipse cx="174" cy="77" rx="3.5" ry="4.6" fill="var(--cat-line)" />
        <circle cx="149.4" cy="73.3" r="1.3" fill="white" />
        <circle cx="171.4" cy="72.3" r="1.3" fill="white" />
        <path d="M160 84L164 84L162 87.6Z" fill="var(--cat-nose)" />
        <path
          d="M162 87.4V92.8M162 92.8C160.3 91.3 158.6 91.2 157.2 92M162 92.8C163.6 91.3 165.5 91.2 166.8 92"
          stroke="var(--cat-line)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M142 87L126 84M142 91L125 91M142 95L126 99M183 86L198 83M183 90L199 90M183 94L199 98"
          stroke="var(--cat-line)"
          strokeWidth="2.2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </g>

      <g className="cat-builder__clipboard-group">
        <g transform="translate(193 91) rotate(8)">
          <rect
            x="-18"
            y="-3"
            width="36"
            height="58"
            rx="11"
            fill="var(--blueprint)"
            stroke="rgba(125, 156, 203, 0.45)"
            strokeWidth="2"
          />
          <rect x="-7" y="-8" width="14" height="7" rx="3.5" fill="var(--cat-clip)" />
          <rect x="-9" y="13" width="18" height="3.8" rx="1.9" fill="var(--blueprint-line)" />
          <rect x="-9" y="26" width="17" height="3.8" rx="1.9" fill="var(--blueprint-line)" />
          <rect x="-9" y="39" width="15" height="3.8" rx="1.9" fill="var(--blueprint-line)" />
          <rect x="-1" y="60" width="22" height="5" rx="2.5" fill="rgba(80, 94, 122, 0.32)" />
        </g>
      </g>
    </svg>
  )
}

export default function App() {
  const [theme, setTheme] = useState<Theme>(detectInitialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    window.localStorage.setItem('fearlab-theme', theme)
  }, [theme])

  const nextThemeLabel = theme === 'dark' ? 'Switch to day mode' : 'Switch to dark mode'

  return (
    <main className="page-shell">
      <div className="ambient ambient-a" aria-hidden="true" />
      <div className="ambient ambient-b" aria-hidden="true" />

      <header className="topbar">
        <button
          type="button"
          className="theme-toggle"
          onClick={() => setTheme((currentTheme) => (currentTheme === 'dark' ? 'day' : 'dark'))}
          aria-label={nextThemeLabel}
        >
          <span className="theme-toggle__label">mode</span>
          <span className="theme-toggle__chip">{theme === 'dark' ? 'Dark' : 'Day'}</span>
        </button>
      </header>

      <section className="hero">
        <motion.div
          className="hero-copy"
          initial="hidden"
          animate="visible"
          variants={reveal}
        >
          <motion.div className="brand-lockup" variants={reveal}>
            <div className="brand-lockup__mark" aria-label="FEAR Lab">
              <span>FEAR</span>
              <span>Lab</span>
            </div>
            <div
              className="brand-lockup__meaning"
              aria-label="Future Embodied Augmented Realities Lab"
            >
              <span>Future</span>
              <span>Embodied</span>
              <span>Augmented</span>
              <span>Realities Lab</span>
            </div>
          </motion.div>

          <motion.div className="eyebrow" variants={reveal}>
            <span className="eyebrow__meta">HKUST(GZ)</span>
          </motion.div>
          <motion.h1 className="headline" variants={reveal}>
            Website under construction.
          </motion.h1>
          <motion.p className="lead" variants={reveal}>
            FEAR Lab is a human-computer interaction laboratory at The Hong Kong
            University of Science and Technology (Guangzhou), led by{' '}
            <a
              className="inline-link"
              href="http://cma.hkust-gz.edu.cn/faculty-regular/mirjana-prpa/"
              target="_blank"
              rel="noreferrer"
            >
              Prof. Mirjana Prpa
            </a>
            .
          </motion.p>
        </motion.div>

        <motion.div
          className="construction-panel"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.16, duration: 0.8, ease: easeCurve }}
          aria-label="Construction animation"
        >
          <div className="crane" aria-hidden="true">
            <span className="crane__tower" />
            <span className="crane__arm" />
            <span className="crane__counterweight" />
            <span className="crane__cable" />
            <span className="crane__hook" />
          </div>

          <div className="cat-builder" aria-hidden="true">
            <ConstructionCat />
          </div>

          <div className="site-frame" aria-hidden="true">
            <span className="site-frame__edge site-frame__edge--left" />
            <span className="site-frame__edge site-frame__edge--right" />
            <span className="site-frame__edge site-frame__edge--bottom" />

            <span className="build-row build-row--1" />
            <span className="build-row build-row--2" />
            <span className="build-row build-row--3" />
            <span className="build-row build-row--4" />

            <span className="status-pill">assembling</span>
          </div>

          <div className="ground-stripe" aria-hidden="true" />
        </motion.div>

        <motion.ul
          className="focus-list"
          initial="hidden"
          animate="visible"
          variants={reveal}
        >
          <li>
            Research at the intersection of AI, HCI, and XR through experiential,
            human-centered, and interdisciplinary technology design.
          </li>
          <li>
            Embodied, immersive, and AI-driven systems for health, well-being, and
            education.
          </li>
          <li>
            User experience methods, including micro-phenomenology, and human-AI
            collaboration through synthetic data and interactive systems.
          </li>
        </motion.ul>
      </section>
    </main>
  )
}
