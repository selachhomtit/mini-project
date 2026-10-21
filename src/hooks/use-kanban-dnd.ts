import * as React from "react"

/**
 * Native HTML5 drag-and-drop for kanban boards.
 * Spread `cardProps(id, status)` on a card and `columnProps(status)` on a column;
 * `onDrop(id, status)` fires when a card lands in a different column.
 */
export function useKanbanDnd<S extends string>(onDrop: (id: string, status: S) => void) {
  const [dragging, setDragging] = React.useState<{ id: string; from: S } | null>(null)
  const [overColumn, setOverColumn] = React.useState<S | null>(null)

  const reset = () => {
    setDragging(null)
    setOverColumn(null)
  }

  const cardProps = (id: string, status: S) => ({
    draggable: true,
    onDragStart: (e: React.DragEvent) => {
      e.dataTransfer.effectAllowed = "move"
      e.dataTransfer.setData("text/plain", id)
      setDragging({ id, from: status })
    },
    onDragEnd: reset,
  })

  const columnProps = (status: S) => ({
    onDragOver: (e: React.DragEvent) => {
      if (!dragging) return
      e.preventDefault()
      e.dataTransfer.dropEffect = "move"
      if (overColumn !== status) setOverColumn(status)
    },
    onDragLeave: (e: React.DragEvent) => {
      if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
        setOverColumn((c) => (c === status ? null : c))
      }
    },
    onDrop: (e: React.DragEvent) => {
      e.preventDefault()
      if (dragging && dragging.from !== status) onDrop(dragging.id, status)
      reset()
    },
  })

  return {
    cardProps,
    columnProps,
    draggingId: dragging?.id ?? null,
    isOver: (status: S) => overColumn === status && dragging?.from !== status,
  }
}
