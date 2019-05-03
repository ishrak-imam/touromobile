
import { createAction } from '../../utils/reduxHelpers'

export const TOGGLE_TAB_LABELS = 'TOGGLE_TAB_LABELS'
export const TOGGLE_ORDER_MODE = 'TOGGLE_ORDER_MODE'

export const USER_DETAILS_REQ = 'USER_DETAILS_REQ'
export const USER_DETAILS_SUCS = 'USER_DETAILS_SUCS'
export const USER_DETAILS_FAIL = 'USER_DETAILS_FAIL'

export const EDIT_PROFILE = 'EDIT_PROFILE'
export const EDIT_PROFILE_CANCEL = 'EDIT_PROFILE_CANCEL'

export const UPDATE_PROFILE_REQ = 'UPDATE_PROFILE_REQ'
export const UPDATE_PROFILE_SUCS = 'UPDATE_PROFILE_SUCS'
export const UPDATE_PROFILE_FAIL = 'UPDATE_PROFILE_FAIL'

export const SYNC_PENDING_PROFILE_UPDATE = 'SYNC_PENDING_PROFILE_UPDATE'

export const DOWNLOAD_APP_DATA_REQ = 'DOWNLOAD_APP_DATA_REQ'
export const DOWNLOAD_APP_DATA_SUCS = 'DOWNLOAD_APP_DATA_SUCS'
export const DOWNLOAD_APP_DATA_FAIL = 'DOWNLOAD_APP_DATA_FAIL'

export const toggleTabLabels = createAction(TOGGLE_TAB_LABELS)

export const userDetailsReq = createAction(USER_DETAILS_REQ)
export const userDetailsSucs = createAction(USER_DETAILS_SUCS)
export const userDetailsFail = createAction(USER_DETAILS_FAIL)

export const editProfile = createAction(EDIT_PROFILE)
export const editProfileCancel = createAction(EDIT_PROFILE_CANCEL)

export const updateProfileReq = createAction(UPDATE_PROFILE_REQ)
export const updateProfileSucs = createAction(UPDATE_PROFILE_SUCS)
export const updateProfileFail = createAction(UPDATE_PROFILE_FAIL)

export const syncPendingProfileUpdate = createAction(SYNC_PENDING_PROFILE_UPDATE)

export const downloadAppDataReq = createAction(DOWNLOAD_APP_DATA_REQ)
export const downloadAppDataSucs = createAction(DOWNLOAD_APP_DATA_SUCS)
export const downloadAppDataFail = createAction(DOWNLOAD_APP_DATA_FAIL)
