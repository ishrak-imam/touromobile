
import { isWithinRange, isAfter } from 'date-fns'
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
  },

  participants: pax => {
    
  }

}

export const getTrips = state => state.trips

let sortedTripsCache = null
export const getSortedTrips = trips => {
  if (!sortedTripsCache) {
    sortedTripsCache = new Cache(resolvers.sortedTrips)
  }
  return sortedTripsCache.getData(trips)
}

let paxCache = null
export const getPax = trip => {
  if (!paxCache) {
    paxCache = new Cache(resolvers.pax)
  }
  return paxCache.getData(trip)
}

let sortedPaxCache = null
export const getSortedPax = trip => {
  if (!sortedPaxCache) {
    sortedPaxCache = new Cache(resolvers.sortedPax)
  }
  return sortedPaxCache.getData(trip)
}

let sortedBookingCache = null
export const getSortedBookings = trip => {
  if (!sortedBookingCache) {
    sortedBookingCache = new Cache(resolvers.sortedBookings)
  }
  return sortedBookingCache.getData(trip)
}

let paxDataCache = null
export const preparePaxData = pax => {
  if (!paxDataCache) {
    paxDataCache = new Cache(resolvers.paxData)
  }
  return paxDataCache.getData(pax)
}

/**
 * TODO:
 * Find a way to cache the result
 * note: Not immutable data
 */
export const getCurrentTrip = state => {
  const dateNow = new Date()
  const trips = getSortedTrips(state.trips.get('data'))
  const trip = trips.find(trip => {
    return isWithinRange(dateNow, trip.get('outDate'), trip.get('homeDate'))
  })
  return {
    has: !!trip,
    trip: trip || {}
  }
}

/**
 * TODO:
 * Find a way to cache the result
 * note: Not immutable data
 */
export const getFutureTrips = state => {
  const dateNow = new Date()
  const sortedTrips = getSortedTrips(state.trips.get('data'))
  const trips = sortedTrips.filter(trip => {
    return isAfter(trip.get('outDate'), dateNow)
  })
  return {
    has: !!trips.size,
    trips
  }
}

const SEARCH_TEXT_TYPES = {
  number: 'number',
  text: 'text',
  textWithSpace: 'textWithSpace'
}

function getSearchTextType (text) {
  if (!isNaN(parseInt(text))) {
    return SEARCH_TEXT_TYPES.number
  }
  if (text.split(' ').length === 1) {
    return SEARCH_TEXT_TYPES.text
  }
  return SEARCH_TEXT_TYPES.textWithSpace
}

export const filterPaxBySearchText = (pax, text) => {
  const searchTextType = getSearchTextType(text)
  return pax.filter(p => {
    switch (searchTextType) {
      case SEARCH_TEXT_TYPES.number:
        const bookingId = String(p.get('booking').get('id'))
        return bookingId.includes(text)
      case SEARCH_TEXT_TYPES.textWithSpace:
        const splitted = text.split(' ')
        return p.get('firstName').toLowerCase().includes(splitted[0]) &&
                p.get('lastName').toLowerCase().includes(splitted[1])
      case SEARCH_TEXT_TYPES.text:
        const name = `${p.get('firstName')} ${p.get('lastName')}`
        return name.toLowerCase().includes(text)
    }
  })
}

export const filterBookingBySearchText = (booking, text) => {
  const searchTextType = getSearchTextType(text)
  return booking.filter(b => {
    if (searchTextType === SEARCH_TEXT_TYPES.number) {
      const bookingId = String(b.get('id'))
      return bookingId.includes(text)
    }
    const pax = filterPaxBySearchText(b.get('pax'), text)
    return pax.size
  })
}
