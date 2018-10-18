
import { createReducer } from '../../utils/reduxHelpers'
import { readValue, setIntoMap, mergeMapShallow, getMap } from '../../utils/immutable'

import {
  TOGGLE_TAB_LABELS,
  USER_DETAILS_REQ, USER_DETAILS_SUCS, USER_DETAILS_FAIL
} from './action'

import { PROFILE_INITIAL_STATE } from './immutable'

export const profile = createReducer(PROFILE_INITIAL_STATE, {
  [TOGGLE_TAB_LABELS]: (state) => {
    const toggle = readValue('showLabel', state)
    return setIntoMap(state, 'showLabel', !toggle)
  },
  [USER_DETAILS_REQ]: state => {
    return mergeMapShallow(state, getMap({ isLoading: true }))
  },
  [USER_DETAILS_SUCS]: (state, payload) => {
    return mergeMapShallow(state, getMap({ isLoading: false, user: getMap(payload) }))
  },
  [USER_DETAILS_FAIL]: state => {
    return mergeMapShallow(state, getMap({ isLoading: false }))
  }
})
