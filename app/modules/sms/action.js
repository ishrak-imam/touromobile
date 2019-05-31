
import { createAction } from '../../utils/reduxHelpers'

export const SEND_SMS_REQ = 'SEND_SMS_REQ'
export const SEND_SMS_SUCS = 'SEND_SMS_SUCS'
export const SEND_SMS_FAIL = 'SEND_SMS_FAIL'

export const SEND_PENDING_SMS_REQ = 'SEND_PENDING_SMS_REQ'
export const SEND_PENDING_SMS_SUCS = 'SEND_PENDING_SMS_SUCS'
export const SEND_PENDING_SMS_FAIL = 'SEND_PENDING_SMS_FAIL'

export const STORE_PENDING_SMS = 'STORE_PENDING_SMS'

export const DELETE_PENDING_SMS = 'DELETE_PENDING_SMS'

export const HIDE_MY_NUMBER_TOGGLE = 'HIDE_MY_NUMBER_TOGGLE'

export const sendSmsReq = createAction(SEND_SMS_REQ)
export const sendSmsSucs = createAction(SEND_SMS_SUCS)
export const sendSmsFail = createAction(SEND_SMS_FAIL)

export const sendPendingSmsReq = createAction(SEND_PENDING_SMS_REQ)
export const sendPendingSmsSucs = createAction(SEND_PENDING_SMS_SUCS)
export const sendPendingSmsFail = createAction(SEND_PENDING_SMS_FAIL)

export const storePendingSms = createAction(STORE_PENDING_SMS)

export const deletePendingSms = createAction(DELETE_PENDING_SMS)

export const hideMyNumberToggle = createAction(HIDE_MY_NUMBER_TOGGLE)
