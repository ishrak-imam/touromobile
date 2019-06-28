
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

  sortedPax: (paxList, sortBy) => {
    const sortFunc = p => {
      if (!sortBy) return `${p.get('firstName')} ${p.get('lastName')}`
      if (sortBy === 'booking') return p.get('booking').get('id')
      return p.get(sortBy)
    }
    return paxList.sortBy(sortFunc)
  },

  sortedBookings: data => {
    const bookings = data.get('bookings')
    if (!bookings) return getList([])
    return bookings.sortBy(b => b.get('id'))
  },

  paxDataGroup: (pax, groupBy) => {
    const getInitial = from => {
      if (groupBy === 'firstName' || groupBy === 'lastName') {
        return from.get(groupBy).charAt(0)
      }
      if (groupBy === 'lastNameLong') {
        return from.get('lastName')
      } else {
        return from.get(groupBy)
      }
    }

    if (groupBy === 'booking') {
      let initial = null
      return pax.map(p => {
        const paxInitial = String(p.get('booking').get('id'))
        if (initial !== paxInitial) {
          initial = paxInitial
          return getList([getMap({ first: true, initial: paxInitial, id: paxInitial, booking: p.get('booking') }), p])
        }
        return getList([p])
      }).flatten(1)
    } else {
      let initial = null
      let tempList = getList([])
      return pax.reduce((list, p, index) => {
        const paxId = String(p.get('id'))
        const paxInitial = getInitial(p)
        if (initial !== paxInitial) {
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
          list = list.concat(tempList)
        }
        return list
      }, getList([]))
    }
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

  formatMealsData: (data, extra) => {
    const meals = data.get('meals')
    const mealOrders = data.get('mealOrders')

    return meals.reduce((list, meal) => {
      const mealId = String(meal.get('id'))

      if (meal.get('child') && meal.get('adult')) {
        list = list
          .push(meal.set('child', null).set('type', 'regular'))
          .push(meal.set('name', `(${extra}) ${meal.get('name')}`).set('adult', null).set('type', 'regular'))
      }
      if (meal.get('child') && !meal.get('adult')) {
        list = list.push(meal.set('name', `(${extra}) ${meal.get('name')}`).set('type', 'regular'))
      }
      if (!meal.get('child') && meal.get('adult')) {
        list = list.push(meal.set('type', 'regular'))
      }

      if (mealOrders && mealOrders.get(mealId)) {
        const mealOrder = mealOrders.get(mealId)
        if (mealOrder.get('allergies')) {
          mealOrder.get('allergies').every(order => {
            let name = `${meal.get('name')} (${order.get('allergyText')})`
            if (order.get('child')) name = `(${extra}) ${name}`
            list = list.push(getMap({
              allergyId: order.get('allergyId'),
              name,
              adult: order.get('adult'),
              child: order.get('child'),
              type: 'allergy',
              id: order.get('mealId')
            }))
            return true
          })
        }
      }

      return list
    }, getList([]))
  }
}

export const getTrips = state => state.trips

export const getTripsLoading = state => state.trips.get('isLoading')

export const getTripsData = state => state.trips.get('data')

export const currentTripSelector = state => state.trips.get('current')

export const getBrand = state => state.trips.getIn(['current', 'trip', 'brand'])

export const futureTripsSelector = state => state.trips.get('future')

export const pastTripsSelector = state => state.trips.get('past')

export const pendingStatsUploadCount = state => state.trips.get('pendingStatsUpload')

export const remainingFutureTripsCount = state => state.trips.get('remainingFutureTrips')

export const getLunches = state => state.trips.get('current').get('trip').get('lunches')

export const getConnections = state => state.trips.get('connections')

export const getExcursions = state => state.trips.get('current').get('trip').get('excursions')

export const getMeals = state => {
  const lunches = state.trips.getIn(['current', 'trip', 'lunches']) || getMap({})
  let meals = getMap({})
  return meals
    .set('out', lunches.getIn(['out', 'meals']))
    .set('home', lunches.getIn(['home', 'meals']))
}

export const getDrinks = state => {
  const lunches = state.trips.getIn(['current', 'trip', 'lunches']) || getMap({})
  let meals = getMap({})
  return meals
    .set('out', lunches.getIn(['out', 'beverages']))
    .set('home', lunches.getIn(['home', 'beverages']))
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
export const getSortedPax = (paxList, sortBy) => {
  if (!sortedPaxCache) {
    sortedPaxCache = Cache(resolvers.sortedPax)
  }
  return sortedPaxCache(paxList, sortBy)
}

let sortedBookingCache = null
export const getSortedBookings = trip => {
  if (!sortedBookingCache) {
    sortedBookingCache = Cache(resolvers.sortedBookings)
  }
  return sortedBookingCache(trip)
}

let paxDataGroupByCache = null
export const getPaxDataGroup = (paxList, groupBy) => {
  if (!paxDataGroupByCache) {
    paxDataGroupByCache = Cache(resolvers.paxDataGroup)
  }
  return paxDataGroupByCache(paxList, groupBy)
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
export const getFormattedMealsData = (data, extra) => {
  if (!formattedMealsDataCache) {
    formattedMealsDataCache = Cache(resolvers.formatMealsData)
  }
  return formattedMealsDataCache(data, extra)
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
    const end = addDays(trip.get('homeDate'), 5)
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
  let pax = getPax(trip)
  pax = getSortedPax(pax)
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
