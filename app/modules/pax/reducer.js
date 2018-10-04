
import { createReducer } from '../../utils/reduxHelpers'
import { setIntoMap, readValue, getMap, mergeMapShallow } from '../../utils/immutable'

import {
  MODIFY_PAX_DATA
} from './action'

import { PAX_INITIAL_STATE } from './immutable'

export const modifiedPax = createReducer(PAX_INITIAL_STATE, {
  [MODIFY_PAX_DATA]: (state, payload) => {
    const pax = readValue(payload.key, state) || getMap({})
    return setIntoMap(state, payload.key, mergeMapShallow(pax, getMap(payload.pax)))
  }
})
