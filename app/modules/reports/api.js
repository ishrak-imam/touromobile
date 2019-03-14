
import config from '../../utils/config'
import { mockUploadStats } from '../../mockData'
import { postRequest } from '../../utils/request'
// import { createDoc } from '../../../api_doc/docCreator'

export const uploadStats = (guideId, departureId, statsData, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  // createDoc('POST', '/resources/departure/{departureId}/guide/{guideId}/statistics', statsData, 'uploadStats')
  return config.useMockData
    ? mockUploadStats()
    : postRequest(`resources/departure/${departureId}/guide/${guideId}/statistics`, statsData, headers)
}

export const uploadOrderStats = (guideId, departureId, OrderStats, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  // createDoc('POST', '/resources/departure/{departureId}/guide/{guideId}/invoiceDetails', OrderStats, 'uploadOrderStats')
  return config.useMockData
    ? mockUploadStats()
    : postRequest(`resources/departure/${departureId}/guide/${guideId}/invoiceDetails`, OrderStats, headers)
}
