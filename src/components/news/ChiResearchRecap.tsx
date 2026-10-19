import { useState } from 'react'
import presentationPhoto from '../../../assets/News/chi2026/mengxu-panxin-presentation.jpg'
import discussionPhoto from '../../../assets/News/chi2026/mengxu-panxin-discussion.jpg'
import { chiAcceptedPapers } from '../../content/siteContent'
import { PhotoLightbox } from '../ui/PhotoLightbox'
import { NewsSection } from './NewsSection'

const photos = [
  {
    src: presentationPhoto,
    alt: 'Two presenters at CHI 2026 beneath the title slide for the paper on foreign language speaking anxiety in social VR.',
    caption: 'Presenting the social VR study at CHI 2026.'
  },
  {
    src: discussionPhoto,
    alt: 'The presenters discussing their social VR study, with the FEAR Lab logo and paper link on the screen.',
    caption: 'Sharing the findings in Barcelona.'
  }
]

export function ChiResearchRecap() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <NewsSection kicker="From Barcelona" intro="Explore Mengxu Pan’s two CHI 2026 papers and moments from the social VR presentation.">
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] items-start gap-[clamp(1.75rem,4vw,3.5rem)] max-[900px]:grid-cols-1">
        <div>
          <h2 className="m-0 mb-6 text-[clamp(2rem,4vw,3rem)] leading-[1.05] tracking-[-0.05em]">Ideas from the lab,<br />shared at CHI.</h2>
          <ol className="m-0 list-none p-0">
            {chiAcceptedPapers.map((paper, index) => (
              <li key={paper.title} className="border-t border-line py-6 last:border-b">
                <p className="m-0 mb-3 font-mono text-[0.62rem] tracking-[0.15em] text-accent uppercase">0{index + 1} / {paper.track}</p>
                <h3 className="m-0 text-[clamp(1.2rem,2vw,1.6rem)] leading-[1.35] tracking-[-0.035em]">
                  <a href={paper.href} target="_blank" rel="noreferrer" className="decoration-accent/60 underline-offset-4 hover:text-accent hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                    {paper.title}
                  </a>
                </h3>
                <a href={paper.href} target="_blank" rel="noreferrer" className="mt-3 inline-flex min-h-11 items-center gap-3 text-sm text-accent no-underline hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent" aria-label={`Read paper: ${paper.title}`}>
                  Read paper <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
        <div className="grid grid-cols-2 items-start gap-3 sm:gap-5" role="group" aria-label="CHI 2026 presentation photos">
          {photos.map((photo, index) => (
            <figure key={photo.src} className={`m-0 min-w-0 ${index === 1 ? 'mt-9' : ''}`}>
              <button type="button" onClick={() => setSelected(index)} aria-label={`Enlarge photo: ${photo.caption}`} aria-haspopup="dialog" className="block w-full cursor-zoom-in overflow-hidden rounded-[1.2rem] border border-line bg-panel p-0 transition-transform duration-300 hover:-translate-y-1 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transform-none motion-reduce:transition-none">
                <img src={photo.src} alt={photo.alt} width={1279} height={2275} loading="lazy" decoding="async" className="h-auto w-full" />
              </button>
              <figcaption className="mt-3 text-xs leading-relaxed text-ink-soft">{photo.caption}</figcaption>
            </figure>
          ))}
        </div>
      </div>
      <PhotoLightbox photo={selected === null ? null : photos[selected]} onClose={() => setSelected(null)} />
    </NewsSection>
  )
}
