
import Cache from '../utils/cache'

export const getExcursions = state => state.excursions
export const getParticipants = state => state.excursions.get('participants')

const resolvers = {
  sortedExcursions: trip => {
    const ex = trip.get('excursions')
    return ex.sortBy(e => e.get('start'))
  }
}

let sortedExcursionsCache = null
export const getSortedExcursions = trip => {
  if (!sortedExcursionsCache) {
    sortedExcursionsCache = new Cache(resolvers.sortedExcursions)
  }
  return sortedExcursionsCache.getData(trip)
}
