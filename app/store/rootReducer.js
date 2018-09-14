
import { combineReducers } from 'redux'
import { getInitialState } from '../utils/initialState'
import { LOGOUT_SUCS } from '../modules/auth/action'

import * as navReducers from '../navigation/reducer'
import * as cacheImageReducers from '../modules/cachedImages/reducer'
import * as authReducers from '../modules/auth/reducer'
import * as connectionReducer from '../connection/reducer'
import * as tripReducer from '../modules/trip/reducer'

const appReducer = combineReducers({
  ...navReducers,
  ...cacheImageReducers,
  ...connectionReducer,
  ...authReducers,
  ...tripReducer
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
  return appReducer(state, action)
}

export default rootReduces
