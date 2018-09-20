
import config from '../../utils/config'
import { getRequest } from '../../utils/request'
import { mockTrips } from '../../mockData'

export const getTripsApi = (guideId, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.isDebugEnabled
    ? mockTrips()
    : mockTrips() // getRequest(`resources/guide/${guideId}/overview`, headers)
}