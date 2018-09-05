
import { postRequest } from '../../utils/request'

export const loginRequest = data => {
  return postRequest('token', data)
}
