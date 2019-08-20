
import { getMap, getList } from '../../utils/immutable'

export const GUIDES_LIST_INITIAL_STATE = getMap({
  isLoading: false,
  isRefreshing: false,
  data: getList([])
})
