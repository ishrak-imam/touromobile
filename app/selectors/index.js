
export const getAppState = state => state.app
export const getConnection = state => state.connection
export const getLogin = state => state.login
export const getUser = state => state.login.get('user')
export const getJwt = state => state.login.getIn(['user', 'accessToken'])
export const getImageCache = state => state.imageCache

export const {
  getTrips,
  currentTripSelector,
  futureTripsSelector,
  pastTripsSelector,
  getCurrentTrip,
  getPastTrips,
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
  getSortedPaxByBookingId,
  pendingStatsUpload,
  pendingStatsUploadCount,
  getFlightPaxPhones
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
  getStatsData,
  getTotalPercentage
} = require('./reports')

export const {
  getModifiedPax,
  getParticipants,
  getModifiedData
} = require('./modifiedData')

export const {
  getProfile,
  getProfileUpdates,
  getUserInProfile
} = require('./profile')
