
import { createReducer } from '../../utils/reduxHelpers'
import { setIntoMap, readValue, getMap, mergeMapShallow } from '../../utils/immutable'

import {
  MODIFY_PAX_DATA
} from './action'

import { PAX_INITIAL_STATE } from './immutable'

export const pax = createReducer(PAX_INITIAL_STATE, {
  [MODIFY_PAX_DATA]: (state, payload) => {
    const modifiedData = readValue('modifiedData', state)
    const pax = readValue(payload.key, modifiedData) || getMap({})
    const finalData = setIntoMap(modifiedData, payload.key, mergeMapShallow(pax, getMap(payload.pax)))
    return setIntoMap(state, 'modifiedData', finalData)
  }
})
