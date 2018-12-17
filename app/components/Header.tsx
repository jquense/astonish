import { useCallback } from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import FormCheck from 'react-bootstrap/lib/FormCheck'

import { useStoreDispatch, useStoreState } from '../store'
import { USE_TRANSFORMER } from '../ActionTypes'
import * as React from 'react'
import OptionsModal from './OptionsModal'

const propTypes = {}

function Header(props: any) {
  const [show, setShow] = React.useState(false)
  const { useTransformer } = useStoreState(s => s.transforming)
  const dispatch = useStoreDispatch()

  const onToggle = useCallback(
    e =>
      dispatch({
        type: USE_TRANSFORMER,
        payload: e.target.checked,
      }),
    [useTransformer]
  )

  return (
    <Navbar bg="dark" variant="dark" {...props}>
      <Nav as="div">
        <Nav.Link>Header</Nav.Link>
      </Nav>

      <Navbar.Text className="ml-auto">
        <FormCheck
          id="use-transform"
          onChange={onToggle}
          checked={useTransformer}
          label="Transform"
        />
      </Navbar.Text>
      <Nav>
        <Nav.Link onClick={() => setShow(true)}>Edit</Nav.Link>
      </Nav>
      <OptionsModal show={show} onHide={() => setShow(false)} language="json" />
    </Navbar>
  )
}

Header.propTypes = propTypes

export default Header
