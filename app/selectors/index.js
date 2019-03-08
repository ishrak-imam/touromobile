
export const getAppState = state => state.app
export const getConnection = state => state.connection
export const getLogin = state => state.login
export const getUser = state => state.login.get('user')
export const getJwt = state => state.login.getIn(['user', 'accessToken'])
export const getImageCache = state => state.imageCache

export const {
  getConnections,
  checkIfFlightTrip,
  checkIfBusTrip,
  getTrips,
  getLunches,
  currentTripSelector,
  futureTripsSelector,
  pastTripsSelector,
  getCurrentTrip,
  getPastTrips,
  getFutureTrips,
  getPax,
  getPaxByHotel,
  getFoods,
  filterPaxBySearchText,
  filterBookingBySearchText,
  getSortedPax,
  getSortedPaxByFirstName,
  getSortedPaxByLastName,
  getSortedPaxByAirport,
  getSortedPaxByHotel,
  getBookings,
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
  remainingFutureTrips,
  remainingFutureTripsCount,
  getFlightPax,
  getFlightPaxPhones,
  getPaxWithExcursionPack,
  getPaxDataGroupByBooking,
  getTransportType,
  getFormattedMealsData,
  getExcursions,
  formatCurrentTrip
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
  getOrderStats,
  getTotalParticipantsCount,
  getActualTotalParticipantsCount
} = require('./reports')

export const {
  getModifiedPax,
  getParticipants,
  getModifiedData,
  getAaccept,
  getOrder,
  getOrderSummaryMode,
  getInvoicee,
  getInvoiceeSummaryMode,
  getAllOrders,
  getOrders,
  getOrdersByDirection,
  checkIfAnyOrderMade,
  getOrderForBookingSummaryMode,
  getExtraOrdersSummaryMode
} = require('./modifiedData')

export const {
  getProfile,
  getProfileUpdates,
  getUserInProfile,
  getOrderMode
} = require('./profile')

export const {
  getPresents
} = require('./rollCall')
