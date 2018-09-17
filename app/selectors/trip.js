
import { setIntoMap } from '../utils/immutable'

export const getCurrentTrip = state => state.currentTrip // state.get('currentTrip')

export const getPax = trip => {
  const bookings = trip.get('bookings')
  return bookings.map(b => {
    return b.get('pax').map(p => setIntoMap(p, 'booking', b))
  }).flatten(1) // one level deep flatten
}

export const getSortedPax = trip => {
  const bookings = trip.get('bookings')
  return bookings.map(b => {
    return b.get('pax')
      .map(p => setIntoMap(p, 'booking', b))
  }).flatten(1) // one level deep flatten
    .sortBy(p => `${p.get('firstName')} ${p.get('lastName')}`)
}

export const getSortedBookings = trip => {
  const bookings = trip.get('bookings')
  return bookings.sortBy(b => b.get('id'))
}
