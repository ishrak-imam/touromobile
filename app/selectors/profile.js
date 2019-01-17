
export const getProfile = state => state.profile
export const getProfileUpdates = state => state.profile.get('updates')
export const getUserInProfile = state => state.profile.get('user')
export const getOrderMode = state => state.profile.get('orderMode')
