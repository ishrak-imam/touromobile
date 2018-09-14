
import { getMap } from '../../utils/immutable'

export const CACHED_IMAGES_INITIAL_STATE = getMap({
  isLoading: false,
  data: getMap({})
})
