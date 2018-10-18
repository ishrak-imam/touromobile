
import config from '../../utils/config'
import { mockUserDetails } from '../../mockData'
import { getRequest } from '../../utils/request'

export const getUserDetails = (userId, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.useMockData
    ? mockUserDetails()
    : getRequest(`resources/guide/${userId}`, headers)
}
