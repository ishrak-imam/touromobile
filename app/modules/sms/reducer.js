
import { createReducer } from '../../utils/reduxHelpers'
import { setIntoMap } from '../../utils/immutable'

import {
  SEND_SMS_REQ,
  SEND_SMS_SUCS,
  SEND_SMS_FAIL
} from './action'

import { SMS_INITIAL_STATE } from './immutable'

export const sms = createReducer(SMS_INITIAL_STATE, {
  [SEND_SMS_REQ]: state => setIntoMap(state, 'isLoading', true),
  [SEND_SMS_SUCS]: state => setIntoMap(state, 'isLoading', false),
  [SEND_SMS_FAIL]: state => setIntoMap(state, 'isLoading', false)
})
