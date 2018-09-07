
import { Map } from 'immutable'
import { LOGIN_INITIAL_STATE } from '../modules/auth/immutable'
import { CONNECTION_INITIAL_STATE } from '../connection/immutable'
import { CURRENT_TRIP_INITIAL_STATE } from '../modules/currentTrip/immutable'

export const getInitialState = () => {
  return new Map({
    login: LOGIN_INITIAL_STATE,
    connection: CONNECTION_INITIAL_STATE,
    currentTrip: CURRENT_TRIP_INITIAL_STATE
  })
}
