
import { getMap } from '../../utils/immutable'

export const APP_INITIAL_STATE = getMap({
  isInBg: false,
  refresh: getMap({
    time: '',
    loading: false,
    config: getMap({})
  })
})
