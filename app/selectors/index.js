
export const getAppState = state => state.app
export const getConnection = state => state.connection
export const getLogin = state => state.login
export const getUser = state => state.login.get('user')
export const getJwt = state => state.login.getIn(['user', 'accessToken'])
export const getImageCache = state => state.imageCache

export const {
  getTrips,
  getLunches,
  currentTripSelector,
  futureTripsSelector,
  pastTripsSelector,
  getCurrentTrip,
  getPastTrips,
  getFutureTrips,
  getPax,
  getMeals,
  filterPaxBySearchText,
  filterBookingBySearchText,
  getSortedPax,
  getSortedPaxByFirstName,
  getSortedPaxByLastName,
  getSortedPaxByAirport,
  getSortedPaxByHotel,
  getSortedBookings,
  getPaxDataGroupByFirstName,
  getPaxDataGroupByLastName,
  getPaxDataGroupByAirport,
  getPaxDataGroupByHotel,
  getPhoneNumbers,
  getParticipatingPax,
  getActualParticipatingPax,
  getModifiedPaxByBooking,
  getSortedPaxByBookingId,
  pendingStatsUpload,
  pendingStatsUploadCount,
  getFlightPaxPhones,
  getPaxWithExcursionPack,
  getPaxDataGroupByBooking
} = require('./trip')

export const {
  getSortedExcursions,
  getTripExcursions
} = require('./excursions')

export const {
  getNavigation
} = require('./navigation')

export const {
  getWarningModal,
  getSelectionModal
} = require('./modal')

export const {
  getReports,
  getStatsData,
  getTotalParticipantsCount,
  getActualTotalParticipantsCount
} = require('./reports')

export const {
  getModifiedPax,
  getParticipants,
  getModifiedData,
  getAaccept,
  getOrder,
  getInvoicee,
  getAllOrders,
  getOrdersByDirection
} = require('./modifiedData')

export const {
  getProfile,
  getProfileUpdates,
  getUserInProfile
} = require('./profile')

export const {
  getPresents
} = require('./rollCall')
