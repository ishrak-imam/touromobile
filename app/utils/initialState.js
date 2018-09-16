
// import { getMap } from './immutable'
import { LOGIN_INITIAL_STATE } from '../modules/auth/immutable'
import { CONNECTION_INITIAL_STATE } from '../connection/immutable'
import { CURRENT_TRIP_INITIAL_STATE } from '../modules/trip/immutable'
import { NAV_INITIAL_STATE } from '../navigation/immutable'
import { IMAGE_CACHE_INITIAL_STATE } from '../modules/imageCache'

export const getInitialState = () => {
  // return getMap({
  //   login: LOGIN_INITIAL_STATE,
  //   connection: CONNECTION_INITIAL_STATE,
  //   currentTrip: CURRENT_TRIP_INITIAL_STATE,
  //   navigation: NAV_INITIAL_STATE,
  //   imageCache: CACHED_IMAGES_INITIAL_STATE
  // })
  return {
    login: LOGIN_INITIAL_STATE,
    connection: CONNECTION_INITIAL_STATE,
    currentTrip: CURRENT_TRIP_INITIAL_STATE,
    navigation: NAV_INITIAL_STATE,
    imageCache: IMAGE_CACHE_INITIAL_STATE
  }
}
