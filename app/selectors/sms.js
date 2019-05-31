
export const getSmsLoading = state => state.sms.get('isLoading')
export const getPendingSms = state => state.sms.get('pendings')
export const getHideMyPhone = state => state.sms.get('hideMyPhone')

export const pendingSmsCount = state => {
  const pendings = state.sms.get('pendings')
  return pendings.size
}
