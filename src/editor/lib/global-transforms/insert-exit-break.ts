import { Editor, Path, Range, Transforms } from 'slate'
import { createDefaultElement } from '../../elements'
import { GlobalQueries } from '../global-queries'

export function insertExitBreak(editor: Editor) {
  if (!editor.selection) return

  if (Range.isExpanded(editor.selection)) {
    Transforms.delete(editor, { at: editor.selection })
  }

  const blockEntry = GlobalQueries.getAbove(editor, {
    type: 'block',
    mode: 'lowest',
  })
  if (!blockEntry) return

  const [, blockPath] = blockEntry
  const [isStart, isEnd] = GlobalQueries.isOnEdges(editor, {
    of: blockPath,
  })

  if (isEnd) {
    Transforms.insertNodes(editor, createDefaultElement(), { select: true })
    return
  }

  if (isStart) {
    Transforms.insertNodes(editor, createDefaultElement(), { select: false })
    Transforms.select(
      editor,
      Editor.point(editor, Path.next(blockPath), { edge: 'start' })
    )
    return
  }

  Transforms.splitNodes(editor, {
    mode: 'highest',
  })
}