
import { createReducer } from '../../utils/reduxHelpers'
import {
  readValue, setIntoMap,
  addToSet, deleteFromSet, getSet
} from '../../utils/immutable'

import {
  ADD_TO_PRESENT,
  REMOVE_FROM_PRESENT,
  RESET_PRESENT
} from './action'

import { ROLL_CALL_INITIAL_STATE } from './immutable'

export const rollCall = createReducer(ROLL_CALL_INITIAL_STATE, {

  [ADD_TO_PRESENT]: (state, payload) => {
    let present = readValue('present', state)
    present = addToSet(present, payload)
    return setIntoMap(state, 'present', present)
  },

  [REMOVE_FROM_PRESENT]: (state, payload) => {
    let present = readValue('present', state)
    present = deleteFromSet(present, payload)
    return setIntoMap(state, 'present', present)
  },

  [RESET_PRESENT]: state => setIntoMap(state, 'present', getSet([]))
})
