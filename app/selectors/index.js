
export const getConnection = state => state.get('connection')
export const getLogin = state => state.get('login')
export const getJwt = state => state.getIn(['login', 'user', 'jwt'])
export const {
  getCurrentTrip,
  getPax
} = require('./trip')
