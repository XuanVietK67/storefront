import { ref, type Ref } from 'vue'
import type { CanvasElement } from '@/types'

export function useHistory(elements: Ref<CanvasElement[]>) {
  const undoStack = ref<CanvasElement[][]>([])
  const redoStack = ref<CanvasElement[][]>([])

  function snapshot(): CanvasElement[] {
    return JSON.parse(JSON.stringify(elements.value)) as CanvasElement[]
  }

  function saveUndo(): void {
    undoStack.value.push(snapshot())
    redoStack.value = []
  }

  function doUndo(
    restoreFn: (snap: CanvasElement[]) => void,
    toastFn?: (msg: string) => void,
  ): void {
    if (!undoStack.value.length) {
      toastFn?.('Nothing to undo')
      return
    }
    redoStack.value.push(snapshot())
    restoreFn(undoStack.value.pop()!)
    toastFn?.('↩ Undone')
  }

  function doRedo(
    restoreFn: (snap: CanvasElement[]) => void,
    toastFn?: (msg: string) => void,
  ): void {
    if (!redoStack.value.length) {
      toastFn?.('Nothing to redo')
      return
    }
    undoStack.value.push(snapshot())
    restoreFn(redoStack.value.pop()!)
    toastFn?.('↪ Redone')
  }

  return { undoStack, redoStack, saveUndo, doUndo, doRedo }
}
