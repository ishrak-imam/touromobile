
import { combineReducers } from 'redux-immutable'
import { getInitialState } from '../utils/initialState'
import { LOGOUT_SUCS } from '../modules/auth/action'

import * as navReducers from '../navigation/reducer'
import * as cacheImageReducers from '../modules/cahedImages/reducer'
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
    const connection = state.get('connection')
    const imageCache = state.get('imageCache')

    /**
     * keep some data as it is, like
     * connection status, image cache
     */
    state = getInitialState()
      .set('connection', connection)
      .set('imageCache', imageCache)
  }
  return appReducer(state, action)
}

export default rootReduces
