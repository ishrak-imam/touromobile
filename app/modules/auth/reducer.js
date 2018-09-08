
import { createReducer } from '../../utils/reduxHelpers'
import { mergeMapDeep, getMap } from '../../utils/immutable'

import {
  LOGIN_REQ, LOGIN_SUCS, LOGIN_FAIL,
  LOGOUT_SUCS
} from './action'

import { LOGIN_INITIAL_STATE } from './immutable'

export const login = createReducer(LOGIN_INITIAL_STATE, {
  [LOGIN_REQ]: state => mergeMapDeep(state, getMap({ isLoading: true, error: null })),
  [LOGIN_SUCS]: (state, payload) => mergeMapDeep(state, getMap({ isLoading: false, user: getMap(payload) })),
  [LOGIN_FAIL]: (state, payload) => mergeMapDeep(state, getMap({ isLoading: false, error: getMap(payload) })),
  [LOGOUT_SUCS]: state => state // just return the state as no update required
})
