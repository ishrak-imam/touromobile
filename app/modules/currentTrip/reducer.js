
import { createReducer } from '../../utils/reduxHelpers'
import { mergeMapDeep, getMap, getImmutableObject } from '../../utils/immutable'

import {
  CURRENT_TRIP_REQ, CURRENT_TRIP_SUCS, CURRENT_TRIP_FAIL
} from './action'

import { CURRENT_TRIP_INITIAL_STATE } from './immutable'

export const currentTrip = createReducer(CURRENT_TRIP_INITIAL_STATE, {
  [CURRENT_TRIP_REQ]: state => mergeMapDeep(state, getMap({ isLoading: true })),
  [CURRENT_TRIP_SUCS]: (state, payload) => mergeMapDeep(state, getMap({ isLoading: false, data: getImmutableObject(payload) })),
  [CURRENT_TRIP_FAIL]: state => mergeMapDeep(state, getMap({ isLoading: false }))
})
