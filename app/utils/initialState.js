
// import { getMap } from './immutable'
import { LOGIN_INITIAL_STATE } from '../modules/auth/immutable'
import { CONNECTION_INITIAL_STATE } from '../connection/immutable'
import { TRIPS_INITIAL_STATE } from '../modules/trips/immutable'
import { NAV_INITIAL_STATE } from '../navigation/immutable'
import { IMAGE_CACHE_INITIAL_STATE } from '../components/imageCache/immutable'
import { APP_INITIAL_STATE } from '../modules/app/immutable'
import { MODAL_INITIAL_STATE } from '../modal/immutable'
import { REPORTS_INITIAL_STATE } from '../modules/reports/immutable'
import { MODIFIED_DATA_INITIAL_STATE } from '../modules/modifiedData/immutable'
import { PROFILE_INITIAL_STATE } from '../modules/profile/immutable'

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
    app: APP_INITIAL_STATE,
    modal: MODAL_INITIAL_STATE,
    reports: REPORTS_INITIAL_STATE,
    modifiedData: MODIFIED_DATA_INITIAL_STATE,
    profile: PROFILE_INITIAL_STATE
  }
}
