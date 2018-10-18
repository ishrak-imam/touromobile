
import { createAction } from '../../utils/reduxHelpers'

export const TOGGLE_TAB_LABELS = 'TOGGLE_TAB_LABELS'

export const USER_DETAILS_REQ = 'USER_DETAILS_REQ'
export const USER_DETAILS_SUCS = 'USER_DETAILS_SUCS'
export const USER_DETAILS_FAIL = 'USER_DETAILS_FAIL'

export const toggleTabLabels = createAction(TOGGLE_TAB_LABELS)

export const userDetailsReq = createAction(USER_DETAILS_REQ)
export const userDetailsSucs = createAction(USER_DETAILS_SUCS)
export const userDetailsFail = createAction(USER_DETAILS_FAIL)
