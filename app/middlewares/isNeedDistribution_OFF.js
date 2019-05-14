
import {
  DELETE_INVOICEE,
  setIsNeedDistribution
} from '../modules/modifiedData/action'

const isNeedDistributionOFF = store => next => action => {
  const result = next(action)
  if (action.type === DELETE_INVOICEE) {
    const state = store.getState()
    const { departureId, bookingId } = action.payload
    const invoicee = state.modifiedData.getIn([departureId, 'orders', bookingId, 'invoicee'])
    store.dispatch(setIsNeedDistribution({
      departureId,
      bookingId,
      isNeedDistribution: invoicee.size > 1
    }))
  }
  return result
}

export default isNeedDistributionOFF
