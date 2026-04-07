import { motion } from 'framer-motion'
import { easeCurve } from '../../lib/animations'
import { ConstructionCat } from './ConstructionCat'

export function ConstructionScene() {
  return (
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
  )
}
