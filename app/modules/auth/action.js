
import { createAction } from '../../utils/reduxHelpers'

export const INIT = 'INIT'

export const LOGIN_REQ = 'LOGIN_REQ'
export const LOGIN_SUCS = 'LOGIN_SUCS'
export const LOGIN_FAIL = 'LOGIN_FAIL'

export const FORGOT_PASS_REQ = 'FORGOT_PASS_REQ'
export const FORGOT_PASS_SUCS = 'FORGOT_PASS_SUCS'
export const FORGOT_PASS_FAIL = 'FORGOT_PASS_FAIL'

export const LOGOUT_REQ = 'LOGOUT_REQ'
export const LOGOUT_SUCS = 'LOGOUT_SUCS'

export const SEND_APP_STATUS_REQ = 'SEND_APP_STATUS_REQ'
export const SEND_APP_STATUS_SUCS = 'SEND_APP_STATUS_SUCS'
export const SEND_APP_STATUS_FAIL = 'SEND_APP_STATUS_FAIL'

export const init = createAction(INIT)

export const loginReq = createAction(LOGIN_REQ)
export const loginSucs = createAction(LOGIN_SUCS)
export const loginFail = createAction(LOGIN_FAIL)

export const forgotPassReq = createAction(FORGOT_PASS_REQ)
export const forgotPassSucs = createAction(FORGOT_PASS_SUCS)
export const forgotPassFail = createAction(FORGOT_PASS_FAIL)

export const logoutReq = createAction(LOGOUT_REQ)
export const logoutSucs = createAction(LOGOUT_SUCS)

export const sendAppStatusReq = createAction(SEND_APP_STATUS_REQ)
export const sendAppStatusSucs = createAction(SEND_APP_STATUS_SUCS)
export const sendAppStatusFail = createAction(SEND_APP_STATUS_FAIL)
