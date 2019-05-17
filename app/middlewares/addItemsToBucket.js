
import {
  TAKE_EXTRA_ORDER,
  SET_PARTICIPANTS,

  setOrderBucket, setInvoiceeList
} from '../modules/modifiedData/action'
import { getMap } from '../utils/immutable'
import { getExcursions, getModifiedPax, getParticipantsByBooking } from '../selectors'

import { flattenParticipants } from '../utils/distribution'

const addItemsToBucket = store => next => action => {
  const result = next(action)
  const state = store.getState()

  if (action.type === TAKE_EXTRA_ORDER) {
    const { departureId, bookingId } = action.payload

    let invoiceeList = state.modifiedData.getIn([departureId, 'orders', bookingId, 'invoicee']) || getMap({})
    if (invoiceeList.size > 1) {
      let bucket = state.modifiedData.getIn([departureId, 'orders', bookingId, 'bucket']) || getMap({})

      let { extraOrders } = action.payload
      let distributedOrders = getMap({})
      invoiceeList = invoiceeList.map(invoicee => {
        let inExtraOrders = invoicee.get('extraOrders') || getMap({})
        if (inExtraOrders.size > 0) {
          inExtraOrders = inExtraOrders.filter((order, orderId) => {
            if (extraOrders.get(orderId)) {
              distributedOrders = distributedOrders.set(orderId, order)
              return true
            }
            return false
          })
          invoicee = invoicee.set('extraOrders', inExtraOrders)
        }
        return invoicee
      })
      extraOrders = extraOrders.filter((order, orderId) => {
        return !distributedOrders.get(orderId)
      })

      bucket = bucket.set('extraOrders', extraOrders)
      store.dispatch(setOrderBucket({
        departureId, bookingId, bucket
      }))
      store.dispatch(setInvoiceeList({
        departureId, bookingId, invoiceeList
      }))
    }
  }

  if (action.type === SET_PARTICIPANTS) {
    let { departureId, excursionId, booking, bookingId } = action.payload

    let invoiceeList = state.modifiedData.getIn([departureId, 'orders', bookingId, 'invoicee']) || getMap({})

    if (invoiceeList.size > 1) {
      let bucket = state.modifiedData.getIn([departureId, 'orders', bookingId, 'bucket']) || getMap({})

      const excursions = getExcursions(state)
      const modifiedPax = getModifiedPax(state, departureId)

      let participants = getParticipantsByBooking(state, departureId, bookingId)
      let exParticipants = participants.get(excursionId)

      invoiceeList = invoiceeList.map(invoicee => {
        let inPar = invoicee.get('participants') || getMap({})
        let inExPar = inPar.get(excursionId)

        if (inExPar && inExPar.size > 0) {
          let adult = inExPar.get('adult')
          let aPax = adult.get('pax')
          aPax = aPax.filter(p => exParticipants.has(p))
          adult = adult.set('count', aPax.size).set('pax', aPax)

          let child = inExPar.get('child')
          let cPax = child.get('pax')
          cPax = cPax.filter(p => exParticipants.has(p))
          child = child.set('count', cPax.size).set('pax', cPax)

          inExPar = inExPar.set('adult', adult).set('child', child)
          inPar = inPar.set(excursionId, inExPar)
        }
        invoicee = invoicee.set('participants', inPar)
        return invoicee
      })

      let newParticipants = action.payload.participants

      invoiceeList.every(invoicee => {
        const ex = invoicee.getIn(['participants', excursionId])
        if (ex) {
          const adultPax = ex.getIn(['adult', 'pax'])
          newParticipants = newParticipants.filter(p => {
            return !adultPax.has(p)
          })

          const childPax = ex.getIn(['child', 'pax'])
          newParticipants = newParticipants.filter(p => {
            return !childPax.has(p)
          })
        }
        return true
      })

      newParticipants = getMap({ [excursionId]: newParticipants })
      newParticipants = flattenParticipants(newParticipants, excursions, booking, modifiedPax)
      let bucketPar = bucket.get('participants') || getMap({})
      bucketPar = bucketPar.set(excursionId, newParticipants.get(excursionId))
      bucket = bucket.set('participants', bucketPar)

      store.dispatch(setOrderBucket({
        departureId, bookingId, bucket
      }))
      store.dispatch(setInvoiceeList({
        departureId, bookingId, invoiceeList
      }))
    }
  }

  return result
}

export default addItemsToBucket
