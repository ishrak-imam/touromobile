
import { isWithinRange, isAfter, isBefore, subDays, addDays } from 'date-fns'
import { setIntoMap, getMap, getList, getSet, listToMap } from '../utils/immutable'
import Cache from '../utils/cache'

const resolvers = {

  sortedTrips: trips => trips.sortBy(trip => trip.get('outDate')),

  pax: data => {
    const bookings = data.get('bookings')
    if (!bookings) return getList([])
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

  sortedPaxByFirstName: data => {
    const bookings = data.get('bookings')
    return bookings.map(b => {
      return b.get('pax').map(p => setIntoMap(p, 'booking', b))
    }).flatten(1).sortBy(p => p.get('firstName'))
  },

  sortedPaxByLastName: data => {
    const bookings = data.get('bookings')
    return bookings.map(b => {
      return b.get('pax').map(p => setIntoMap(p, 'booking', b))
    }).flatten(1).sortBy(p => p.get('lastName'))
  },

  sortedPaxByAirport: data => {
    const bookings = data.get('bookings')
    return bookings.map(b => {
      return b.get('pax').map(p => setIntoMap(p, 'booking', b))
    }).flatten(1).sortBy(p => p.get('airport'))
  },

  sortedPaxByHotel: data => {
    const bookings = data.get('bookings')
    return bookings.map(b => {
      return b.get('pax').map(p => setIntoMap(p, 'booking', b))
    }).flatten(1).sortBy(p => p.get('hotel'))
  },

  sortedPaxByBookingId: data => {
    const bookings = data.get('bookings')
    return bookings.sortBy(b => b.get('id')).map(b => {
      return b.get('pax')
        .map(p => setIntoMap(p, 'booking', b))
        .sortBy(p => `${p.get('firstName')} ${p.get('lastName')}`)
    }).flatten(1)
  },

  sortedBookings: data => {
    const bookings = data.get('bookings')
    return bookings.sortBy(b => b.get('id'))
  },

  paxDataGroupByFirstName: pax => {
    let initial = null
    let tempList = getList([])
    return pax.reduce((list, p, index) => {
      const paxId = String(p.get('id'))
      const paxInitial = p.get('firstName').charAt(0).toLowerCase()
      if (initial !== paxInitial) {
        list = list.concat(tempList)
        initial = paxInitial
        tempList = getList([])
        list = list.push(getMap({
          first: true,
          initial: paxInitial.toUpperCase(),
          id: `${paxInitial}-${paxId}`
        }))
      }
      tempList = tempList.push(p)
      if (index === pax.size - 1) {
        list = list.concat(tempList)
      }
      return list
    }, getList([]))
  },

  paxDataGroupByLastName: pax => {
    let initial = null
    let tempList = getList([])
    return pax.reduce((list, p, index) => {
      const paxId = String(p.get('id'))
      const paxInitial = p.get('lastName').charAt(0).toLowerCase()
      if (initial !== paxInitial) {
        list = list.concat(tempList)
        initial = paxInitial
        tempList = getList([])
        list = list.push(getMap({
          first: true,
          initial: paxInitial.toUpperCase(),
          id: `${paxInitial}-${paxId}`
        }))
      }
      tempList = tempList.push(p)
      if (index === pax.size - 1) {
        list = list.concat(tempList)
      }
      return list
    }, getList([]))
  },

  paxDataGroupByAirport: pax => {
    let initial = null
    let tempList = getList([])
    return pax.reduce((list, p, index) => {
      const paxId = String(p.get('id'))
      const paxInitial = p.get('airport')
      if (initial !== paxInitial) {
        tempList = tempList.sortBy(p => `${p.get('firstName')} ${p.get('lastName')}`)
        list = list.concat(tempList)
        initial = paxInitial
        tempList = getList([])
        list = list.push(getMap({
          first: true,
          initial: paxInitial,
          id: `${paxInitial}-${paxId}`
        }))
      }
      tempList = tempList.push(p)
      if (index === pax.size - 1) {
        tempList = tempList.sortBy(p => `${p.get('firstName')} ${p.get('lastName')}`)
        list = list.concat(tempList)
      }
      return list
    }, getList([]))
  },

  paxDataGroupByHotel: pax => {
    let initial = null
    let tempList = getList([])
    return pax.reduce((list, p, index) => {
      const paxId = String(p.get('id'))
      const paxInitial = p.get('hotel')
      if (initial !== paxInitial) {
        tempList = tempList.sortBy(p => `${p.get('firstName')} ${p.get('lastName')}`)
        list = list.concat(tempList)
        initial = paxInitial
        tempList = getList([])
        list = list.push(getMap({
          first: true,
          initial: paxInitial,
          id: `${paxInitial}-${paxId}`
        }))
      }
      tempList = tempList.push(p)
      if (index === pax.size - 1) {
        tempList = tempList.sortBy(p => `${p.get('firstName')} ${p.get('lastName')}`)
        list = list.concat(tempList)
      }
      return list
    }, getList([]))
  },

  paxDataGroupByBooking: pax => {
    let initial = null
    return pax.map(p => {
      const paxInitial = String(p.get('booking').get('id'))
      if (initial !== paxInitial) {
        initial = paxInitial
        return getList([getMap({ first: true, initial: paxInitial, id: paxInitial }), p])
      }
      return getList([p])
    }).flatten(1)
  },

  phoneNumbers: data => {
    const pax = data.get('pax')
    const modifiedPax = data.get('modifiedPax')
    return pax.reduce((set, p) => {
      const paxId = String(p.get('id'))
      const mp = modifiedPax.get(paxId) || p
      const phone = mp.get('phone')
      if (phone) set = set.add(phone)
      return set
    }, getSet([]))
  },

  paxId: pax => {
    return pax.map(p => String(p.get('id')))
  },

  flightPaxPhones: data => {
    const pax = data.get('pax')
    const flightPax = data.get('flightPax')
    const modifiedPax = data.get('modifiedPax')
    const paxMap = listToMap(pax, 'id')

    return flightPax.reduce((numbers, flightPax) => {
      const paxId = String(flightPax.get('id'))
      const pax = modifiedPax.get(paxId) || paxMap.get(paxId)
      const phone = pax.get('phone')
      if (phone) numbers = numbers.push(getMap({ paxId, phone }))
      return numbers
    }, getList([]))
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

  actualParticipatingPax: data => {
    const pax = data.get('pax')
    const participants = data.get('participants')
    return pax.filter(p => {
      const paxId = String(p.get('id'))
      const isParticipating = participants ? participants.has(paxId) : false
      return isParticipating
    })
  },

  paxWithExcursionPack: pax => {
    return pax.filter(p => p.get('excursionPack'))
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
  },

  formatMealsData: (meals, extra) => {
    return meals.reduce((list, meal) => {
      if (meal.get('child') && meal.get('adult')) {
        list = list
          .push(meal.set('child', null))
          .push(meal.set('name', `(${extra}) ${meal.get('name')}`).set('adult', null))
      }
      if (meal.get('child') && !meal.get('adult')) {
        list = list.push(meal.set('name', `(${extra}) ${meal.get('name')}`))
      }
      if (!meal.get('child') && meal.get('adult')) {
        list = list.push(meal)
      }
      return list
    }, getList([]))
  }

}

export const getTrips = state => state.trips

export const getTripsData = state => state.trips.get('data')

export const currentTripSelector = state => state.trips.get('current')

export const futureTripsSelector = state => state.trips.get('future')

export const pastTripsSelector = state => state.trips.get('past')

export const pendingStatsUploadCount = state => state.trips.get('pendingStatsUpload')

export const remainingFutureTripsCount = state => state.trips.get('remainingFutureTrips')

export const getLunches = state => state.trips.get('current').get('trip').get('lunches')

export const getConnections = state => state.trips.get('connections')

export const getExcursions = state => state.trips.get('current').get('trip').get('excursions')

export const getFoods = (state, type) => {
  const currentTrip = state.trips.get('current')
  if (!currentTrip.get('has')) {
    return false
  }
  const lunches = currentTrip.get('trip').get('lunches')
  if (!lunches) {
    return false
  }
  return getMap({
    out: lunches.get('out').get(type),
    home: lunches.get('home').get(type)
  })
}

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

export const getBookings = trip => {
  return trip.get('bookings') || getList([])
}

let sortedPaxCache = null
export const getSortedPax = trip => {
  if (!sortedPaxCache) {
    sortedPaxCache = Cache(resolvers.sortedPax)
  }
  return sortedPaxCache(trip)
}

let sortedPaxByFirstNameCache = null
export const getSortedPaxByFirstName = trip => {
  if (!sortedPaxByFirstNameCache) {
    sortedPaxByFirstNameCache = Cache(resolvers.sortedPaxByFirstName)
  }
  return sortedPaxByFirstNameCache(trip)
}

let sortedPaxByLastNameCache = null
export const getSortedPaxByLastName = trip => {
  if (!sortedPaxByLastNameCache) {
    sortedPaxByLastNameCache = Cache(resolvers.sortedPaxByLastName)
  }
  return sortedPaxByLastNameCache(trip)
}

let sortedPaxByAirportCache = null
export const getSortedPaxByAirport = trip => {
  if (!sortedPaxByAirportCache) {
    sortedPaxByAirportCache = Cache(resolvers.sortedPaxByAirport)
  }
  return sortedPaxByAirportCache(trip)
}

let sortedPaxByHotelCache = null
export const getSortedPaxByHotel = trip => {
  if (!sortedPaxByHotelCache) {
    sortedPaxByHotelCache = Cache(resolvers.sortedPaxByHotel)
  }
  return sortedPaxByHotelCache(trip)
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

let paxDataGroupByFirstName = null
export const getPaxDataGroupByFirstName = pax => {
  if (!paxDataGroupByFirstName) {
    paxDataGroupByFirstName = Cache(resolvers.paxDataGroupByFirstName)
  }
  return paxDataGroupByFirstName(pax)
}

let paxDataGroupByLastName = null
export const getPaxDataGroupByLastName = pax => {
  if (!paxDataGroupByLastName) {
    paxDataGroupByLastName = Cache(resolvers.paxDataGroupByLastName)
  }
  return paxDataGroupByLastName(pax)
}

let paxDataGroupByAirportCache
export const getPaxDataGroupByAirport = pax => {
  if (!paxDataGroupByAirportCache) {
    paxDataGroupByAirportCache = Cache(resolvers.paxDataGroupByAirport)
  }
  return paxDataGroupByAirportCache(pax)
}

let paxDataGroupByHotelCache = null
export const getPaxDataGroupByHotel = pax => {
  if (!paxDataGroupByHotelCache) {
    paxDataGroupByHotelCache = Cache(resolvers.paxDataGroupByHotel)
  }
  return paxDataGroupByHotelCache(pax)
}

let paxDataGroupByBookingCache = null
export const getPaxDataGroupByBooking = pax => {
  if (!paxDataGroupByBookingCache) {
    paxDataGroupByBookingCache = Cache(resolvers.paxDataGroupByBooking)
  }
  return paxDataGroupByBookingCache(pax)
}

let phoneNumbersCache = null
export const getPhoneNumbers = data => {
  if (!phoneNumbersCache) {
    phoneNumbersCache = Cache(resolvers.phoneNumbers)
  }
  return phoneNumbersCache(data)
}

let paxIdCache = null
export const getPaxIds = pax => {
  if (!paxIdCache) {
    paxIdCache = Cache(resolvers.paxId)
  }
  return paxIdCache(pax)
}

let flightPaxPhonesCache = null
export const getFlightPaxPhones = data => {
  if (!flightPaxPhonesCache) {
    flightPaxPhonesCache = Cache(resolvers.flightPaxPhones)
  }
  return flightPaxPhonesCache(data)
}

let participatingPaxCache = null
export const getParticipatingPax = data => {
  if (!participatingPaxCache) {
    participatingPaxCache = Cache(resolvers.participatingPax)
  }
  return participatingPaxCache(data)
}

let actualParticipatingPaxCache = null
export const getActualParticipatingPax = data => {
  if (!actualParticipatingPaxCache) {
    actualParticipatingPaxCache = Cache(resolvers.actualParticipatingPax)
  }
  return actualParticipatingPaxCache(data)
}

let paxWithExcursionPackCache = null
export const getPaxWithExcursionPack = pax => {
  if (!paxWithExcursionPackCache) {
    paxWithExcursionPackCache = Cache(resolvers.paxWithExcursionPack)
  }

  return paxWithExcursionPackCache(pax)
}

let modifiedPaxByBookingCache = null
export const getModifiedPaxByBooking = data => {
  if (!modifiedPaxByBookingCache) {
    modifiedPaxByBookingCache = Cache(resolvers.modifiedPaxByBooking)
  }
  return modifiedPaxByBookingCache(data)
}

let formattedMealsDataCache = null
export const getFormattedMealsData = (meals, extra) => {
  if (!formattedMealsDataCache) {
    formattedMealsDataCache = Cache(resolvers.formatMealsData)
  }
  return formattedMealsDataCache(meals, extra)
}

/**
 * TODO:
 * Find a way to cache the result
 * note: Not immutable data
 */
export const getCurrentTrip = state => {
  const dateNow = new Date()
  let trips = getSortedTrips(state.trips.get('data'))
  trips = trips.filter(trip => {
    const start = subDays(trip.get('outDate'), 3)
    const end = addDays(trip.get('homeDate'), 2)
    return isWithinRange(dateNow, start, end)
  })
  return {
    has: !!trips.size,
    trips
  }
}

export const formatCurrentTrip = trip => {
  let brand = trip.get('brand')
  if (brand === 'OL') {
    trip = trip.set('brand', 'OH')
  }
  const excursions = trip.get('excursions')
  if (excursions && excursions.size) {
    const filteredEx = excursions.filter(e => e.get('name') !== 'UP')
    trip = trip.set('excursions', filteredEx)
  }
  return trip
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

/**
 * TODO:
 * Find a way to cache the result
 * note: Not immutable data
 */
export const getPaxByHotel = (state, hotelId) => {
  const trip = state.trips.get('current').get('trip')
  const pax = getSortedPax(trip)
  return pax.filter(p => String(p.get('hotel')) === String(hotelId))
}

/**
 * TODO:
 * Find a way to cache the result
 * note: Not immutable data
 */
export const getFlightPax = (pax, key) => {
  return pax.filter((pax) => {
    return pax.get('airport') === key
  })
}

export const pendingStatsUpload = state => {
  const { has, trips } = getPastTrips(state)
  const modifiedData = state.modifiedData
  let count = 0
  if (!has) return count

  count = trips.reduce((count, trip) => {
    const departureId = String(trip.get('departureId'))
    if (!modifiedData.getIn([departureId, 'statsUploadedAt'])) {
      count = count + 1
    }
    return count
  }, count)
  return count
}

export const remainingFutureTrips = state => {
  const { has, trips } = getFutureTrips(state)
  const modifiedData = state.modifiedData
  let count = 0
  if (!has) return count

  count = trips.reduce((count, trip) => {
    const departureId = String(trip.get('departureId'))
    if (!modifiedData.getIn([departureId, 'accept', 'acceptedAt'])) {
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

export const checkIfFlightTrip = trip => {
  const transport = trip.get('transport')
  return transport ? transport.get('type') === 'flight' : false
}

export const checkIfBusTrip = trip => {
  const transport = trip.get('transport')
  return transport ? transport.get('type') === 'bus' : false
}

export const getTransportType = trip => {
  return trip.getIn(['transport', 'type'])
}

export const getTripByDepartureId = (state, departureId) => {
  const data = state.trips.get('data')
  return data.find(d => String(d.get('departureId')) === departureId)
}

export const getReservationsByDepartureId = (state, departureId) => {
  const data = state.trips.get('reservations')
  return data.find(d => String(d.get('departure')) === departureId)
}

export const getReservations = state => {
  const reservations = state.trips.get('reservations')
  return listToMap(reservations, 'departure')
}
