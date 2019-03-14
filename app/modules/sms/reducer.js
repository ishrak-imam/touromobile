
import { createReducer } from '../../utils/reduxHelpers'
import { setIntoMap, readValue, getMap, deleteFromMap } from '../../utils/immutable'

import {
  SEND_SMS_REQ,
  SEND_SMS_SUCS,
  SEND_SMS_FAIL,

  SEND_PENDING_SMS_REQ,
  SEND_PENDING_SMS_SUCS,
  SEND_PENDING_SMS_FAIL,

  STORE_PENDING_SMS,
  DELETE_PENDING_SMS
} from './action'

import { SMS_INITIAL_STATE } from './immutable'

export const sms = createReducer(SMS_INITIAL_STATE, {
  [SEND_SMS_REQ]: state => setIntoMap(state, 'isLoading', true),
  [SEND_SMS_SUCS]: state => setIntoMap(state, 'isLoading', false),
  [SEND_SMS_FAIL]: state => setIntoMap(state, 'isLoading', false),

  [STORE_PENDING_SMS]: (state, payload) => {
    let pendings = readValue('pendings', state) || getMap({})
    pendings = setIntoMap(pendings, payload.key, payload.smsPayload)
    return setIntoMap(state, 'pendings', pendings)
  },

  [DELETE_PENDING_SMS]: (state, payload) => {
    let pendings = readValue('pendings', state) || getMap({})
    pendings = deleteFromMap(pendings, payload.smsId)
    return setIntoMap(state, 'pendings', pendings)
  },

  [SEND_PENDING_SMS_REQ]: (state, payload) => {
    let pendings = readValue('pendings', state)
    let sms = readValue(payload.smsId, pendings)
    sms = setIntoMap(sms, 'isLoading', true)
    pendings = setIntoMap(pendings, payload.smsId, sms)
    return setIntoMap(state, 'pendings', pendings)
  },

  [SEND_PENDING_SMS_SUCS]: (state, payload) => {
    let pendings = readValue('pendings', state)
    let sms = readValue(payload.smsId, pendings)
    sms = setIntoMap(sms, 'isLoading', false)
    pendings = setIntoMap(pendings, payload.smsId, sms)
    return setIntoMap(state, 'pendings', pendings)
  },

  [SEND_PENDING_SMS_FAIL]: (state, payload) => {
    let pendings = readValue('pendings', state)
    let sms = readValue(payload.smsId, pendings)
    sms = setIntoMap(sms, 'isLoading', false)
    pendings = setIntoMap(pendings, payload.smsId, sms)
    return setIntoMap(state, 'pendings', pendings)
  }
})
