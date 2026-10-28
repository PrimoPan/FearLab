import { Link } from 'react-router-dom'
import { projectWidth } from '../components/projects/ProjectReveal'
import { cn } from '../lib/cn'

const posterUrl = '/assets/recruite.svg'
const characterLayers = [1, 8, 9, 11, 12]
// The “我的QQ秀” panel in the poster's 1728 × 1117 viewBox, above the taskbar.
const characterFrame = { x: 1384.32, y: 615.65, width: 279.68, height: 445.35 }

export function ContactPage() {
  return (
    <section className="relative z-[1] w-full" aria-labelledby="contact-title">
      <h1 id="contact-title" className="sr-only">Contact — Join us</h1>
      <div className="relative isolate aspect-[1728/1117] w-full bg-white" role="img" aria-label="FEAR Lab recruiting poster with an animated QQ Show character.">
        <div
          className="absolute inset-0 -z-10 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${posterUrl}")` }}
          aria-hidden="true"
        />
        <div
          id="qqshow-hongni"
          className="pointer-events-none absolute overflow-hidden"
          style={{
            left: `${characterFrame.x / 1728 * 100}%`,
            top: `${characterFrame.y / 1117 * 100}%`,
            width: `${characterFrame.width / 1728 * 100}%`,
            height: `${characterFrame.height / 1117 * 100}%`
          }}
          aria-hidden="true"
        >
          {characterLayers.map((layer) => (
            <img key={layer} src={`/assets/qqshow-hongni/layer-${layer}.gif`} alt="" className="absolute inset-0 h-full w-full object-contain" style={{ zIndex: layer }} />
          ))}
        </div>
      </div>
      <div className={cn(projectWidth, 'flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-5')}>
        <Link to="/people" className="inline-flex min-h-11 items-center text-sm text-ink-soft no-underline hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">← Back to People</Link>
      </div>
    </section>
  )
}
