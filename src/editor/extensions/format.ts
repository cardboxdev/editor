import { Editor } from 'slate'
import { Queries } from '../common/queries'
import { CustomElementType } from '../elements'
import { LeafModification } from '../leaf'

interface Common {
  trigger?: string
  after?: string | string[]
  between?: string[]
  keepTrigger?: boolean
}

type Specific =
  | {
      type: 'block'
      to: CustomElementType
    }
  | {
      type: 'inline'
      to: LeafModification
    }

type Config = Array<Common & Specific>

function formatWithConfig(editor: Editor, _config: Config): Editor {
  /*
   * TODO: Implement format extension
   * Transform `text`, *text*, _text_, 1., -, etc. to slate blocks/leaves
   */

  const { insertText } = editor

  editor.insertText = (text) => {
    if (Queries.hasSelection(editor)) {
      return insertText(text)
    }

    insertText(text)
  }

  return editor
}

export function format(config: Config) {
  return (editor: Editor) => {
    return formatWithConfig(editor, config)
  }
}
