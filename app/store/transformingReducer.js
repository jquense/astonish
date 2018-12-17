import * as Types from '../ActionTypes'

const initial = {
  useTransformer: false,
}

export default (state = initial, { type, payload }) => {
  switch (type) {
    case Types.USE_TRANSFORMER:
      return { ...state, useTransformer: payload }

    case Types.UPDATE_INPUT:
      return { ...state, useTransformer: payload }
  }
  return state
}
