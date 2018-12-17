import React, { useState } from 'react'
import * as Iter from 'iter-tools'
import styled from 'astroturf'

import { useStoreState, useStoreDispatch } from '../store'
import { hoverNode, leaveNode } from '../actions'
import Tree from './Tree'
import CompactValue from './CompactValue'

const Container = styled.div`
  display: contents;
  font-family: monospace;
`

const Ul = styled.ul`
  list-style: none;
  padding-left: 2em;
`

function inRange(range, pos) {
  return pos >= range[0] && pos <= range[1]
}

function getRangeFromValue(value, parser) {
  let range = value && parser.getNodeRange(value)
  if (range) return range

  if (value.length > 0) {
    const first = value[0]
    const last = value[value.length - 1]
    const rangeFirst = first && parser.getNodeRange(first)
    const rangeLast = last && parser.getNodeRange(last)

    if (rangeFirst && rangeLast) return [rangeFirst[0], rangeLast[1]]
  }
  return null
}

function useNodeHighlight(value, parser) {
  const dispatch = useStoreDispatch()
  let range = value && getRangeFromValue(value, parser)

  return {
    onMouseOver(e) {
      if (!range) return
      e.stopPropagation()
      dispatch(hoverNode({ range }))
    },
    onMouseLeave() {
      range && dispatch(leaveNode())
    },
  }
}

function Element({ item, parser, isRoot }) {
  let { value, key, computed } = item

  const isComplex = value && typeof value === 'object'
  const hoverHandlers = useNodeHighlight(value, parser)

  const [expanded, onToggle] = useState(
    isComplex && parser.expandedByDefault(value, key)
  )
  let Component = isRoot ? React.Fragment : 'li'

  let label = key ? `${key}: ` : parser.getNodeName(value)

  if (isComplex) {
    const isArray = Array.isArray(value)

    const renderLabel = expanded => (
      <>
        {label}
        {!expanded ? (
          <CompactValue isArray={isArray} value={value} />
        ) : isArray ? (
          '   ['
        ) : (
          '   {'
        )}
      </>
    )
    const children = Array.from(
      Iter.map(
        child => <Element parser={parser} item={child} parent={item} />,
        parser.propertiesForNode(value)
      )
    )
    const hasChildren = !!children.filter(Boolean).length
    return (
      <Component {...(!isRoot ? hoverHandlers : undefined)}>
        <Tree
          collapsible={hasChildren}
          renderLabel={renderLabel}
          expanded={expanded}
          onToggle={onToggle}
        >
          <Ul>{children}</Ul>
        </Tree>
        {hasChildren && expanded && (isArray ? ']' : '}')}
      </Component>
    )
  }

  return (
    <li>
      {label}
      {value}
    </li>
  )
}

function AstPane() {
  const { ast, parser } = useStoreState(s => s.parsing)
  const cursorOffset = useStoreState(s => s.app.cursor.offset)

  return (
    <Container key={``}>
      <Element parser={parser} item={{ value: ast }} isRoot />
    </Container>
  )
}

export default AstPane
