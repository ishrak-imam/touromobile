
import config from '../../utils/config'
import { mockUploadStats } from '../../mockData'
import { postRequest } from '../../utils/request'

export const uploadStats = (departureId, statsData, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.useMockData
    ? mockUploadStats()
    : postRequest(`resources/departure/${departureId}/statistics`, statsData, headers)
}
