import * as React from 'react'
import createResource from '../utils/createResource'
import getParser from '../parser'
import initData from '../data'

import createStore, { Middleware, Dispatch } from './createStore'

import appReducer, { AppAction, AppState } from './appReducer'
import paneReducer, {
  PaneLayoutState,
  PaneLayoutAction,
} from './paneLayoutReducer'
import parsingReducer, { ParsingState, ParsingAction } from './parsingReducer'
import transformingReducer from './transformingReducer'
import { ActionType } from 'typesafe-actions'

export type Thunk<R = void> = (
  dispatch: Dispatch,
  getState: () => RootState
) => R

const middleware: Middleware<RootState>[] = [
  (dispatch, getState) => next => action => {
    if (typeof action === 'function') return action(dispatch, getState)
    return next(action)
  },
  dispatch => next => {
    return action => {
      if (action.then) return action.then(dispatch)
      return next(action)
    }
  },
]

export interface RootState {
  app: AppState
  paneLayout: PaneLayoutState
  parsing: ParsingState
  transforming: any
}

export type RootAction = ActionType<
  ParsingAction | AppAction | PaneLayoutAction
>

const reducers = {
  app: appReducer,
  paneLayout: paneReducer,
  parsing: parsingReducer,
  transforming: transformingReducer,
}

const { Store, useStoreDispatch, useBoundActions, useStoreState } = createStore<
  RootState,
  RootAction
>(reducers, middleware)

const readData = createResource<Partial<RootState>, void>(async () => {
  const { repo } = await initData()
  const parser = await getParser(repo.parserModule)

  return {
    parsing: {
      input: repo.input,
      parserModule: repo.parserModule,
      options: parser.parserOptions,
      ast: await parser.parse(repo.input),
      parser,
    },
  }
})

const Provider = ({ children }: { children: React.ReactNode }) => (
  <React.Suspense fallback="loading">
    <Store initialState={readData}>{children}</Store>
  </React.Suspense>
)

export { Provider, useStoreDispatch, useBoundActions, useStoreState }
