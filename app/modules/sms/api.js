import config from '../../utils/config'
import { postRequest } from '../../utils/request'
import { mockSendSms } from '../../mockData'
// import { createDoc } from '../../../api_doc/docCreator'

export const sendSms = (jwt, smsPayload) => {
  const headers = {
    'Authorization': `Bearer ${jwt}`
  }
  // createDoc('POST', '/functions/sms', smsPayload, 'sms')
  return config.useMockData
    ? mockSendSms()
    : postRequest('functions/sms', smsPayload, headers)
}
