import { createAction } from '../../utils/reduxHelpers'

export const TRIPS_REQ = 'TRIPS_REQ'
export const TRIPS_SUCS = 'TRIPS_SUCS'
export const TRIPS_FAIL = 'TRIPS_FAIL'

export const GET_CURRENT_TRIP = 'GET_CURRENT_TRIP'
export const SET_CURRENT_TRIP = 'SET_CURRENT_TRIP'

export const GET_FUTURE_TRIPS = 'GET_FUTURE_TRIPS'
export const SET_FUTURE_TRIPS = 'SET_FUTURE_TRIPS'

export const GET_PAST_TRIPS = 'GET_PAST_TRIPS'
export const SET_PAST_TRIPS = 'SET_PAST_TRIPS'

export const GET_PENDING_STATS_UPLOAD = 'GET_PENDING_STATS_UPLOAD'
export const SET_PENDING_STATS_UPLOAD = 'SET_PENDING_STATS_UPLOAD'

export const CONNECTIONS_REQ = 'CONNECTIONS_REQ'
export const CONNECTIONS_SUCS = 'CONNECTIONS_SUCS'
export const CONNECTIONS_FAIL = 'CONNECTIONS_FAIL'

export const tripsReq = createAction(TRIPS_REQ)
export const tripsSucs = createAction(TRIPS_SUCS)
export const tripsFail = createAction(TRIPS_FAIL)

export const getCurrentTrip = createAction(GET_CURRENT_TRIP)
export const setCurrentTrip = createAction(SET_CURRENT_TRIP)

export const getFutureTrips = createAction(GET_FUTURE_TRIPS)
export const setFutureTrips = createAction(SET_FUTURE_TRIPS)

export const getPastTrips = createAction(GET_PAST_TRIPS)
export const setPastTrips = createAction(SET_PAST_TRIPS)

export const getPendingStatsUpload = createAction(GET_PENDING_STATS_UPLOAD)
export const setPendingStatsUpload = createAction(SET_PENDING_STATS_UPLOAD)

export const connectionsReq = createAction(CONNECTIONS_REQ)
export const connectionsSucs = createAction(CONNECTIONS_SUCS)
export const connectionsFail = createAction(CONNECTIONS_FAIL)
