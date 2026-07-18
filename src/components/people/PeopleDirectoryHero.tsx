import { motion } from 'framer-motion'
import { Eyebrow } from '../ui/Eyebrow'
import { reveal, staggerIn } from '../../lib/animations'

export function PeopleDirectoryHero() {
  return (
    <motion.div
      className="mb-[2.8rem] max-w-[44rem]"
      initial="hidden"
      animate="visible"
      variants={staggerIn}
    >
      <Eyebrow label="People" variants={reveal} />
      <motion.h1
        className="m-0 max-w-[10ch] text-[clamp(3.2rem,8vw,5.4rem)] leading-[0.92] tracking-[-0.06em] max-[700px]:max-w-[6.6ch] max-[700px]:text-[clamp(2.45rem,12vw,3.9rem)] max-[700px]:leading-[0.96]"
        variants={reveal}
      >
        THE FEARless Team.
      </motion.h1>
      <motion.p
        className="mt-[1.15rem] mb-0 max-w-[38rem] text-[clamp(1rem,1.6vw,1.16rem)] leading-[1.78] text-ink-soft max-[700px]:mt-4 max-[700px]:text-[0.98rem] max-[700px]:leading-[1.65]"
        variants={reveal}
      >
        A group of loving researchers, developers, and designers who believe
        their bold ideas can gently change the world.
      </motion.p>
    </motion.div>
  )
}
