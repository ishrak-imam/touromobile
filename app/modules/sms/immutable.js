
import { getMap } from '../../utils/immutable'

export const SMS_INITIAL_STATE = getMap({
  isLoading: false,
  pendings: getMap({}),
  hideMyPhone: true
})
