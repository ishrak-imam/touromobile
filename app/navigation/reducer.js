
import { createReducer } from '../utils/reduxHelpers'

import { setIntoMap } from '../utils/immutable'

import { CURRENT_SCREEN } from './action'

import { NAV_INITIAL_STATE } from './immutable'

export const navigation = createReducer(NAV_INITIAL_STATE, {
  [CURRENT_SCREEN]: (state, payload) => setIntoMap(state, 'screen', payload.routeName)
})
