import { characterLayers, posterUrl } from '../../content/recruitingAssets'
import { cn } from '../../lib/cn'

type RecruitingPosterArtworkProps = {
  alt: string
  className?: string
  loading: 'eager' | 'lazy'
}

export function RecruitingPosterArtwork({ alt, className, loading }: RecruitingPosterArtworkProps) {
  return (
    <span className={cn('relative block aspect-[1728/1117] overflow-hidden', className)}>
      <img
        src={posterUrl}
        alt={alt}
        width={1728}
        height={1117}
        loading={loading}
        decoding="async"
        draggable={false}
        className="block h-auto w-full"
      />
      {/* Original viewBox frame: x 1384.32, y 615.65, width 279.68, height 445.35. */}
      <span
        className="pointer-events-none absolute left-[80.1111111111%] top-[55.1163831692%] h-[39.8701880036%] w-[16.1851851852%] overflow-hidden motion-reduce:hidden"
        aria-hidden="true"
      >
        {characterLayers.map(layer => (
          <img key={layer.order} src={layer.src} alt="" loading={loading} draggable={false} className="absolute inset-0 h-full w-full object-contain" style={{ zIndex: layer.order }} />
        ))}
      </span>
    </span>
  )
}
