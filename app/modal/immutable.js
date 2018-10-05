
import { getMap } from '../utils/immutable'

export const MODAL_INITIAL_STATE = getMap({
  warning: getMap({
    visible: false,
    text: null,
    onOk: null
  })
})
