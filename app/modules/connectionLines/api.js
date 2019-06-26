
import config from '../../utils/config'
import { mockConnectionLines } from '../../mockData'

export const getConnectionLines = (guideId, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  return config.useMockData
    ? mockConnectionLines()
    : mockConnectionLines()
}
