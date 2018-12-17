import React, { Suspense } from 'react'
import styled from 'astroturf'
import { Navbar, Nav } from 'react-bootstrap'
import Content from './Content'
import Header from './Header'
import * as Store from '../store'

const propTypes = {}

const Body = styled('div')`
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
  height: 100vh;
  min-width: 0;
  max-width: 100vw;
`

const GridHeader = styled(Header)`
  grid-column: 1 / 3;
`
const Main = styled('main')`
  position: relative;
  height: 100%;
`

const Footer = styled(Navbar)`
  grid-column: 2 / 3;
`

function App({ data }) {
  return (
    <Suspense fallback={'loading...'}>
      {}
      <Body>
        <Store.Provider>
          <GridHeader />
          <aside />
          <Main>
            <Content />
          </Main>
          <Footer bg="dark" variant="dark">
            <Nav as="div">
              <Nav.Link>footer</Nav.Link>
            </Nav>
          </Footer>
          {/* <Editor onChange={() => console.log('heeree')} /> */}
        </Store.Provider>
      </Body>
    </Suspense>
  )
}

App.propTypes = propTypes

export default App
