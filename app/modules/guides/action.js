
import { createAction } from '../../utils/reduxHelpers'

export const GUIDES_LIST_REQ = 'GUIDES_LIST_REQ'
export const GUIDES_LIST_SUCS = 'GUIDES_LIST_SUCS'
export const GUIDES_LIST_FAIL = 'GUIDES_LIST_FAIL'

export const SET_GUIDE_ID = 'SET_GUIDE_ID'

export const guidesListReq = createAction(GUIDES_LIST_REQ)
export const guidesListSucs = createAction(GUIDES_LIST_SUCS)
export const guidesListFail = createAction(GUIDES_LIST_FAIL)

export const setGuideId = createAction(SET_GUIDE_ID)
