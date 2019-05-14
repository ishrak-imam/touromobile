
import {
  SELECT_INVOICEE,
  TAKE_ORDER, TAKE_EXTRA_ORDER, TAKE_ALLERGY_ORDER,
  SET_PARTICIPANTS,

  setIsNeedDistribution
} from '../modules/modifiedData/action'

const isNeedDistributionON = store => next => action => {
  if (
    action.type === SELECT_INVOICEE ||
    action.type === TAKE_ORDER || action.type === TAKE_EXTRA_ORDER ||
    action.type === TAKE_ALLERGY_ORDER || action.type === SET_PARTICIPANTS
  ) {
    const { departureId, bookingId } = action.payload
    store.dispatch(setIsNeedDistribution({
      departureId, bookingId, isNeedDistribution: true
    }))
  }
  return next(action)
}

export default isNeedDistributionON
