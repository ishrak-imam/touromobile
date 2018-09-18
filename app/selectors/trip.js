
import { setIntoMap, getMap, getList } from '../utils/immutable'

export const getCurrentTrip = state => state.currentTrip // state.get('currentTrip')

const paxCache = {
  previous: null,
  computed: null
}
export const getPax = trip => {
  if (trip.equals(paxCache.previous)) {
    return paxCache.computed
  }
  paxCache.previous = trip
  const bookings = trip.get('bookings')
  paxCache.computed = bookings.map(b => {
    return b.get('pax').map(p => setIntoMap(p, 'booking', b))
  }).flatten(1) // one level deep flatten
  return paxCache.computed
}

const sortedPaxCache = {
  previous: null,
  computed: null
}
export const getSortedPax = trip => {
  if (trip.equals(sortedPaxCache.previous)) {
    return sortedPaxCache.computed
  }
  sortedPaxCache.previous = trip
  const bookings = trip.get('bookings')
  sortedPaxCache.computed = bookings.map(b => {
    return b.get('pax')
      .map(p => setIntoMap(p, 'booking', b))
  }).flatten(1) // one level deep flatten
    .sortBy(p => `${p.get('firstName')} ${p.get('lastName')}`)
  return sortedPaxCache.computed
}

const sortedBookingCache = {
  previous: null,
  computed: null
}
export const getSortedBookings = trip => {
  if (trip.equals(sortedBookingCache.previous)) {
    return sortedBookingCache.computed
  }
  sortedBookingCache.previous = trip
  const bookings = trip.get('bookings')
  sortedBookingCache.computed = bookings.sortBy(b => b.get('id'))
  return sortedBookingCache.computed
}

const paxDataCache = {
  previous: null,
  computed: null
}
export const preparePaxData = pax => {
  if (pax.equals(paxDataCache.previous)) {
    return paxDataCache.computed
  }
  paxDataCache.previous = pax
  let initial = null
  paxDataCache.computed = pax.map(p => {
    const paxInitial = p.get('firstName').charAt(0).toLowerCase()
    if (initial !== paxInitial) {
      initial = paxInitial
      return getList([getMap({ first: true, initial: paxInitial.toUpperCase() }), p])
    }
    return getList([p])
  }).flatten(1) // one level flatten
  return paxDataCache.computed
}
