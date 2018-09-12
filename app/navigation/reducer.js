
import { createReducer } from '../utils/reduxHelpers'

import { CURRENT_SCREEN } from './action'

import { NAV_INITIAL_STATE } from './immutable'

export const navigation = createReducer(NAV_INITIAL_STATE, {
  [CURRENT_SCREEN]: (state, payload) => state.set('screen', payload.routeName)
})
