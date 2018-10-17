
import { createReducer } from '../../utils/reduxHelpers'
import { readValue, setIntoMap } from '../../utils/immutable'
import { TOGGLE_TAB_LABELS } from './action'

import { PROFILE_INITIAL_STATE } from './immutable'

export const profile = createReducer(PROFILE_INITIAL_STATE, {
  [TOGGLE_TAB_LABELS]: (state) => {
    const toggle = readValue('labelVisible', state)
    return setIntoMap(state, 'labelVisible', !toggle)
  }
})
