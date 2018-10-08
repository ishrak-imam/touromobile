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

export const tripsReq = createAction(TRIPS_REQ)
export const tripsSucs = createAction(TRIPS_SUCS)
export const tripsFail = createAction(TRIPS_FAIL)

export const getCurrentTrip = createAction(GET_CURRENT_TRIP)
export const setCurrentTrip = createAction(SET_CURRENT_TRIP)

export const getFutureTrips = createAction(GET_FUTURE_TRIPS)
export const setFutureTrips = createAction(SET_FUTURE_TRIPS)

export const getPastTrips = createAction(GET_PAST_TRIPS)
export const setPastTrips = createAction(SET_PAST_TRIPS)
