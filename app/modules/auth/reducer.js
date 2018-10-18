
import { createReducer } from '../../utils/reduxHelpers'
import { getMap, mergeMapShallow } from '../../utils/immutable'

import {
  LOGIN_REQ, LOGIN_SUCS, LOGIN_FAIL,
  LOGOUT_SUCS,
  FORGOT_PASS_REQ, FORGOT_PASS_SUCS, FORGOT_PASS_FAIL
} from './action'

import { LOGIN_INITIAL_STATE } from './immutable'

export const login = createReducer(LOGIN_INITIAL_STATE, {
  [LOGIN_REQ]: state => mergeMapShallow(state, getMap({ isLoading: true, error: null, forgotPass: null })),
  [LOGIN_SUCS]: (state, payload) => mergeMapShallow(state, getMap({ isLoading: false, user: getMap(payload) })),
  [LOGIN_FAIL]: (state, payload) => mergeMapShallow(state, getMap({ isLoading: false, error: getMap(payload) })),

  [LOGOUT_SUCS]: state => state, // just return the state as no update required

  [FORGOT_PASS_REQ]: state => mergeMapShallow(state, getMap({ isLoading: true, error: null, forgotPass: null })),
  [FORGOT_PASS_SUCS]: (state, payload) => mergeMapShallow(state, getMap({ isLoading: false, forgotPass: getMap(payload) })),
  [FORGOT_PASS_FAIL]: (state, payload) => mergeMapShallow(state, getMap({ isLoading: false, error: getMap(payload) }))
})
