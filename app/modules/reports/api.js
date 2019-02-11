
import config from '../../utils/config'
import { mockUploadStats } from '../../mockData'
import { postRequest } from '../../utils/request'

export const uploadStats = (guideId, departureId, statsData, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.useMockData
    ? mockUploadStats()
    : postRequest(`resources/departure/${departureId}/guide/${guideId}/statistics`, statsData, headers)
}

export const uploadOrderStats = (guideId, departureId, OrderStats, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.useMockData
    ? mockUploadStats()
    : postRequest(`resources/departure/${departureId}/guide/${guideId}/invoiceDetails`, OrderStats, headers)
}
