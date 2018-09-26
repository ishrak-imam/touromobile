
export const getAppState = state => state.app
export const getConnection = state => state.connection
export const getLogin = state => state.login
export const getUser = state => state.login.get('user')
export const getJwt = state => state.login.getIn(['user', 'access_token'])
export const getImageCache = state => state.imageCache
export const {
  getTrips,
  getCurrentTrip,
  getFutureTrips,
  getPax,
  filterPaxBySearchText,
  getSortedPax,
  getSortedBookings,
  preparePaxData
} = require('./trip')
export const {
  getExcursions
} = require('./excursions')

export const {
  getNavigation
} = require('./navigation')
