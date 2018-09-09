
import { combineReducers } from 'redux-immutable'
import { getInitialState } from '../utils/initialState'
import { LOGOUT_SUCS } from '../modules/auth/action'

import * as navReducers from '../navigation/reducer'
import * as authReducers from '../modules/auth/reducer'
import * as connectionReducer from '../connection/reducer'
import * as tripReducer from '../modules/currentTrip/reducer'

const appReducer = combineReducers({
  ...navReducers,
  ...connectionReducer,
  ...authReducers,
  ...tripReducer
})

const rootReduces = (state, action) => {
  // clean-up state on logout
  if (action.type === LOGOUT_SUCS) {
    const connection = state.get('connection')
    state = getInitialState().set('connection', connection) // keep network status data as it is
  }
  return appReducer(state, action)
}

export default rootReduces
