import React, { useReducer, useContext } from 'react'
import styled, { css } from 'astroturf'
import SplitPane from 'react-split-pane'
import Pane from './Editor/Pane'
import { get, set, toPath, trimStart } from 'lodash'
import TabDnDProvider from './Editor/TabDnD'
import produce from 'immer'

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

const initialState = {
  panes: {
    split: 'vertical',
    content: [
      { tabs: ['bar'] },
      {
        split: 'horizontal',
        content: [
          // -
          { tabs: ['foo'] },
          { tabs: ['bar'] },
        ],
      },
    ],
  },
}

function prune(panes) {
  if (!panes.content) return panes

  const [a, b] = panes.content
  if (a.tabs && a.tabs.length === 0) return prune(b)
  else if (b.tabs && b.tabs.length === 0) return prune(a)
  return panes
}

const remove = (root, path) => {
  const pathParts = toPath(path)
  const idx = pathParts.pop()
  get(root, pathParts).splice(idx, 1)
}

function reducer(state, { type, payload }) {
  switch (type) {
    case 'MOVE_PANE':
      return produce(state, state => {
        const pane = get(state.panes, payload.pathFrom)

        remove(state.panes, payload.pathFrom)
        const destPath = toPath(payload.pathTo)

        const dest = get(state.panes, destPath)

        switch (payload.position) {
          case 'full':
            dest.tabs.push(pane)
            break
          case 'left':
            set(state.panes, destPath, {
              split: 'vertical',
              content: [{ tabs: [pane] }, dest],
            })
            break
          case 'right':
            dest.split = 'vertical'
            dest.tabs.push(pane)
            break
          case 'top':
            dest.split = 'horizontal'
            dest.tabs.unshift(pane)
            break
          case 'bottom':
            dest.split = 'horizontal'
            dest.tabs.push(pane)
            break
        }

        state.panes = prune(state.panes)
      })
  }
}

const EditorPane = styled('div')`
  padding: 1rem;
`

function renderPanes(panes, path = '') {
  if (panes.split)
    return (
      <SplitPane defaultSize="50%" split={panes.split}>
        {renderPanes(panes.content[0], trimStart(`${path}.content[0]`, '.'))}
        {renderPanes(panes.content[1], trimStart(`${path}.content[1]`, '.'))}
      </SplitPane>
    )

  return <Pane tabs={panes.tabs} path={path} />
}

const DispatchContext = React.createContext(null)
function Content(props) {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <DispatchContext.Provider value={dispatch}>
      <TabDnDProvider>{renderPanes(state.panes)}</TabDnDProvider>
    </DispatchContext.Provider>
  )
}

Content.propTypes = propTypes

export const usePaneActions = () => {
  const dispatch = useContext(DispatchContext)

  return {
    move: (pathFrom, pathTo, position) =>
      dispatch({
        type: 'MOVE_PANE',
        payload: { pathFrom, pathTo, position },
      }),
  }
}

export default Content
