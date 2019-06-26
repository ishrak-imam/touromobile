
import { getMap, getList } from '../../utils/immutable'

export const CONNECTIONLINES_INITIAL_STATE = getMap({
  isLoading: false,
  lines: getList([])
})
