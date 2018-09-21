
import { isWithinRange } from 'date-fns'
import { setIntoMap, getMap, getList } from '../utils/immutable'
import Cache from '../utils/cache'

const resolvers = {

  sortedTrips: trips => trips.sortBy(trip => trip.get('outDate')),

  pax: data => {
    const bookings = data.get('bookings')
    return bookings.map(b => {
      return b.get('pax').map(p => setIntoMap(p, 'booking', b))
    }).flatten(1) // one level deep flatten
  },

  sortedPax: data => {
    const bookings = data.get('bookings')
    return bookings.map(b => {
      return b.get('pax')
        .map(p => setIntoMap(p, 'booking', b))
    }).flatten(1) // one level deep flatten
      .sortBy(p => `${p.get('firstName')} ${p.get('lastName')}`)
  },

  sortedBookings: data => {
    const bookings = data.get('bookings')
    return bookings.sortBy(b => b.get('id'))
  },

  paxData: pax => {
    let initial = null
    return pax.map(p => {
      const paxInitial = p.get('firstName').charAt(0).toLowerCase()
      if (initial !== paxInitial) {
        initial = paxInitial
        return getList([getMap({ first: true, initial: paxInitial.toUpperCase() }), p])
      }
      return getList([p])
    }).flatten(1) // one level flatten
  }

}

export const getTrips = state => state.trips

let sortedTripsCache = null
export const getSortedTrips = trips => {
  if (!sortedTripsCache) {
    sortedTripsCache = new Cache(trips, resolvers.sortedTrips)
  }
  return sortedTripsCache.getData()
}

let paxCache = null
export const getPax = trip => {
  if (!paxCache) {
    paxCache = new Cache(trip, resolvers.pax)
  }
  return paxCache.getData()
}

let sortedPaxCache = null
export const getSortedPax = trip => {
  if (!sortedPaxCache) {
    sortedPaxCache = new Cache(trip, resolvers.sortedPax)
  }
  return sortedPaxCache.getData()
}

let sortedBookingCache = null
export const getSortedBookings = trip => {
  if (!sortedBookingCache) {
    sortedBookingCache = new Cache(trip, resolvers.sortedBookings)
  }
  return sortedBookingCache.getData()
}

let paxDataCache = null
export const preparePaxData = pax => {
  if (!paxDataCache) {
    paxDataCache = new Cache(pax, resolvers.paxData)
  }
  return paxDataCache.getData()
}

/**
 * TODO:
 * Find a way to cache the result
 * note: Not immutable data
 */
export const getCurrentTrip = state => {
  const dateNow = new Date()
  const trips = getSortedTrips(state.trips.get('data'))
  const currentTrip = trips.find(trip => {
    return isWithinRange(dateNow, trip.get('outDate'), trip.get('homeDate'))
  })
  return {
    noMoreTrips: !currentTrip,
    currentTrip: currentTrip || {}
  }
}
