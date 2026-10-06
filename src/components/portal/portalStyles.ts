import { cn } from '../../lib/cn'

export const fieldClass = 'box-border w-full min-w-0 rounded-none border border-line bg-panel px-3 py-3 font-sans text-base text-ink outline-none focus:border-accent focus:ring-1 focus:ring-accent disabled:opacity-50'
export const labelClass = 'mb-2 block text-sm text-ink-soft'
export const buttonClass = 'inline-flex min-h-11 cursor-pointer items-center justify-center gap-2 border border-line bg-transparent px-4 py-2 text-sm text-ink transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-wait disabled:opacity-50'
export const primaryClass = cn(buttonClass, 'border-accent bg-accent text-[var(--bg)] hover:bg-transparent hover:text-accent')
export const statusLabels = { draft: 'Draft', submitted: 'Awaiting review', changes: 'Changes requested', approved: 'Published' }
