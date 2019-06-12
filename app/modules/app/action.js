import { createAction } from '../../utils/reduxHelpers'

export const START_APP_STATE_MONITOR = 'START_APP_STATE_MONITOR'
export const SET_APP_STATE = 'SET_APP_STATE'

export const CLEAR_LOCAL_DATA = 'CLEAR_LOCAL_DATA'

export const REFRESH_TRIP_DATA = 'REFRESH_TRIP_DATA'
export const REFRESH_TRIP_DATA_SUCS = 'REFRESH_TRIP_DATA_SUCS'
export const REFRESH_TRIP_DATA_FAIL = 'REFRESH_TRIP_DATA_FAIL'

export const startAppStateMonitor = createAction(START_APP_STATE_MONITOR)
export const setAppState = createAction(SET_APP_STATE)

export const clearLocalData = createAction(CLEAR_LOCAL_DATA)

export const refreshTripData = createAction(REFRESH_TRIP_DATA)
export const refreshTripDataSucs = createAction(REFRESH_TRIP_DATA_SUCS)
export const refreshTripDataFail = createAction(REFRESH_TRIP_DATA_FAIL)
