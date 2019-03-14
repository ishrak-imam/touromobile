
import config from '../../utils/config'
import { mockToken, mockUser, mockForgetPass } from '../../mockData'
import { postRequest, getRequest } from '../../utils/request'
// import { createDoc } from '../../../api_doc/docCreator'

export const login = (user, password) => {
  // createDoc('POST', '/token', { user, password }, 'login')
  return config.useMockData ? mockToken() : postRequest('token', { user, password })
}

export const getUser = (userId, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  // createDoc('GET', '/resources/user/{userId}', {}, 'user')
  return config.useMockData ? mockUser() : getRequest(`resources/user/${userId}`, headers)
}

export const forgotPass = user => {
  // createDoc('POST', '/forgotpassword', { user }, 'forgotpassword')
  return config.useMockData ? mockForgetPass() : postRequest('forgotpassword', { user })
}
