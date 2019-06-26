
import { createReducer } from '../../utils/reduxHelpers'
import { setIntoMap, getImmutableObject } from '../../utils/immutable'

import {
  CONNECTIONLINES_REQ,
  CONNECTIONLINES_SUCS,
  CONNECTIONLINES_FAIL
} from './action'

import { CONNECTIONLINES_INITIAL_STATE } from './immutable'

export const connectionLine = createReducer(CONNECTIONLINES_INITIAL_STATE, {
  [CONNECTIONLINES_REQ]: state => setIntoMap(state, 'loading', true),
  [CONNECTIONLINES_SUCS]: (state, payload) => {
    const newState = setIntoMap(state, 'loading', true)
    return setIntoMap(newState, 'lines', getImmutableObject(payload))
  },
  [CONNECTIONLINES_FAIL]: state => setIntoMap(state, 'loading', false)
})
