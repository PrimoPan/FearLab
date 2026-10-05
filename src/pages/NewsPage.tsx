import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { newsItems } from '../content/siteContent'
import { reveal, staggerIn } from '../lib/animations'
import { Eyebrow } from '../components/ui/Eyebrow'

export function NewsPage() {
  const reduceMotion = useReducedMotion()

  return (
    <motion.section
      className="relative z-[1] mx-auto w-[min(var(--page-max),calc(100%_-_(var(--gutter)_*_2)))] pb-16 pt-[clamp(1.6rem,4vw,2.8rem)]"
      initial={reduceMotion ? false : 'hidden'}
      animate="visible"
      variants={staggerIn}
      aria-labelledby="news-title"
    >
      <motion.header className="mb-[clamp(2rem,5vw,4rem)]" variants={reveal}>
        <Eyebrow label="From the lab" />
        <h1 id="news-title" className="m-0 text-[clamp(3.5rem,9vw,6.1rem)] leading-[0.93] tracking-[-0.06em]">
          News<span className="text-accent">.</span>
        </h1>
      </motion.header>

      <ul className="m-0 list-none border-t border-line p-0">
        {newsItems.map((item) => (
          <motion.li key={item.slug} variants={reveal}>
            <Link
              to={`/news/${item.slug}`}
              className="group grid grid-cols-[10rem_minmax(0,1fr)_auto] items-start gap-x-8 gap-y-3 border-b border-line py-[clamp(1.5rem,3vw,2.5rem)] text-inherit no-underline transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent max-[700px]:grid-cols-[minmax(0,1fr)_auto]"
            >
              <span className="pt-1 font-mono text-[0.68rem] tracking-[0.12em] text-ink-soft uppercase max-[700px]:col-span-2">
                {item.category} · {item.year}
              </span>
              <div>
                <h2 className="m-0 text-[clamp(1.6rem,3.5vw,2.5rem)] leading-tight tracking-[-0.045em]">
                  {item.title}
                </h2>
                <p className="mb-0 mt-3 max-w-[48ch] text-base leading-relaxed text-ink-soft">
                  {item.summary}
                </p>
              </div>
              <span className="mt-1 inline-block text-2xl text-accent transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true">↗</span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  )
}
