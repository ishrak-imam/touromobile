
import jwtDecode from 'jwt-decode'

export const getPayloadFromJwt = jwt => {
  return jwtDecode(jwt)
}
