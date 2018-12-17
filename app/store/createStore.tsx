import * as React from 'react'
import { useReducer, useContext, useMemo, createContext } from 'react'
import * as invariant from 'invariant'

export interface Action<T = any> {
  type: T
}

export interface AnyAction extends Action {
  [extraProps: string]: any
}

export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A,
  debugPath?: string
) => S

export type ReducersMapObject<S = any, A extends Action = Action> = {
  [K in keyof S]: Reducer<S[K], A>
}

export type Dispatch<TAction extends Action = AnyAction> = React.Dispatch<
  TAction
>

export interface Middleware<TState> {
  (api: Dispatch, getState: () => TState): (
    next: Dispatch
  ) => (action: any) => any
}

const INIT: Action<string> = {
  type: `INIT${Math.random()
    .toString(36)
    .substring(7)
    .split('')
    .join('.')}`,
}

function compose(funcs) {
  if (funcs.length === 0) return arg => arg
  if (funcs.length === 1) return funcs[0]
  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

function bindActionCreators(actionCreators, dispatch) {
  if (typeof actionCreators === 'function')
    return (...args) => dispatch(actionCreators(...args))

  const boundActionCreators = {}
  for (const [key, actionCreator] of Object.entries(actionCreators)) {
    if (typeof actionCreator === 'function')
      boundActionCreators[key] = (...args) => dispatch(actionCreator(...args))
  }

  return boundActionCreators
}

export function combineReducers<TState, TAction extends Action = AnyAction>(
  reducers: ReducersMapObject<TState>
): Reducer<TState, TAction> {
  const entries = Object.entries<Reducer>(reducers)

  return (
    state: Partial<TState> = {},
    action: TAction,
    parentPath = 'root'
  ) => {
    let hasChanged = false

    const nextState: any = {}
    for (let [key, reducer] of entries) {
      const path = `${parentPath}.${key}`
      const prevStateKey = state[key]
      const nextStateKey = reducer(
        prevStateKey,
        action,
        __DEV__ ? path : undefined
      )
      invariant(
        nextStateKey !== undefined,
        action.type === INIT.type
          ? `Could not initialize state for reducer key: '${path}', return an initial state value or null for an empty state`
          : `Reducer at '${path}' did not return a state value, use null for an empty state`
      )
      nextState[key] = nextStateKey
      hasChanged = hasChanged || nextStateKey !== prevStateKey
    }

    return hasChanged ? nextState : state
  }
}

function applyMiddleware<TState>(
  middlewares: Middleware<TState>[],
  dispatch: Dispatch,
  getState: () => TState
) {
  return compose(middlewares.map(m => m(dispatch, getState)))(dispatch)
}

export default function createStore<TState, TAction extends AnyAction>(
  reducers: ReducersMapObject<TState, TAction>,
  middleware: Middleware<TState>[]
) {
  const StateContext = createContext<TState>(null)
  const DispatchContext = createContext<Dispatch<TAction>>(() => {})

  function useStoreDispatch() {
    return useContext(DispatchContext)
  }

  function useBoundActions(actionsToBind) {
    const dispatch = useStoreDispatch()
    return useMemo(() => bindActionCreators(actionsToBind, dispatch), [
      actionsToBind,
    ])
  }

  function useStoreState(): TState
  function useStoreState<K>(selector: (state: TState) => K): K
  function useStoreState<K>(selector?: (state: TState) => K) {
    const state = useContext<TState>(StateContext)
    return selector ? selector(state) : state
  }

  const reducer = combineReducers(reducers)

  function Store({
    children,
    initialState,
  }: {
    children: React.ReactNode
    initialState: Partial<TState> | (() => Partial<TState>)
  }) {
    if (typeof initialState === 'function') initialState = initialState()

    const [state, baseDispatch] = useReducer<TState, TAction | typeof INIT>(
      reducer,
      initialState as TState,
      INIT
    )
    const stateRef = React.useRef(state)
    const getState = React.useCallback(() => stateRef.current, [])

    React.useLayoutEffect(() => {
      stateRef.current = state
    })

    const dispatch = useMemo(
      () => applyMiddleware(middleware, baseDispatch, getState),
      [baseDispatch]
    )

    return (
      <DispatchContext.Provider value={dispatch}>
        <StateContext.Provider value={state}>{children}</StateContext.Provider>
      </DispatchContext.Provider>
    )
  }

  return { Store, useStoreState, useBoundActions, useStoreDispatch }
}
