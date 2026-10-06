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
              className="group grid grid-cols-[13rem_minmax(0,1fr)_auto] items-center gap-x-8 gap-y-4 border-b border-line py-[clamp(1.5rem,3vw,2.5rem)] text-inherit no-underline transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent max-[700px]:grid-cols-[7rem_minmax(0,1fr)_auto] max-[700px]:gap-x-4"
            >
              <div className="col-start-1 row-span-2 min-w-0 self-center max-[700px]:row-span-1">
                <img src={item.thumbnail} alt={item.thumbnailAlt} width={832} height={374} className="h-auto w-full object-contain" />
              </div>
              <div className="col-start-2 row-start-1 min-w-0">
                <p className="m-0 mb-3 font-mono text-[0.68rem] tracking-[0.12em] text-ink-soft uppercase">
                  {item.category} · {item.year}
                </p>
                <h2 className="m-0 text-[clamp(1.4rem,3.5vw,2.5rem)] leading-tight tracking-[-0.045em]">
                  {item.title}
                </h2>
              </div>
              <p className="col-start-2 row-start-2 m-0 max-w-[48ch] text-base leading-relaxed text-ink-soft max-[700px]:col-span-3 max-[700px]:col-start-1 max-[700px]:text-sm">
                {item.summary}
              </p>
              <span className="col-start-3 row-span-2 row-start-1 inline-block text-2xl text-accent transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 motion-reduce:transform-none max-[700px]:row-span-1" aria-hidden="true">↗</span>
            </Link>
          </motion.li>
        ))}
      </ul>
    </motion.section>
  )
}
