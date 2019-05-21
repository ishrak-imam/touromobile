
export const getAppState = state => state.app
export const getConnection = state => state.connection
export const getLogin = state => state.login
export const getUser = state => state.login.get('user')
export const getJwt = state => state.login.getIn(['user', 'accessToken'])
export const getImageCache = state => state.imageCache

export const {
  getTripsData,
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
  getBookings,
  getSortedBookings,
  getPaxDataGroup,
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
  formatCurrentTrip,
  getPaxIds,
  getTripByDepartureId,
  getReservationsByDepartureId,
  getReservations
} = require('./trip')

export const {
  getSortedExcursions,
  getTripExcursions
} = require('./excursions')

export const {
  getNavigation
} = require('./navigation')

export const {
  getInfoModal,
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
  getAccept,
  getOrder,
  getInvoicee,
  getAllOrders,
  getOrders,
  getOrdersByDirection,
  checkIfAnyOrderMade,
  getOrderForBooking,
  getExtraOrders,
  getAllExtraOrders,
  getLastSyncedTime,
  getAcceptedAssignments
} = require('./modifiedData')

export const {
  getProfile,
  getProfileUpdates,
  getUserInProfile
} = require('./profile')

export const {
  getPresents
} = require('./rollCall')

export const {
  getSmsLoading,
  getPendingSms,
  pendingSmsCount
} = require('./sms')
