import { createContext, useContext, type ReactNode } from 'react'
import { DndContext, PointerSensor, KeyboardSensor, closestCenter, useSensor, useSensors, type Active } from '@dnd-kit/core'
import { SortableContext, useSortable, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { buttonClass } from './portalStyles'

const DisabledContext = createContext(false)
const itemLabel = (active: Active) => String(active.data.current?.label ?? 'Item')

type SortableListProps = {
  ids: string[]
  onReorder: (activeId: string, overId: string) => void
  disabled?: boolean
  children: ReactNode
}

export function SortableList({ ids, onReorder, disabled = false, children }: SortableListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates, scrollBehavior: 'auto' })
  )
  const position = (id: string | number) => ids.indexOf(String(id)) + 1
  return (
    <DisabledContext.Provider value={disabled}>
      <DndContext sensors={sensors} collisionDetection={closestCenter}
        accessibility={{
          restoreFocus: true,
          screenReaderInstructions: { draggable: 'To reorder, focus the move handle and press Space or Enter to pick up. Use the arrow keys to move. Press Space or Enter again to drop, or Escape to cancel. Up and Down buttons are also available.' },
          announcements: {
            onDragStart: ({ active }) => `${itemLabel(active)} picked up. Position ${position(active.id)} of ${ids.length}.`,
            onDragOver: ({ active, over }) => over ? `${itemLabel(active)} moved to position ${position(over.id)} of ${ids.length}.` : `${itemLabel(active)} is outside the list.`,
            onDragEnd: ({ active, over }) => over ? `${itemLabel(active)} dropped at position ${position(over.id)} of ${ids.length}.` : `${itemLabel(active)} returned to its original position.`,
            onDragCancel: ({ active }) => `Reordering cancelled. ${itemLabel(active)} returned to its original position.`
          }
        }}
        onDragEnd={({ active, over }) => {
          if (!disabled && over && active.id !== over.id && ids.includes(String(active.id)) && ids.includes(String(over.id))) onReorder(String(active.id), String(over.id))
        }}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy} disabled={disabled}>
          <div role="list">{children}</div>
        </SortableContext>
      </DndContext>
    </DisabledContext.Provider>
  )
}

type SortableItemProps = {
  id: string
  label: string
  disabled?: boolean
  children: (handle: ReactNode) => ReactNode
}

export function SortableItem({ id, label, disabled = false, children }: SortableItemProps) {
  const listDisabled = useContext(DisabledContext)
  const locked = disabled || listDisabled
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, isDragging } = useSortable({ id, disabled: locked, data: { label }, transition: null })
  const handle = (
    <button type="button" ref={setActivatorNodeRef} {...attributes} {...listeners}
      aria-label={`Reorder ${label}`} disabled={locked}
      className={`${buttonClass} touch-none select-none !cursor-grab active:!cursor-grabbing disabled:!cursor-not-allowed motion-reduce:transition-none`}
    ><span aria-hidden="true">⠿</span> Drag</button>
  )
  return (
    <div ref={setNodeRef} role="listitem" className={`relative min-w-0 ${isDragging ? 'z-20 bg-site shadow-xl ring-1 ring-accent' : ''}`}
      style={{ transform: CSS.Translate.toString(transform) }}>
      {children(handle)}
    </div>
  )
}
