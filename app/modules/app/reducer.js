import { createReducer } from '../../utils/reduxHelpers'
import { updateMap } from '../../utils/immutable'

import {
  SET_APP_STATE
} from './action'

import { APP_INITIAL_STATE } from './immutable'

export const app = createReducer(APP_INITIAL_STATE, {
  [SET_APP_STATE]: (state, payload) => updateMap(state, 'isInBg', value => payload)
})
