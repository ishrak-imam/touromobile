
import { createReducer } from '../../utils/reduxHelpers'
import { mergeMapShallow, getMap, getImmutableObject, setIntoMap } from '../../utils/immutable'

import {
  TRIPS_REQ, TRIPS_SUCS, TRIPS_FAIL,
  SET_CURRENT_TRIP, SET_FUTURE_TRIPS, SET_PAST_TRIPS
} from './action'

import { TRIPS_INITIAL_STATE } from './immutable'

export const trips = createReducer(TRIPS_INITIAL_STATE, {
  [TRIPS_REQ]: state => mergeMapShallow(state, getMap({ isLoading: true })),
  [TRIPS_SUCS]: (state, payload) => mergeMapShallow(state, getMap({ isLoading: false, data: getImmutableObject(payload) })),
  [TRIPS_FAIL]: state => mergeMapShallow(state, getMap({ isLoading: false })),

  [SET_CURRENT_TRIP]: (state, payload) => setIntoMap(state, 'current', getImmutableObject(payload)),
  [SET_FUTURE_TRIPS]: (state, payload) => setIntoMap(state, 'future', getImmutableObject(payload)),
  [SET_PAST_TRIPS]: (state, payload) => setIntoMap(state, 'past', getImmutableObject(payload))
})
