
import { createReducer } from '../../utils/reduxHelpers'
import { setIntoMap, readValue, getMap, mergeMapShallow } from '../../utils/immutable'

import {
  MODIFY_PAX_DATA,
  SET_PARTICIPANTS
} from './action'

import {
  UPLOAD_STATS_REQ,
  UPLOAD_STATS_SUCS
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
  }

})
