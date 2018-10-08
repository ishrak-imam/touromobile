
import { createAction } from '../../utils/reduxHelpers'

export const UPLOAD_STATS_REQ = 'UPLOAD_STATS_REQ'
export const UPLOAD_STATS_SUCS = 'UPLOAD_STATS_SUCS'
export const UPLOAD_STATS_FAIL = 'UPLOAD_STATS_FAIL'

export const uploadStatsReq = createAction(UPLOAD_STATS_REQ)
export const uploadStatsSucs = createAction(UPLOAD_STATS_SUCS)
export const uploadStatsFail = createAction(UPLOAD_STATS_FAIL)
