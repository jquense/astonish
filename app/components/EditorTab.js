import React from 'react'
import { Nav } from 'react-bootstrap'

import { useDragSource } from './TabDnD'

const propTypes = {}

function EditorTab({ children, path, ...props }) {
  const dragProps = useDragSource({
    getData: () => ({ path }),
  })

  return (
    <Nav.Link {...props} {...dragProps}>
      {children}
    </Nav.Link>
  )
}

EditorTab.propTypes = propTypes

export default EditorTab
