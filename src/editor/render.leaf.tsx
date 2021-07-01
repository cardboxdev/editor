import React, { ReactElement, ReactHTML } from 'react'
import { RenderLeafProps } from 'slate-react'
import { GlobalQueries } from './lib/global-queries'
import { LeafModification } from './types'

type ElementMapper = Record<LeafModification, keyof ReactHTML>

const ELEMENT_MAPPER: ElementMapper = {
  bold: 'b',
  italic: 'em',
  underlined: 'u',
  inlineCode: 'code',
}

function buildElement({ leaf, children, attributes }: RenderLeafProps) {
  if (leaf.prismToken) {
    return (
      <span className={`token ${leaf.prismToken}`} {...attributes}>
        {children}
      </span>
    )
  }

  const modifications = GlobalQueries.leafModifications(leaf)

  let wrapped: ReactElement = children

  for (const modification of modifications) {
    const elementType = ELEMENT_MAPPER[modification]
    wrapped = React.createElement(elementType, null, wrapped)
  }

  if (leaf.prismToken) {
    wrapped = <span className={`token ${leaf.prismToken}`}>{wrapped}</span>
  }

  if (leaf.href) {
    wrapped = (
      <a href={leaf.href} target="_blank">
        {wrapped}
      </a>
    )
  }

  if (wrapped === children) {
    // simple text
    wrapped = <span>{wrapped}</span>
  }

  return React.cloneElement(wrapped, attributes)
}

const LeafComponent = (props: RenderLeafProps) => {
  return buildElement(props)
}

export function renderLeaf(props: RenderLeafProps) {
  return <LeafComponent {...props} />
}
