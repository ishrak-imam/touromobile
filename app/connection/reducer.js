
import { createReducer } from '../utils/reduxHelpers'
import { setIntoMap } from '../utils/immutable'

import {
  CONNECTION_STATUS,
  CONNECTION_TYPE
} from './action'

import { CONNECTION_INITIAL_STATE } from './immutable'

export const connection = createReducer(CONNECTION_INITIAL_STATE, {
  [CONNECTION_STATUS]: (state, payload) => setIntoMap(state, 'online', payload),
  [CONNECTION_TYPE]: (state, payload) => setIntoMap(state, 'type', payload)

})
