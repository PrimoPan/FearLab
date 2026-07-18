import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '../../lib/cn'

type FocusListProps = Omit<HTMLMotionProps<'ul'>, 'children'> & {
  items: readonly string[]
  wide?: boolean
}

const listClasses = cn(
  'col-start-1 m-0 grid list-none gap-[0.8rem] self-start p-0',
  'max-[1024px]:col-auto max-[1024px]:w-full max-[1024px]:max-w-none'
)

const itemClasses = cn(
  "relative pl-[1.1rem] text-[0.98rem] leading-[1.75] text-ink-soft",
  "before:absolute before:left-0 before:top-[0.78rem] before:size-[0.42rem] before:rounded-full before:bg-accent before:content-['']",
  'before:shadow-[0_0_18px_color-mix(in_srgb,var(--accent)_30%,transparent)]',
  'max-[700px]:pl-[0.95rem] max-[700px]:text-[0.9rem] max-[700px]:leading-[1.58]'
)

export function FocusList({ items, wide, className, ...motionProps }: FocusListProps) {
  return (
    <motion.ul
      className={cn(listClasses, wide ? 'max-w-[36rem]' : 'max-w-[34rem]', className)}
      {...motionProps}
    >
      {items.map((item) => (
        <li key={item} className={itemClasses}>
          {item}
        </li>
      ))}
    </motion.ul>
  )
}
