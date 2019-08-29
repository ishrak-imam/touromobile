
import { store } from '../store'
// import { releaseRequest } from './action'

export const resolvePendingRequests = () => {
  const requests = store.getState().requests
  if (requests && requests.size) {
    requests.every(req => {
      store.dispatch(req)
      return true
    })
  }
}
