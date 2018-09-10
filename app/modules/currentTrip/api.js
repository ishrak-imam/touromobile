
import config from '../../utils/loadConfig'
// import { getRequest } from '../../utils/request'
import { mockCurrentTrip } from '../../mockData'

export const getCurrentTrip = jwt => {
  // const headers = {
  //   'Authorization': `Bearer ${jwt}`
  // }
  return config.isDebugEnabled ? mockCurrentTrip() : mockCurrentTrip()
}
