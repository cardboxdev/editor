import React, { CSSProperties, MouseEventHandler, ReactNode } from 'react'
import { Editor } from 'slate'
import { actions } from '../../actions'
import { LeafModification } from '../../../entities/leaf/types'
import { Action } from '../../../lib/action-controller/types'
import { useEditor } from '../../../lib/hooks/use-editor'
import { useUI } from '../../../lib/hooks/use-ui'
import { noopKeyboardEvent } from '../../../lib/util'
import { ToolbarButton } from './common'

function hasModification(editor: Editor, modification: LeafModification) {
  const marks = Editor.marks(editor)
  if (!marks) return false
  return Boolean(marks[modification])
}

interface Props {
  modification: LeafModification
  icon: ReactNode
  action: Action
  tooltip?: string
  style?: CSSProperties
}

export const ToolbarModificationButton = ({
  modification,
  icon,
  action,
  tooltip,
  style = {},
}: Props) => {
  const editor = useEditor()
  const isActive = hasModification(editor, modification)
  const ui = useUI()

  const handleClick: MouseEventHandler<Element> = (event) => {
    event.preventDefault()

    actions.execute(action, {
      editor,
      event: noopKeyboardEvent,
      ui,
    })
  }

  return (
    <ToolbarButton
      icon={icon}
      isActive={isActive}
      tooltip={tooltip}
      onClick={handleClick}
      style={style}
    />
  )
}
