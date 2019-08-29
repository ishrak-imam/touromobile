
import { createReducer } from '../utils/reduxHelpers'
import { setIntoMap, deleteFromMap } from '../utils/immutable'
import { TRACK_REQUEST, RELEASE_REQUEST } from './action'
import { REQ_MANAGER_INITIAL_STATE } from './immutable'

export const requests = createReducer(REQ_MANAGER_INITIAL_STATE, {
  [TRACK_REQUEST]: (state, payload) => {
    return setIntoMap(state, payload.type, payload)
  },
  [RELEASE_REQUEST]: (state, payload) => {
    return deleteFromMap(state, payload.type)
  }
})
