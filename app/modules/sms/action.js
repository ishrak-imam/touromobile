
import { createAction } from '../../utils/reduxHelpers'

export const SEND_SMS_REQ = 'SEND_SMS_REQ'
export const SEND_SMS_SUCS = 'SEND_SMS_SUCS'
export const SEND_SMS_FAIL = 'SEND_SMS_FAIL'

export const STORE_PENDING_SMS = 'STORE_PENDING_SMS'

export const sendSmsReq = createAction(SEND_SMS_REQ)
export const sendSmsSucs = createAction(SEND_SMS_SUCS)
export const sendSmsFail = createAction(SEND_SMS_FAIL)

export const storePendingSms = createAction(STORE_PENDING_SMS)
