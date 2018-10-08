
import { combineReducers } from 'redux'
import { getInitialState } from '../utils/initialState'
import { LOGOUT_SUCS } from '../modules/auth/action'

import * as navReducers from '../navigation/reducer'
import * as appReducers from '../modules/app/reducer'
import * as cacheImageReducers from '../components/imageCache/reducer'
import * as authReducers from '../modules/auth/reducer'
import * as connectionReducer from '../connection/reducer'
import * as tripsReducer from '../modules/trips/reducer'
import * as modalReducer from '../modal/reducer'
import * as reportsReducer from '../modules/reports/reducer'
import * as modifiedDataReducer from '../modules/modifiedData/reducer'

const allReducers = combineReducers({
  ...navReducers,
  ...appReducers,
  ...cacheImageReducers,
  ...connectionReducer,
  ...authReducers,
  ...tripsReducer,
  ...modalReducer,
  ...reportsReducer,
  ...modifiedDataReducer
})

const rootReduces = (state, action) => {
  // clean-up state on logout
  if (action.type === LOGOUT_SUCS) {
    const connection = state.connection
    state = getInitialState()
    /**
     * keep some data as it is, like
     * connection status, image cache
     */
    state.connection = connection
  }
  return allReducers(state, action)
}

export default rootReduces
