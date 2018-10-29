import React from 'react'
import Layout from 'react-tackle-box/Layout'
import { Tab, Nav } from 'react-bootstrap'
import EditorTab from './EditorTab'
import PaneBody from './PaneBody'

import styled from 'astroturf'
const TabPane = styled(Tab.Pane)`
  width: 100%;
  height: 100%;
`

const propTypes = {}

function Pane({ tabs, path }) {
  console.log(tabs)
  return (
    <Tab.Container defaultActiveKey={tabs[0]}>
      <Layout direction="column" grow>
        <Nav variant="tabs">
          {tabs.map((tab, idx) => (
            <EditorTab
              key={tab}
              eventKey={tab}
              path={`${path}.tabs[${idx}]`.trim()}
            >
              {tab}
            </EditorTab>
          ))}
        </Nav>
        <PaneBody path={path}>
          {tabs.map(tab => (
            <TabPane eventKey={tab} key={tab}>
              pane 1
            </TabPane>
          ))}
        </PaneBody>
      </Layout>
    </Tab.Container>
  )
}

Pane.propTypes = propTypes

export default Pane
