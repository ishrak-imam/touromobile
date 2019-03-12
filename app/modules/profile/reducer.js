
import { createReducer } from '../../utils/reduxHelpers'
import {
  readValue, setIntoMap,
  mergeMapShallow, getMap, getList
} from '../../utils/immutable'

import {
  TOGGLE_TAB_LABELS, TOGGLE_ORDER_MODE,
  // USER_DETAILS_REQ,
  USER_DETAILS_SUCS, USER_DETAILS_FAIL,
  EDIT_PROFILE_CANCEL, EDIT_PROFILE,
  UPDATE_PROFILE_REQ, UPDATE_PROFILE_SUCS, UPDATE_PROFILE_FAIL,
  DOWNLOAD_APP_DATA_REQ, DOWNLOAD_APP_DATA_SUCS, DOWNLOAD_APP_DATA_FAIL
} from './action'

import { PROFILE_INITIAL_STATE } from './immutable'

export const profile = createReducer(PROFILE_INITIAL_STATE, {
  [TOGGLE_TAB_LABELS]: (state) => {
    const toggle = readValue('showLabel', state)
    return setIntoMap(state, 'showLabel', !toggle)
  },
  [TOGGLE_ORDER_MODE]: (state, payload) => {
    return setIntoMap(state, 'orderMode', payload.mode)
  },
  // [USER_DETAILS_REQ]: state => {
  //   return mergeMapShallow(state, getMap({ isLoading: true }))
  // },
  [USER_DETAILS_SUCS]: (state, payload) => {
    return mergeMapShallow(state, getMap({ isLoading: false, user: getMap(payload) }))
  },
  [USER_DETAILS_FAIL]: (state, payload) => {
    return mergeMapShallow(state, getMap({ isLoading: false, user: getMap(payload) }))
  },

  [UPDATE_PROFILE_REQ]: state => {
    return mergeMapShallow(state, getMap({ isLoading: true }))
  },
  [UPDATE_PROFILE_SUCS]: (state, payload) => {
    return mergeMapShallow(
      state,
      getMap({
        isLoading: false,
        // user: payload,
        updates: null
      }))
  },
  [UPDATE_PROFILE_FAIL]: (state, payload) => {
    return mergeMapShallow(
      state,
      getMap({
        isLoading: false,
        // user: payload.profile,
        updates: getList(payload.changes)
      })
    )
  },

  [EDIT_PROFILE]: (state, payload) => {
    return setIntoMap(
      state,
      'user',
      mergeMapShallow(
        readValue('user', state),
        getMap(payload)
      )
    )
  },

  [EDIT_PROFILE_CANCEL]: (state, payload) => setIntoMap(state, 'user', getMap(payload)),

  [DOWNLOAD_APP_DATA_REQ]: state => setIntoMap(state, 'isLoading', true),
  [DOWNLOAD_APP_DATA_SUCS]: state => setIntoMap(state, 'isLoading', false),
  [DOWNLOAD_APP_DATA_FAIL]: state => setIntoMap(state, 'isLoading', false)

})
