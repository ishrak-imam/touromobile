
import { getImmutableObject } from '../../utils/immutable'

export const TRIPS_INITIAL_STATE = getImmutableObject({
  isLoading: false,
  data: [],
  current: {},
  noMoreTrips: false
})
