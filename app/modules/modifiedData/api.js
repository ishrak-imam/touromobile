
import config from '../../utils/config'
import { postRequest } from '../../utils/request'
import { mockSyncData } from '../../mockData'

export const syncData = (guideId, data, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.useMockData
    ? mockSyncData()
    : postRequest(
      `resources/guide/${guideId}/appdata`,
      data,
      headers
    )
}
