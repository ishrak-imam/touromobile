
import { getMap, getList } from '../../utils/immutable'

export const CONNECTION_LINES_INITIAL_STATE = getMap({
  isLoading: false,
  lines: getList([]),
  hotels: getList([])
})
