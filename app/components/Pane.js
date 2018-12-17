import React from 'react'

import { trimStart } from 'lodash'
import { Tab, Nav } from 'react-bootstrap'
import EditorTab from './EditorTab'
import PaneBody from './PaneBody'

import AstPane from './AstPane'
import InputPane from './InputPane'

import styled from 'astroturf'

const TabComponents = {
  input: InputPane,
  ast: AstPane,
}
const Container = styled('div')`
  width: 100%;
  height: 100%;
`

const TabList = styled(Nav)`
  height: 40px;
`

const TabPane = styled(Tab.Pane)`
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: auto;
`

const propTypes = {}

function Pane({ tabs, path }) {
  return (
    <Tab.Container defaultActiveKey={tabs[0]} transition={false}>
      <Container>
        <TabList variant="tabs">
          {tabs.map((tab, idx) => (
            <EditorTab
              key={tab}
              eventKey={tab}
              path={trimStart(`${path}.tabs[${idx}]`, '.')}
            >
              {tab}
            </EditorTab>
          ))}
        </TabList>
        <PaneBody path={path}>
          {tabs.map(tab => (
            <TabPane eventKey={tab} key={tab}>
              {TabComponents[tab]
                ? React.createElement(TabComponents[tab])
                : tab}
            </TabPane>
          ))}
        </PaneBody>
      </Container>
    </Tab.Container>
  )
}

Pane.propTypes = propTypes

export default Pane
