
import { createAction } from '../../utils/reduxHelpers'

export const CONNECTIONLINES_REQ = 'CONNECTIONLINES_REQ'
export const CONNECTIONLINES_SUCS = 'CONNECTIONLINES_SUCS'
export const CONNECTIONLINES_FAIL = 'CONNECTIONLINES_FAIL'

export const connectionLinesReq = createAction(CONNECTIONLINES_REQ)
export const connectionLinesSucs = createAction(CONNECTIONLINES_SUCS)
export const connectionLinesFail = createAction(CONNECTIONLINES_FAIL)
