
import config from '../../utils/config'
import { getRequest } from '../../utils/request'
import { mockGuidesList } from '../../mockData'
// import { createDoc } from '../../../api_doc/docCreator'

export const getGuidesList = jwt => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  // createDoc('GET', '/resources/connectionlocation', {}, 'getConnections')
  return config.useMockData
    ? mockGuidesList()
    : getRequest('resources/guide', headers)
}
