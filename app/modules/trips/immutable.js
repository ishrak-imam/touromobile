
import { getMap, getList } from '../../utils/immutable'

export const TRIPS_INITIAL_STATE = getMap({
  isLoading: false,
  data: [],
  current: getMap({
    trip: getMap({}),
    noMore: false
  }),
  future: getMap({
    trips: getList([]),
    noMore: false
  })
})
