
import config from '../../utils/config'
import { postRequest } from '../../utils/request'
import { mockSyncData } from '../../mockData'
// import { createDoc } from '../../../api_doc/docCreator'

export const syncData = (guideId, data, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  // createDoc('POST', '/resources/guide/{guideId}/appdata', data, 'syncData')
  return config.useMockData
    ? mockSyncData()
    : postRequest(`resources/guide/${guideId}/appdata`, data, headers)
}
