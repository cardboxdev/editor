import { ActionCallback } from '../../../lib/action-controller/types'
import { GlobalMatchers } from '../../../lib/global-matchers'
import { GlobalQueries } from '../../../lib/global-queries'
import { ActionParams } from '../../../registries/actions'
import { createParagraphElement } from '../../paragraph'
import { Path, Transforms } from 'slate'

export const exitBlock: ActionCallback<ActionParams> = ({ editor, event }) => {
  const code = GlobalQueries.getAbove(editor, {
    type: 'block',
    match: GlobalMatchers.block(editor, 'code'),
  })

  if (!code) {
    return { skipped: true }
  }

  const [, codePath] = code

  event.preventDefault()

  Transforms.insertNodes(editor, createParagraphElement(), {
    at: Path.next(codePath),
    select: true,
  })
}
