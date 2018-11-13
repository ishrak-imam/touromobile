
import config from '../../utils/config'
import { mockToken, mockUser, mockForgetPass } from '../../mockData'
import { postRequest, getRequest, resetPass } from '../../utils/request'

export const login = (user, password) => {
  return config.useMockData ? mockToken() : postRequest('token', { user, password })
}

export const getUser = (userId, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.useMockData ? mockUser() : getRequest(`resources/user/${userId}`, headers)
}

export const forgotPass = user => {
  return config.useMockData ? mockForgetPass() : resetPass('forgotpassword', { user })
}
