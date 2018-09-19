
import { setIntoMap, getMap, getList } from '../utils/immutable'
import Cache from '../utils/cache'

export const getTrips = state => state.trips

export const getCurrentTrip = state => {
  const data = state.trips.get('data').toJS()
  return data[0]
}

let paxCache = null
export const getPax = trip => {
  const resolver = data => {
    const bookings = data.get('bookings')
    return bookings.map(b => {
      return b.get('pax').map(p => setIntoMap(p, 'booking', b))
    }).flatten(1) // one level deep flatten
  }

  if (!paxCache) {
    paxCache = new Cache(trip, resolver)
  }
  return paxCache.getData()
}

let sortedPaxCache = null
export const getSortedPax = trip => {
  const resolver = data => {
    const bookings = data.get('bookings')
    return bookings.map(b => {
      return b.get('pax')
        .map(p => setIntoMap(p, 'booking', b))
    }).flatten(1) // one level deep flatten
      .sortBy(p => `${p.get('firstName')} ${p.get('lastName')}`)
  }

  if (!sortedPaxCache) {
    sortedPaxCache = new Cache(trip, resolver)
  }
  return sortedPaxCache.getData()
}

let sortedBookingCache = null
export const getSortedBookings = trip => {
  const resolver = data => {
    const bookings = data.get('bookings')
    return bookings.sortBy(b => b.get('id'))
  }

  if (!sortedBookingCache) {
    sortedBookingCache = new Cache(trip, resolver)
  }
  return sortedBookingCache.getData()
}

let paxDataCache = null
export const preparePaxData = pax => {
  const resolver = pax => {
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

  if (!paxDataCache) {
    paxDataCache = new Cache(pax, resolver)
  }
  return paxDataCache.getData()
}
