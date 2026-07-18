import { ConstructionScene } from '../components/construction/ConstructionScene'
import { HomeBanner } from '../components/home/HomeBanner'
import { FocusList } from '../components/ui/FocusList'
import { homeFocusPoints } from '../content/siteContent'
import { reveal } from '../lib/animations'
import { cn } from '../lib/cn'

const pageClasses = cn(
  'relative z-[1] mx-auto grid min-h-[calc(100vh-var(--site-header-height))]',
  'w-[min(var(--page-max),calc(100%_-_(var(--gutter)_*_2)))] grid-cols-[minmax(0,1fr)_minmax(320px,0.94fr)]',
  'items-start gap-[clamp(2rem,4vw,4.5rem)] pb-12 pt-[clamp(1.4rem,4vw,2.6rem)]',
  'max-[1024px]:min-h-auto max-[1024px]:grid-cols-1 max-[1024px]:gap-[1.2rem]'
)

export function HomePage() {
  return (
    <section className={pageClasses}>
      <HomeBanner />
      <ConstructionScene />

      <FocusList
        items={homeFocusPoints}
        initial="hidden"
        animate="visible"
        variants={reveal}
      />
    </section>
  )
}
