
import { createReducer } from '../../utils/reduxHelpers'
import { getMap, readValue, setIntoMap } from '../../utils/immutable'

import {
  DOWNLOAD_IMAGE,
  DOWNLOAD_IMAGE_SUCS,
  DOWNLOAD_IMAGE_FAIL
} from './action'

import { IMAGE_CACHE_INITIAL_STATE } from './immutable'

export const imageCache = createReducer(IMAGE_CACHE_INITIAL_STATE, {
  [DOWNLOAD_IMAGE]: (state, payload) => {
    return setIntoMap(state, payload.imageName, getMap({
      loading: true,
      sucs: false
    }))
  },
  [DOWNLOAD_IMAGE_SUCS]: (state, payload) => {
    let image = readValue(payload.imageName, state)
    image = setIntoMap(image, 'loading', false)
    image = setIntoMap(image, 'sucs', true)
    return setIntoMap(state, payload.imageName, image)
  },
  [DOWNLOAD_IMAGE_FAIL]: (state, payload) => {
    let image = readValue(payload.imageName, state)
    image = setIntoMap(image, 'loading', false)
    return setIntoMap(state, payload.imageName, image)
  }
})
