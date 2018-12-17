import produce from 'immer'
import { get, set, toPath } from 'lodash'
import { movePane, useTransformer } from '../actions'
import { getType, ActionType } from 'typesafe-actions'

export type Tabs = 'preview' | 'tranformer' | 'ast' | 'input'

export interface PaneSpec {
  tabs: Tabs[]
}
export interface SplitPaneSpec {
  split: 'horizontal' | 'vertical'
  content: Array<PaneSpec | SplitPaneSpec>
}

export interface PaneLayoutState {
  panes: SplitPaneSpec
}

export type PaneLayoutAction = ActionType<
  typeof movePane | typeof useTransformer
>

const transformerPanes = {
  split: 'horizontal',
  content: [
    // -
    { tabs: ['transformer'] },
    { tabs: ['preview'] },
  ],
}

let initialState: PaneLayoutState = {
  panes: {
    split: 'vertical',
    content: [
      // -
      { tabs: ['input'] },
      { tabs: ['ast'] },
    ],
  },
}

function pruneTransformed(state) {
  const nextState = produce(state, draft => {
    const filterTransformed = panes => {
      if (panes.tabs)
        return {
          tabs: panes.tabs.filter(t => t !== 'transformer' && t !== 'preview'),
        }
      return {
        ...panes,
        content: panes.content.map(filterTransformed),
      }
    }
    draft.panes = prune(filterTransformed(draft.panes))
  })

  // nextState.masked = prune(nextState.masked)
  return nextState
}

function prune(panes) {
  if (!panes.content) return panes

  let [a, b] = panes.content
  a = prune(a) // t [bar] t.[]
  b = prune(b)

  const noA = a.tabs && a.tabs.length === 0
  const noB = b.tabs && b.tabs.length === 0

  if (noA && noB) return { tabs: [] }
  if (noA && !noB) return b
  if (noB && !noA) return a

  panes.content = [a, b]
  return { ...panes, content: [a, b] }
}

const remove = (root, path) => {
  const pathParts = toPath(path)
  const idx = pathParts.pop()
  get(root, pathParts).splice(idx, 1)
}

export default function reducer(
  state: PaneLayoutState = initialState,
  action: PaneLayoutAction
) {
  switch (action.type) {
    case getType(useTransformer):
      return action.payload === true
        ? {
            ...state,
            panes: {
              split: 'vertical',
              content: [state.panes, transformerPanes],
            },
          }
        : pruneTransformed(state)

    case getType(movePane):
      return produce(state, state => {
        const { payload } = action
        const pane = get(state, payload.pathFrom) as PaneSpec

        remove(state, payload.pathFrom)

        const dest = payload.pathTo ? get(state, payload.pathTo) : state
        switch (payload.position) {
          case 'full':
            dest.tabs.push(pane)
            break
          case 'left':
            set(state, payload.pathTo, {
              split: 'vertical',
              content: [{ tabs: [pane] }, dest],
            })
            break
          case 'right':
            set(state, payload.pathTo, {
              split: 'vertical',
              content: [dest, { tabs: [pane] }],
            })
            break
          case 'top':
            set(state, payload.pathTo, {
              split: 'horizontal',
              content: [{ tabs: [pane] }, dest],
            })
            break
          case 'bottom':
            set(state, payload.pathTo, {
              split: 'horizontal',
              content: [dest, { tabs: [pane] }],
            })
            break
        }

        state.panes = prune(state.panes)
      })
    default:
      return state
  }
}
