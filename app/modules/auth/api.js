
import config from '../../utils/loadConfig'
import { mockToken, mockUser, mockForgetPass } from '../../mockData'
import { postRequest, getRequest } from '../../utils/request'

export const login = data => {
  return config.isDebugEnabled ? mockToken() : postRequest('token', data)
}

export const getUser = (userId, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.isDebugEnabled ? mockUser() : getRequest(`resources/user/${userId}`, headers)
}

export const forgotPass = data => {
  return config.isDebugEnabled ? mockForgetPass() : mockForgetPass()
}
