
export const getAppState = state => state.app // state.get('app')
export const getConnection = state => state.connection // state.get('connection')
export const getLogin = state => state.login // state.get('login')
export const getJwt = state => state.login.getIn(['user', 'jwt']) // state.getIn(['login', 'user', 'jwt'])
export const getImageCache = state => state.imageCache // state.get('imageCache')
export const {
  getCurrentTrip,
  getPax
} = require('./trip')
