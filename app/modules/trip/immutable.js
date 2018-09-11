
import { getImmutableObject } from '../../utils/immutable'

export const CURRENT_TRIP_INITIAL_STATE = getImmutableObject({
  isLoading: false,
  data: {}
})
