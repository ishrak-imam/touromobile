
import config from '../../utils/config'
import { mockToken, mockUserDetails, mockForgetPass, mockSendAppStatus } from '../../mockData'
import { postRequest, getRequest } from '../../utils/request'
// import { createDoc } from '../../../api_doc/docCreator'

export const login = (user, password) => {
  // createDoc('POST', '/token', { user, password }, 'login')
  return config.useMockData ? mockToken() : postRequest('token', { user, password })
}

export const getUserDetails = (userId, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  // createDoc('GET', '/resources/user/{userId}', {}, 'user')
  return config.useMockData ? mockUserDetails() : getRequest(`resources/user/${userId}`, headers)
}

export const forgotPass = user => {
  // createDoc('POST', '/forgotpassword', { user }, 'forgotpassword')
  return config.useMockData ? mockForgetPass() : postRequest('forgotpassword', { user })
}

export const sendAppStatus = (appStatus, guideId, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  // createDoc('POST', `/resources/guide/${guideId}/appstatus`, appStatus, 'sendAppStatus')
  return config.useMockData ? mockSendAppStatus() : postRequest(`resources/guide/${guideId}/appstatus`, appStatus, headers)
}
