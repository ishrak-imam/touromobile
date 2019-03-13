import config from '../../utils/config'
// import { postRequest } from '../../utils/request'
import { mockSendSms } from '../../mockData'

export const sendSms = (jwt, smsPayload) => {
  // const headers = {
  //   'Authorization': `Bearer ${jwt}`
  // }
  return config.useMockData
    ? mockSendSms()
    : mockSendSms()
}
