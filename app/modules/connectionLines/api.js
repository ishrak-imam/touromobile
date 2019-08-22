
import config from '../../utils/config'
import { mockConnectionLines } from '../../mockData'
import { getRequest } from '../../utils/request'
// import { createDoc } from '../../../api_doc/docCreator'

export const getConnectionLines = (departureId, jwt) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  // createDoc('GET', 'resources/departure/{departureId}/connections', {}, 'getConnectionLines')
  return config.useMockData
    ? mockConnectionLines()
    : getRequest(`resources/departure/${departureId}/connections`, headers)
}
