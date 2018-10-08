
export const getAppState = state => state.app
export const getConnection = state => state.connection
export const getLogin = state => state.login
export const getUser = state => state.login.get('user')
export const getJwt = state => state.login.getIn(['user', 'access_token'])
export const getImageCache = state => state.imageCache

export const {
  getTrips,
  currentTripSelector,
  futureTripsSelector,
  getCurrentTrip,
  getFutureTrips,
  getPax,
  filterPaxBySearchText,
  filterBookingBySearchText,
  getSortedPax,
  getSortedBookings,
  preparePaxData,
  getPhoneNumbers,
  getParticipatingPax,
  getModifiedPaxByBooking,
  getSortedPaxByBookingId
} = require('./trip')

export const {
  getSortedExcursions,
  getTripExcursions
} = require('./excursions')

export const {
  getNavigation
} = require('./navigation')

export const {
  getWarningModal
} = require('./modal')

export const {
  getReports,
  getStatsData
} = require('./reports')

export const {
  getModifiedPax,
  getParticipants
} = require('./modifiedData')
