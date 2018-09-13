
export const getConnection = state => state.get('connection')
export const getLogin = state => state.get('login')
export const getJwt = state => state.getIn(['login', 'user', 'jwt'])
export const getImageCache = state => state.get('imageCache')
export const {
  getCurrentTrip,
  getPax
} = require('./trip')
