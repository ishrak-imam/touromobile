
// import { getMap } from './immutable'
import { LOGIN_INITIAL_STATE } from '../modules/auth/immutable'
import { CONNECTION_INITIAL_STATE } from '../connection/immutable'
import { TRIPS_INITIAL_STATE } from '../modules/trips/immutable'
import { NAV_INITIAL_STATE } from '../navigation/immutable'
import { IMAGE_CACHE_INITIAL_STATE } from '../modules/imageCache/immutable'
import { APP_INITIAL_STATE } from '../modules/app/immutable'

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
    trips: TRIPS_INITIAL_STATE,
    navigation: NAV_INITIAL_STATE,
    imageCache: IMAGE_CACHE_INITIAL_STATE,
    app: APP_INITIAL_STATE
  }
}
