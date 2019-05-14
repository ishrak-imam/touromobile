
import { showToast } from '../toast/action'

const toast = store => next => action => {
  if (action.payload && action.payload.toast) {
    const { message } = action.payload
    store.dispatch(showToast({ message }))
  }
  return next(action)
}

export default toast
