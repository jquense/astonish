import * as React from 'react'
import { css } from 'astroturf'
import { trimStart } from 'lodash'
import TabDnDProvider from './TabDnD'
import SplitPane from 'react-split-pane'

import { useBoundActions, useStoreState } from '../store'
import { movePane } from '../actions'
import { PanePosition } from '../types'
import Pane from './Pane'
import { SplitPaneSpec, PaneSpec } from '../store/paneLayoutReducer'

const propTypes = {}

const _ = css`
  :global {
    .Resizer {
      box-sizing: border-box;
      background: #000;
      opacity: 0.5;
      z-index: 1;
      background-clip: padding-box;
    }

    .Resizer:hover {
      transition: all 2s ease;
    }

    .Resizer.horizontal {
      min-height: 11px;
      margin: -5px 0;
      border-top: 5px solid rgba(255, 255, 255, 0);
      border-bottom: 5px solid rgba(255, 255, 255, 0);
      cursor: row-resize;
      width: 100%;
    }

    .Resizer.horizontal:hover {
      border-top: 5px solid rgba(0, 0, 0, 0.5);
      border-bottom: 5px solid rgba(0, 0, 0, 0.5);
    }

    .Resizer.vertical {
      width: 11px;
      margin: 0 -5px;
      border-left: 5px solid rgba(255, 255, 255, 0);
      border-right: 5px solid rgba(255, 255, 255, 0);
      cursor: col-resize;
    }

    .Resizer.vertical:hover {
      border-left: 5px solid rgba(0, 0, 0, 0.5);
      border-right: 5px solid rgba(0, 0, 0, 0.5);
    }

    .vertical section {
      width: 100vh;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
  }
`

function renderPanes(panes: SplitPaneSpec | PaneSpec, path?: string) {
  if ('split' in panes)
    return (
      <SplitPane defaultSize="50%" split={panes.split}>
        {renderPanes(panes.content[0], trimStart(`${path}.content[0]`, '.'))}
        {renderPanes(panes.content[1], trimStart(`${path}.content[1]`, '.'))}
      </SplitPane>
    )

  return <Pane tabs={panes.tabs} path={path} />
}

function Content() {
  const panes = useStoreState(s => s.paneLayout.panes)

  return <TabDnDProvider>{renderPanes(panes, 'panes')}</TabDnDProvider>
}

Content.propTypes = propTypes

const actions = {
  move: (pathFrom: string, pathTo: string, position: PanePosition) =>
    movePane({
      pathFrom,
      pathTo,
      position,
    }),
}

export const usePaneActions = () => useBoundActions(actions)

export default Content
