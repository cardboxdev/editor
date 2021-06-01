import { Editor, Point, Range, Transforms } from 'slate'
import { Queries } from '../common/queries'
import { createDefaultElement } from '../elements'
import { ActionCallback } from '../lib/action-controller/types'

/*
 * Bound to 'enter' key
 *
 * 1. The action always deletes the selected text
 *
 * 2. When selection is on the block end
 *    - insert a new default block after the current
 *    - move the focus there
 *    (the priority is higher since we need to move
 *     the selection to the new block's start)
 *
 * 3. When selection is on the block start
 *    - insert a new default block before the current
 *    - the focus should be in the same place as it was
 *
 * 4. When selection is on the block middle
 *    - insert a new block with the same type as the current has
 *    - move the contents from the right side into this block
 *    - move the focus at the start of the new block
 */
export const handler: ActionCallback<Editor> = (editor, event) => {
  if (!editor.selection) return

  event.preventDefault()

  if (Range.isExpanded(editor.selection)) {
    // 1. Delete the selected text
    Transforms.delete(editor, { at: editor.selection })
  }

  const blockEntry = Queries.getAbove(editor, {
    type: 'block',
    mode: 'highest',
  })
  if (!blockEntry) return

  const [, blockPath] = blockEntry
  const [blockStart, blockEnd] = Editor.edges(editor, blockPath)
  const selectionPoint = Range.start(editor.selection)

  // 3. The selection is on the block end
  // The priority is higher since we need to select the new block in this case
  if (Point.equals(selectionPoint, blockEnd)) {
    Transforms.insertNodes(editor, createDefaultElement(), {
      at: selectionPoint,
      select: true,
    })
    return
  }

  // 2. The selection is on the block start
  if (Point.equals(selectionPoint, blockStart)) {
    Transforms.insertNodes(editor, createDefaultElement(), {
      at: selectionPoint,
      select: false,
    })
    return
  }

  // 4. The selection is on the block middle
  Transforms.splitNodes(editor, {
    at: selectionPoint,
    mode: 'highest',
  })
}
