import React from 'react'
import ReactDOM from 'react-dom'
import { Nav } from 'react-bootstrap'

import { useDragSource } from './TabDnD'

const propTypes = {}

function EditorTab({ children, path }) {
  const dragProps = useDragSource({
    getData: () => ({
      path,
    }),
  })

  return (
    <Nav.Link draggable {...dragProps}>
      {children}
    </Nav.Link>
  )
}

EditorTab.propTypes = propTypes

export default EditorTab
