import { Editor, Location, Range, Transforms } from 'slate'
import { createListElement } from '../../../elements/list'
import { LocalQueries } from '../queries'
import { mergeSiblings } from './merge-siblings'

interface Options {
  at?: Location
}

export function indent(editor: Editor, options: Options = {}) {
  const { at = editor.selection } = options
  if (!at) return

  if (Range.isRange(at) && Range.isExpanded(at)) return

  const info = LocalQueries.info(editor, { at })
  if (!info) return

  const { lists, items } = info

  if (items.current.meta.isFirst) return
  if (!items.previous) return

  Transforms.wrapNodes(editor, createListElement(lists.current.node.type, []), {
    at: items.current.path,
  })
  Transforms.moveNodes(editor, {
    at: items.current.path,
    to: items.previous.path.concat(items.previous.node.children.length),
  })

  mergeSiblings(editor, { at: items.previous.path })
}