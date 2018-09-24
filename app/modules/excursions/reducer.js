
import { createReducer } from '../../utils/reduxHelpers'
import { setIntoMap, readValue } from '../../utils/immutable'

import {
  SET_PARTICIPANTS
} from './action'

import { EXCURSIONS_INITIAL_STATE } from './immutable'

export const excursions = createReducer(EXCURSIONS_INITIAL_STATE, {
  [SET_PARTICIPANTS]: (state, payload) => {
    return setIntoMap(state, 'participants', setIntoMap(readValue('participants', state), payload.key, payload.value))
  }
})
