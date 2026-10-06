import { Link } from 'react-router-dom'
import type { ProjectMaterial, ProjectSection } from '../../lib/portal/types'
import { cn } from '../../lib/cn'
import { RichTextView } from '../portal/RichTextView'
import { projectWidth, projectLabel, ProjectReveal } from './ProjectReveal'

function MaterialSection({ section }: { section: ProjectSection }) {
  const isSplit = section.layout === 'image-left' || section.layout === 'image-right'
  const imageBlock = section.layout !== 'text' && <div className={cn('grid min-w-0 gap-6', section.layout === 'gallery' && 'grid-cols-2 max-[600px]:grid-cols-1')}>
    {section.images.filter(image => image.url).map((image, i) => <figure className="m-0 min-w-0" key={`${image.url}-${i}`}><div className="relative aspect-[4/3] overflow-hidden bg-panel"><img className="absolute inset-0 h-full w-full object-cover" src={image.url} alt={image.alt} loading="lazy" /></div>{image.caption && <figcaption className="mt-3 text-sm leading-relaxed text-ink-soft">{image.caption}</figcaption>}</figure>)}
  </div>
  const copy = <div className="min-w-0"><h2 className="mb-6 mt-0 break-words text-[clamp(2rem,4vw,3.5rem)] font-medium leading-tight tracking-[-0.04em]">{section.heading}</h2><RichTextView content={section.body} />{section.linkUrl && /^https?:\/\//i.test(section.linkUrl) && <a href={section.linkUrl} className="mt-6 inline-flex min-h-11 items-center gap-4 border-b border-accent text-sm text-ink no-underline" target="_blank" rel="noopener noreferrer">{section.linkLabel || 'Read more'} <span aria-hidden="true">↗</span></a>}</div>
  return <ProjectReveal className={cn('grid gap-9 border-t border-line py-[clamp(3rem,7vw,6rem)]', isSplit && 'grid-cols-2 items-center gap-x-[clamp(2rem,6vw,6rem)] max-[800px]:grid-cols-1')}>
    {section.layout === 'image-left' ? <>{imageBlock}{copy}</> : <>{copy}{imageBlock}</>}
  </ProjectReveal>
}

export function MaterialProject({ data, preview = false }: { data: ProjectMaterial; preview?: boolean }) {
  return <article>
    <header className="relative isolate overflow-hidden bg-black text-white">
      {data.hero && <img src={data.hero} alt={data.heroAlt} className="absolute inset-0 -z-20 h-full w-full object-cover" />}
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/65 to-black/35" />
      <div className={cn(projectWidth, 'flex min-h-[36rem] flex-col justify-between py-10 max-[600px]:min-h-[32rem]')}>
        <Link className="w-fit text-sm text-white/80 no-underline" to="/projects">← All projects</Link>
        <div className="max-w-[45rem] py-12"><p className="font-mono text-xs tracking-widest text-white/70 uppercase">{preview ? 'Project preview' : 'FEAR Lab · Research'}</p><h1 className="m-0 break-words text-[clamp(2.8rem,6vw,6rem)] font-medium leading-[1.03] tracking-[-0.055em]">{data.title || 'Untitled project'}</h1><p className="mb-0 mt-7 max-w-[45ch] text-xl leading-relaxed text-white/85">{data.subtitle}</p></div>
        <p className="m-0 max-w-2xl border-t border-white/30 pt-5 text-sm leading-relaxed text-white/80">{data.authors}</p>
      </div>
    </header>
    <div className={projectWidth}>{data.sections.map(section => <MaterialSection key={section.id} section={section} />)}<footer className="grid grid-cols-2 gap-8 border-t border-line py-14 max-[600px]:grid-cols-1"><div><p className={projectLabel}>Project leader</p><p className="text-2xl">{data.leader}</p></div><div><p className={projectLabel}>Supervisor</p><p className="text-2xl">{data.supervisor}</p></div></footer></div>
  </article>
}
