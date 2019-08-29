
import { releaseRequest } from '../requestmanager/action'

const requestManager = store => next => action => {
  const result = next(action)
  if (action) {
    const { type } = action
    const requestType = type.slice(0, type.length - 4)
    const responseType = type.substring(type.length - 4)
    if (responseType === 'SUCS' || responseType === 'FAIL') {
      store.dispatch(releaseRequest({ type: `${requestType}REQ` }))
    }
  }
  return result
}

export default requestManager
