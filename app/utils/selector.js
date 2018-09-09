
export const getConnection = state => state.get('connection')
export const getToken = state => state.getIn(['login', 'user', 'token'])
