import React from 'react'
import styled from 'astroturf'
import { Navbar, Nav } from 'react-bootstrap'
import Content from './Content'
const propTypes = {}

const Body = styled('div')`
  display: grid;
  grid-template-columns: 200px 1fr;
  grid-template-rows: auto 1fr auto;
  grid-gap: 10px;
  height: 100vh;
`

const Header = styled(Navbar)`
  grid-column: 1 / 3;
`
const Main = styled('main')`
  position: relative;
`

const Footer = styled(Navbar)`
  height: 100%;
  grid-column: 2 / 3;
`

function App(props) {
  return (
    <Body>
      <Header bg="dark" variant="dark">
        <Nav as="div">
          <Nav.Link>Header</Nav.Link>
        </Nav>
      </Header>
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
    </Body>
  )
}

App.propTypes = propTypes

export default App
