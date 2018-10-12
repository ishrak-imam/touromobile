
import { toastDispatcher } from '../utils/actionDispatcher'

const toast = store => next => action => {
  if (action.payload && action.payload.toast) {
    toastDispatcher(action.payload.message)
  }
  next(action)
}

export default toast
