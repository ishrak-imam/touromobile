
import { createReducer } from '../../utils/reduxHelpers'
import {
  mergeMapShallow, getMap, getImmutableObject,
  setIntoMap, readValue, getList
} from '../../utils/immutable'

import {
  TRIPS_REQ, TRIPS_SUCS, TRIPS_FAIL,
  SET_CURRENT_TRIP,
  SET_CURRENT_TRIPS, SET_FUTURE_TRIPS, SET_PAST_TRIPS,
  SET_PENDING_STATS_UPLOAD, SET_REMAINING_FUTURE_TRIPS,
  CONNECTIONS_SUCS,
  RESERVATIONS_SUCS,
  ADD_MANUAL_TRIP
} from './action'

import { TRIPS_INITIAL_STATE } from './immutable'

export const trips = createReducer(TRIPS_INITIAL_STATE, {

  [TRIPS_REQ]: (state, payload) => mergeMapShallow(
    state,
    getMap({ isLoading: !payload.isRefreshing, isRefreshing: payload.isRefreshing })
  ),

  [TRIPS_SUCS]: (state, payload) => mergeMapShallow(
    state,
    getMap({ isLoading: false, isRefreshing: false, data: getImmutableObject(payload) })
  ),

  [TRIPS_FAIL]: state => mergeMapShallow(state, getMap({ isLoading: false, isRefreshing: false })),

  [SET_CURRENT_TRIPS]: (state, payload) => setIntoMap(state, 'current', getImmutableObject(payload)),

  [SET_CURRENT_TRIP]: (state, payload) => {
    let currentTrip = readValue('current', state)
    currentTrip = setIntoMap(currentTrip, 'trip', payload)
    return setIntoMap(state, 'current', currentTrip)
  },

  [SET_FUTURE_TRIPS]: (state, payload) => setIntoMap(state, 'future', getImmutableObject(payload)),
  [SET_PAST_TRIPS]: (state, payload) => setIntoMap(state, 'past', getImmutableObject(payload)),

  [SET_PENDING_STATS_UPLOAD]: (state, payload) => setIntoMap(state, 'pendingStatsUpload', payload),
  [SET_REMAINING_FUTURE_TRIPS]: (state, payload) => setIntoMap(state, 'remainingFutureTrips', payload),

  [CONNECTIONS_SUCS]: (state, payload) => {
    let connections = readValue('connections', state) || getMap({})
    connections = setIntoMap(connections, 'direct', getList(payload.direct))
    connections = setIntoMap(connections, 'directWinter', getList(payload.directWinter))
    connections = setIntoMap(connections, 'overnight', getList(payload.overnight))
    return setIntoMap(state, 'connections', connections)
  },

  [RESERVATIONS_SUCS]: (state, payload) => setIntoMap(state, 'reservations', payload),

  [ADD_MANUAL_TRIP]: (state, payload) => {
    let manualTrips = readValue('manualTrips', state)
    manualTrips = setIntoMap(manualTrips, payload.departureId, getImmutableObject(payload.trip))
    return setIntoMap(state, 'manualTrips', manualTrips)
  }
})
