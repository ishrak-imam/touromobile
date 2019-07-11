
import config from '../../utils/config'
import { mockConnectionLines } from '../../mockData'
import { getRequest } from '../../utils/request'

export const getConnectionLines = (departureId, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.useMockData
    ? mockConnectionLines()
    : getRequest(`resources/departure/${departureId}/connections`, headers)
}
