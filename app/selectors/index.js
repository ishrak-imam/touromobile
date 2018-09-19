
export const getAppState = state => state.app
export const getConnection = state => state.connection
export const getLogin = state => state.login
export const getUser = state => state.login.get('user')
export const getJwt = state => state.login.getIn(['user', 'jwt'])
export const getImageCache = state => state.imageCache
export const {
  getTrips,
  getCurrentTrip,
  getPax,
  getSortedPax,
  getSortedBookings,
  preparePaxData
} = require('./trip')
