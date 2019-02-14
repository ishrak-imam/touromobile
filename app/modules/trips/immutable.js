
import { getMap, getList } from '../../utils/immutable'

export const TRIPS_INITIAL_STATE = getMap({
  isLoading: false,
  isRefreshing: false,
  data: [],
  current: getMap({
    trip: getMap({}),
    has: false
  }),
  future: getMap({
    trips: getList([]),
    has: false
  }),
  past: getMap({
    trips: getList([]),
    has: false
  }),
  pendingStatsUpload: 0,
  remainingFutureTrips: 0,
  connections: getMap({
    direct: getList([]),
    directWinter: getList([]),
    overnight: getList([])
  })
})
