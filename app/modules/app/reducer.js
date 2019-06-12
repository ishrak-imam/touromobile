import { createReducer } from '../../utils/reduxHelpers'
import { updateMap, readValue, setIntoMap } from '../../utils/immutable'

import {
  SET_APP_STATE,

  REFRESH_TRIP_DATA,
  REFRESH_TRIP_DATA_SUCS,
  REFRESH_TRIP_DATA_FAIL
} from './action'

import { APP_INITIAL_STATE } from './immutable'

export const app = createReducer(APP_INITIAL_STATE, {
  [SET_APP_STATE]: (state, payload) => updateMap(state, 'isInBg', value => payload),

  [REFRESH_TRIP_DATA]: state => {
    let refresh = readValue('refresh', state)
    refresh = setIntoMap(refresh, 'loading', true)
    return setIntoMap(state, 'refresh', refresh)
  },

  [REFRESH_TRIP_DATA_SUCS]: (state, payload) => {
    let refresh = readValue('refresh', state)
    refresh = setIntoMap(refresh, 'loading', false)
    refresh = setIntoMap(refresh, 'time', payload.time)
    return setIntoMap(state, 'refresh', refresh)
  },

  [REFRESH_TRIP_DATA_FAIL]: (state, payload) => {
    let refresh = readValue('refresh', state)
    refresh = setIntoMap(refresh, 'loading', false)
    return setIntoMap(state, 'refresh', refresh)
  }
})
