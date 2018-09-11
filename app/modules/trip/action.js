import { createAction } from '../../utils/reduxHelpers'

export const CURRENT_TRIP_REQ = 'CURRENT_TRIP_REQ'
export const CURRENT_TRIP_SUCS = 'CURRENT_TRIP_SUCS'
export const CURRENT_TRIP_FAIL = 'CURRENT_TRIP_FAIL'

export const currentTripReq = createAction(CURRENT_TRIP_REQ)
export const currentTripSucs = createAction(CURRENT_TRIP_SUCS)
export const currentTripFail = createAction(CURRENT_TRIP_FAIL)
