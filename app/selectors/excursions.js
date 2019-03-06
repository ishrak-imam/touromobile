
import Cache from '../utils/cache'
import { getList } from '../utils/immutable'

export const getTripExcursions = state => state.trips.getIn(['current', 'trip', 'excursions'])

const resolvers = {
  sortedExcursions: trip => {
    const ex = trip.get('excursions')
    return ex ? ex.sortBy(e => e.get('start')) : getList([])
  }
}

let sortedExcursionsCache = null
export const getSortedExcursions = trip => {
  if (!sortedExcursionsCache) {
    sortedExcursionsCache = Cache(resolvers.sortedExcursions)
  }
  return sortedExcursionsCache(trip)
}
