
import { isWithinRange, isAfter, isBefore } from 'date-fns'
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
      return b.get('pax').map(p => setIntoMap(p, 'booking', b))
    }).flatten(1).sortBy(p => `${p.get('firstName')} ${p.get('lastName')}`)
  },

  sortedPaxByBookingId: data => {
    const bookings = data.get('bookings')
    return bookings.sortBy(b => b.get('id')).map(b => {
      return b.get('pax').map(p => setIntoMap(p, 'booking', b))
    }).flatten(1)
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

  phoneNumbers: data => {
    const pax = data.get('pax')
    const modifiedPax = data.get('modifiedPax')
    return pax.filter(p => {
      const paxId = String(p.get('id'))
      const mp = modifiedPax.get(paxId) || p
      return !!mp.get('phone')
    }).map(p => {
      const paxId = String(p.get('id'))
      const mp = modifiedPax.get(paxId) || p
      return mp
    }).map(p => p.get('phone')).join(',')
  },

  participatingPax: data => {
    const pax = data.get('pax')
    const participants = data.get('participants')
    return pax.filter(p => {
      const paxId = String(p.get('id'))
      const hasExcursionPack = p.get('excursionPack')
      const isParticipating = participants ? participants.has(paxId) : false
      return hasExcursionPack || isParticipating
    })
  },

  modifiedPaxByBooking: data => {
    const pax = data.get('pax')
    const modifiedPax = data.get('modifiedPax')
    return pax.reduce((m, p) => {
      const paxId = String(p.get('id'))
      const mp = modifiedPax.get(paxId)
      if (mp) {
        m = setIntoMap(m, paxId, mp)
      }
      return m
    }, getMap({}))
  }

}

export const getTrips = state => state.trips

export const currentTripSelector = state => state.trips.get('current')

export const futureTripsSelector = state => state.trips.get('future')

export const pastTripsSelector = state => state.trips.get('past')

export const pendingStatsUploadCount = state => state.trips.get('pendingStatsUpload')

let sortedTripsCache = null
export const getSortedTrips = trips => {
  if (!sortedTripsCache) {
    sortedTripsCache = Cache(resolvers.sortedTrips)
  }
  return sortedTripsCache(trips)
}

let paxCache = null
export const getPax = trip => {
  if (!paxCache) {
    paxCache = Cache(resolvers.pax)
  }
  return paxCache(trip)
}

let sortedPaxCache = null
export const getSortedPax = trip => {
  if (!sortedPaxCache) {
    sortedPaxCache = Cache(resolvers.sortedPax)
  }
  return sortedPaxCache(trip)
}

let sortedPaxByBookingIdCache = null
export const getSortedPaxByBookingId = trip => {
  if (!sortedPaxByBookingIdCache) {
    sortedPaxByBookingIdCache = Cache(resolvers.sortedPaxByBookingId)
  }
  return sortedPaxByBookingIdCache(trip)
}

let sortedBookingCache = null
export const getSortedBookings = trip => {
  if (!sortedBookingCache) {
    sortedBookingCache = Cache(resolvers.sortedBookings)
  }
  return sortedBookingCache(trip)
}

let paxDataCache = null
export const preparePaxData = pax => {
  if (!paxDataCache) {
    paxDataCache = Cache(resolvers.paxData)
  }
  return paxDataCache(pax)
}

let phoneNumbersCache = null
export const getPhoneNumbers = data => {
  if (!phoneNumbersCache) {
    phoneNumbersCache = Cache(resolvers.phoneNumbers)
  }
  return phoneNumbersCache(data)
}

let participatingPaxCache = null
export const getParticipatingPax = data => {
  if (!participatingPaxCache) {
    participatingPaxCache = Cache(resolvers.participatingPax)
  }
  return participatingPaxCache(data)
}

let modifiedPaxByBookingCache = null
export const getModifiedPaxByBooking = data => {
  if (!modifiedPaxByBookingCache) {
    modifiedPaxByBookingCache = Cache(resolvers.modifiedPaxByBooking)
  }
  return modifiedPaxByBookingCache(data)
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

/**
 * TODO:
 * Find a way to cache the result
 * note: Not immutable data
 */
export const getPastTrips = state => {
  const dateNow = new Date()
  const sortedTrips = getSortedTrips(state.trips.get('data'))
  const trips = sortedTrips.filter(trip => {
    return isBefore(trip.get('homeDate'), dateNow)
  })
  return {
    has: !!trips.size,
    trips
  }
}

export const pendingStatsUpload = state => {
  const { has, trips } = getPastTrips(state)
  const modifiedData = state.modifiedData
  let count = 0
  if (!has) {
    return count
  }

  count = trips.reduce((count, trip) => {
    const departureId = String(trip.get('departureId'))
    if (!modifiedData.get(departureId) || !modifiedData.get(departureId).get('statsUploadedAt')) {
      count = count + 1
    }
    return count
  }, count)

  return count
}

const SEARCH_TEXT_TYPES = {
  number: 'number',
  text: 'text',
  textWithSpace: 'textWithSpace'
}

const getSearchTextType = text => {
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
