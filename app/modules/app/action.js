import { createAction } from '../../utils/reduxHelpers'

export const START_APP_STATE_MONITOR = 'START_APP_STATE_MONITOR'
export const SET_APP_STATE = 'SET_APP_STATE'

export const startAppStateMonitor = createAction(START_APP_STATE_MONITOR)
export const setAppState = createAction(SET_APP_STATE)
