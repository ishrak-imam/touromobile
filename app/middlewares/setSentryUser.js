
import { setSentryUser as setUser } from '../utils/sentry'
import { LOGIN_SUCS } from '../modules/auth/action'

const setSentryUser = store => next => action => {
  if (action.type === LOGIN_SUCS) {
    const { fullName, id } = action.payload
    setUser({ fullName, id })
  }
  next(action)
}

export default setSentryUser
