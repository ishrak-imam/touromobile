
import { getJwt } from '../selectors'

const attachJwt = store => next => action => {
  if (action.payload && action.payload.isNeedJwt) {
    action.payload.jwt = getJwt(store.getState())
  }
  return next(action)
}

export default attachJwt
