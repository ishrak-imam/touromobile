import { createAction } from '../../utils/reduxHelpers'

export const TRIPS_REQ = 'TRIPS_REQ'
export const TRIPS_SUCS = 'TRIPS_SUCS'
export const TRIPS_FAIL = 'TRIPS_FAIL'

export const GET_CURRENT_TRIP = 'GET_CURRENT_TRIP'
export const SET_CURRENT_TRIP = 'SET_CURRENT_TRIP'
export const SET_NO_MORE_TRIPS = 'SET_NO_MORE_TRIPS'

export const tripsReq = createAction(TRIPS_REQ)
export const tripsSucs = createAction(TRIPS_SUCS)
export const tripsFail = createAction(TRIPS_FAIL)

export const getCurrentTrip = createAction(GET_CURRENT_TRIP)
export const setCurrentTrip = createAction(SET_CURRENT_TRIP)
export const setNoMoreTrips = createAction(SET_NO_MORE_TRIPS)
