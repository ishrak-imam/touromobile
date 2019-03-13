/* eslint-disable */

import { combineReducers } from 'redux'
import { getInitialState } from '../utils/initialState'
import { LOGOUT_SUCS } from '../modules/auth/action'
import { CLEAR_LOCAL_DATA } from '../modules/app/action'

import * as navReducers from '../navigation/reducer'
import * as appReducers from '../modules/app/reducer'
import * as cacheImageReducers from '../components/imageCache/reducer'
import * as authReducers from '../modules/auth/reducer'
import * as connectionReducer from '../connection/reducer'
import * as tripsReducer from '../modules/trips/reducer'
import * as modalReducer from '../modal/reducer'
import * as reportsReducer from '../modules/reports/reducer'
import * as modifiedDataReducer from '../modules/modifiedData/reducer'
import * as profileReducer from '../modules/profile/reducer'
import * as rollCallReducer from '../modules/rollCall/reducer'
import * as smsReducer from '../modules/sms/reducer'

const allReducers = combineReducers({
  ...navReducers,
  ...appReducers,
  ...cacheImageReducers,
  ...connectionReducer,
  ...authReducers,
  ...tripsReducer,
  ...modalReducer,
  ...reportsReducer,
  ...modifiedDataReducer,
  ...profileReducer,
  ...rollCallReducer,
  ...smsReducer
})

const rootReducer = (state, action) => {
  if (action.type === LOGOUT_SUCS || action.type === CLEAR_LOCAL_DATA) {
    const connection = state.connection
    const modifiedData = state.modifiedData
    const imageCache = state.imageCache
    state = getInitialState()
    if (!__DEV__) {
      state.modifiedData = modifiedData
      state.imageCache = imageCache
    }
    state.connection = connection
  }
  return allReducers(state, action)
}

export default rootReducer
