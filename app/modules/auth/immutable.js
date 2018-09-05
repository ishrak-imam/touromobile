
import { getMap } from '../../utils/immutable'

export const LOGIN_INITIAL_STATE = getMap({
  isLoading: false,
  token: null,
  user: getMap({
    name: '',
    email: ''
  })
})
