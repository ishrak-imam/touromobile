
import { getMap } from '../../utils/immutable'

export const LOGIN_INITIAL_STATE = getMap({
  isLoading: false,
  user: getMap({
    firstName: '',
    lastName: ''
  }),
  error: null
})
