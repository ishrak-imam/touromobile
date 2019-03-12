
import config from '../../utils/config'
import { mockUserDetails, mockUpdateProfile, mockDownloadAppData } from '../../mockData'
import { getRequest, putRequest } from '../../utils/request'

export const getUserDetails = (userId, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.useMockData
    ? mockUserDetails()
    : getRequest(`resources/guide/${userId}`, headers)
}

export const updateProfile = (userId, data, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.useMockData
    ? mockUpdateProfile()
    : putRequest(`resources/guide/${userId}`, { changes: data }, headers)
}

export const downloadAppData = (guideId, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.useMockData
    ? mockDownloadAppData()
    : getRequest(`resources/guide/${guideId}/appdata`, headers)
}
