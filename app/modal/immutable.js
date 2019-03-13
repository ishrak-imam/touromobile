
import { getMap } from '../utils/immutable'

export const MODAL_INITIAL_STATE = getMap({
  info: getMap({}),
  warning: getMap({}),
  selection: getMap({})
})
