
import { createReducer } from '../../utils/reduxHelpers'
import {
  setIntoMap, readValue, getMap,
  mergeMapShallow
} from '../../utils/immutable'

import {
  MODIFY_PAX_DATA,
  SET_PARTICIPANTS,

  SET_ACCEPT_TRIP,
  SET_ACCEPT_TRIP_COMBOS
} from './action'

import {
  UPLOAD_STATS_REQ,
  UPLOAD_STATS_SUCS,
  UPLOAD_STATS_FAIL
} from '../reports/action'

import { MODIFIED_DATA_INITIAL_STATE } from './immutable'

export const modifiedData = createReducer(MODIFIED_DATA_INITIAL_STATE, {

  [SET_PARTICIPANTS]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let participants = readValue('participants', modifiedData) || getMap({})
    participants = setIntoMap(participants, payload.excursionId, payload.participants)
    modifiedData = setIntoMap(modifiedData, 'participants', participants)
    modifiedData = setIntoMap(modifiedData, 'statsUploadedAt', null)
    modifiedData = setIntoMap(modifiedData, 'isLoading', false)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [MODIFY_PAX_DATA]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let modifiedPax = readValue('modifiedPax', modifiedData) || getMap({})
    let pax = readValue(payload.paxId, modifiedPax) || getMap({})
    modifiedPax = setIntoMap(modifiedPax, payload.paxId, mergeMapShallow(pax, getMap(payload.pax)))
    modifiedData = setIntoMap(modifiedData, 'modifiedPax', modifiedPax)
    modifiedData = setIntoMap(modifiedData, 'isLoading', false)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [UPLOAD_STATS_REQ]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    modifiedData = setIntoMap(modifiedData, 'isLoading', true)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [UPLOAD_STATS_SUCS]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    modifiedData = setIntoMap(modifiedData, 'statsUploadedAt', payload.time)
    modifiedData = setIntoMap(modifiedData, 'isLoading', false)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [UPLOAD_STATS_FAIL]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    modifiedData = setIntoMap(modifiedData, 'statsUploadedAt', null)
    modifiedData = setIntoMap(modifiedData, 'isLoading', false)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SET_ACCEPT_TRIP]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let accept = readValue('accept', modifiedData) || getMap({})
    accept = setIntoMap(accept, 'isAccepted', payload.isAccepted)
    accept = setIntoMap(accept, 'dirty', true)
    accept = setIntoMap(accept, 'acceptedAt', null)
    modifiedData = setIntoMap(modifiedData, 'accept', accept)
    return setIntoMap(state, payload.departureId, modifiedData)
  },

  [SET_ACCEPT_TRIP_COMBOS]: (state, payload) => {
    let modifiedData = readValue(payload.departureId, state) || getMap({})
    let accept = readValue('accept', modifiedData) || getMap({})
    accept = setIntoMap(accept, 'dirty', true)
    accept = setIntoMap(accept, 'acceptedAt', null)
    let direction = readValue(payload.direction, accept) || getMap({})
    direction = setIntoMap(direction, payload.key, getMap(payload.value))
    accept = setIntoMap(accept, payload.direction, direction)
    modifiedData = setIntoMap(modifiedData, 'accept', accept)
    return setIntoMap(state, payload.departureId, modifiedData)
  }

})
