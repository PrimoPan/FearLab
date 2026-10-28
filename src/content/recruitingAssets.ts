import posterUrl from '../../assets/Contact/recruiting-poster.svg'
import layer1 from '../../assets/Contact/qqshow-hongni/layer-1.gif'
import layer8 from '../../assets/Contact/qqshow-hongni/layer-8.gif'
import layer9 from '../../assets/Contact/qqshow-hongni/layer-9.gif'
import layer11 from '../../assets/Contact/qqshow-hongni/layer-11.gif'
import layer12 from '../../assets/Contact/qqshow-hongni/layer-12.gif'

// Explicit imports let Vite hash the filenames and apply the shared COS base URL.
export { posterUrl }

export const characterLayers: { order: number; src: string }[] = [
  { order: 1, src: layer1 },
  { order: 8, src: layer8 },
  { order: 9, src: layer9 },
  { order: 11, src: layer11 },
  { order: 12, src: layer12 }
]
