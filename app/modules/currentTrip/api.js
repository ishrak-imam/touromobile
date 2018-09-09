
import config from '../../utils/loadConfig'
import { getToken } from '../../utils/selector'
import { getRequest } from '../../utils/request'
import Store from '../../store'
import { mockCurrentTrip } from '../../mockData'

export const getCurrentTrip = endPoint => {
  const headers = {
    'Authorization': `Bearer ${getToken(Store.getState())}`
  }
  return config.isDebugEnabled ? mockCurrentTrip() : getRequest(endPoint, headers)
}
