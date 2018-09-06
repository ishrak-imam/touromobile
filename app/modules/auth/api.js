
import { postRequest, getRequest } from '../../utils/request'

export const login = data => {
  return postRequest('token', data)
}

export const getUser = (userId, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return getRequest(`resources/user/${userId}`, headers)
}
