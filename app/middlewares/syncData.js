
import { getJwt } from '../selectors'
import { SYNC_MODIFIED_DATA } from '../modules/modifiedData/action'

const syncData = store => next => action => {
  if (action.type === SYNC_MODIFIED_DATA) {
    const state = store.getState()
    const { lastSyncedTime, ...modifiedData } = state.modifiedData.toJS()

    action.payload.jwt = getJwt(state)
    action.payload.guideId = state.login.getIn(['user', 'guideId'])
    action.payload.data = modifiedData
    action.payload.lastSyncedTime = new Date().getTime()
  }
  next(action)
}

export default syncData
