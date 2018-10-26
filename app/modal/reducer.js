
import { createReducer } from '../utils/reduxHelpers'
import { setIntoMap, getImmutableObject, getMap } from '../utils/immutable'

import {
  SHOW_MODAL,
  CLOSE_MODAL
} from './action'

import { MODAL_INITIAL_STATE } from './immutable'

export const modal = createReducer(MODAL_INITIAL_STATE, {
  [SHOW_MODAL]: (state, payload) => {
    return setIntoMap(state, payload.type, getImmutableObject(payload))
  },
  [CLOSE_MODAL]: (state, payload) => {
    const { type } = payload
    return setIntoMap(state, type, getMap({}))
  }
})
