
import { getMap, getSet } from '../../utils/immutable'

export const IMAGE_CACHE_INITIAL_STATE = getMap({
  isLoading: false,
  data: getSet([])
})
