import { useState } from 'react'
import sharingPhoto from '../../../assets/Home/lab-gallery-sharing.jpg'
import officialTeamPhoto from '../../../assets/Home/lab-team-official.webp'
import { PhotoLightbox } from '../ui/PhotoLightbox'

const photos = [
  {
    src: sharingPhoto,
    width: 1706,
    height: 1279,
    alt: 'FEAR Lab members sharing ideas around the meeting table beside a gallery of sketches.',
    caption: 'Ideas, shared.'
  },
  {
    src: officialTeamPhoto,
    width: 2560,
    height: 1866,
    alt: 'The FEAR Lab team gathered for the CHI submission review and a birthday celebration.',
    caption: 'Together at the lab.'
  }
]

export function LabSnapshots() {
  const [selected, setSelected] = useState<number | null>(null)

  return (
    <div className="mt-3 w-full" role="group" aria-label="Moments at the lab">
      <div className="ml-auto flex w-full max-w-[33rem] items-start justify-end px-4 pb-10 pt-6 max-[900px]:mx-auto max-[900px]:mt-2">
        {photos.map((photo, index) => (
          <button
            type="button"
            key={photo.src}
            onClick={() => setSelected(index)}
            aria-label={`Enlarge photo: ${photo.caption}`}
            aria-haspopup="dialog"
            className={`relative w-[55%] max-w-[17rem] shrink-0 cursor-zoom-in rounded-[2px] border border-[#fff9ef] bg-[linear-gradient(145deg,#fffaf1,#eee5d6)] p-2.5 pb-5 text-[#6c5b47] shadow-[0_3px_5px_#0003,0_16px_36px_#0004] transition-transform duration-300 focus-visible:z-20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent motion-reduce:transition-none ${index === 0 ? 'z-[1] -mr-[12%] -rotate-[7deg] hover:-rotate-[9deg]' : 'z-[2] mt-12 rotate-[8deg] hover:rotate-[6deg]'}`}
          >
            <span aria-hidden="true" className={`pointer-events-none absolute -top-3 left-[32%] h-6 w-[35%] border-x border-[#e2d2b1]/40 bg-[#dfd1af]/65 shadow-[0_1px_2px_#0001] ${index === 0 ? 'rotate-[4deg]' : '-rotate-[5deg]'}`} />
            <img src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} loading="lazy" decoding="async" className="h-auto w-full" />
            <span className="mt-3 block text-[clamp(0.65rem,1.1vw,0.8rem)] italic leading-normal tracking-[0.01em]">{photo.caption}</span>
          </button>
        ))}
      </div>
      <PhotoLightbox photo={selected === null ? null : photos[selected]} onClose={() => setSelected(null)} />
    </div>
  )
}
