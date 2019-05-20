import React, { Component } from 'react'
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Modal, Dimensions
} from 'react-native'
import { Colors, IonIcon } from '../theme'
import { connect } from 'react-redux'
import { closeModal } from './action'
import { actionDispatcher } from '../utils/actionDispatcher'
import { getDistributionModal } from '../selectors'
import isIphoneX from '../utils/isIphoneX'
import { getMap, getSet } from '../utils/immutable'
import FooterButtons from '../components/footerButtons'

const { height, width } = Dimensions.get('window')
const heightOffset = isIphoneX ? 400 : 200
const widthOffset = 50

const modalHeight = height - heightOffset
const modalWidth = width - widthOffset

const topHeight = 60
const footerHeight = 40
const closeIconWidth = 40

class DistributionModal extends Component {
  constructor (props) {
    super(props)

    this.state = {
      invoiceeList: getMap({}),
      meal: getMap({}),
      drink: getMap({}),
      excursion: getMap({}),
      bucket: getMap({}),
      mealType: '',
      orderType: '',
      direction: '',
      totalOrder: 0
    }
  }

  _onSave = () => {
    const { distribution } = this.props
    const { invoiceeList, bucket } = this.state
    const onSave = distribution.get('onSave')
    onSave(invoiceeList, bucket)
    this._onCancel()
  }

  _onCancel = () => {
    actionDispatcher(closeModal({ type: 'distribution' }))
  }

  componentWillReceiveProps (nextProps) {
    const { distribution } = nextProps
    const data = distribution.get('data') || getMap({})
    const invoiceeList = data.get('invoiceeList') || getMap({})
    const meal = data.get('meal') || getMap({})
    const drink = data.get('drink') || getMap({})
    const excursion = data.get('excursion') || getMap({})
    const mealType = data.get('mealType') || ''
    const orderType = data.get('orderType') || ''
    const direction = data.get('direction') || ''
    const totalOrder = data.get('totalOrder') || 0
    const bucket = data.get('bucket') || getMap({})
    this.setState({
      invoiceeList, meal, drink, excursion, mealType, orderType, direction, totalOrder, bucket
    })
  }

  _getTotalMealOrder = (invoiceeList, direction, meal) => {
    let count = 0
    invoiceeList.every(invoicee => {
      const mealId = meal.get('mealId')
      const isAllergy = meal.get('type') === 'allergy'
      const orders = invoicee.get('orders') || getMap({})
      let order = orders.getIn([direction, 'meal', mealId])
      if (order) {
        if (isAllergy) {
          const allergyMeals = order.get('allergies') || getMap({})
          const allergyId = meal.get('allergyId')
          order = allergyMeals.get(allergyId)
        }
        const mealCount = order ? meal.get('adult') ? order.get('adultCount') : order.get('childCount') : 0
        count = count + mealCount
      }
      return true
    })
    return count
  }

  // _getTotalDrinkOrder = (invoiceeList, direction, drink) => {
  //   let count = 0
  //   invoiceeList.every(invoicee => {
  //     const drinkId = drink.get('drinkId')
  //     const orders = invoicee.get('orders') || getMap({})
  //     let order = orders.getIn([direction, 'drink', drinkId])
  //     if (order) {
  //       count = count + order.get('count')
  //     }
  //     return true
  //   })
  //   return count
  // }

  _getTotalExcursionOrder = (invoiceeList, excursion) => {
    const excursionId = excursion.get('id')
    const isAdult = excursion.get('adult')
    let count = 0
    invoiceeList.every(invoicee => {
      const participants = invoicee.get('participants')
      if (participants) {
        const excursion = participants.get(excursionId)
        if (excursion) {
          const ct = isAdult ? excursion.getIn(['adult', 'count']) : excursion.getIn(['child', 'count'])
          count = count + ct
        }
      }
      return true
    })
    return count
  }

  _distributeMeal = (paxId, meal, direction, sign, totalOrderAfter) => () => {
    let { invoiceeList, bucket, totalOrder } = this.state

    let invoicee = invoiceeList.get(paxId)

    let inOrders = invoicee.get('orders') || getMap({})
    let buOrders = bucket.get('orders')

    let dInOrders = inOrders.get(direction) || getMap({})
    let dBuOrders = buOrders.get(direction)

    let inMealOrders = dInOrders.get('meal') || getMap({})
    let buMealOrders = dBuOrders.get('meal')

    const mealId = meal.get('mealId')
    const isAdult = meal.get('adult')
    const countKey = isAdult ? 'adultCount' : 'childCount'
    const isAllergy = meal.get('type') === 'allergy'

    let inMeal = inMealOrders.get(mealId) || getMap({ mealId, adultCount: 0, childCount: 0 })
    let buMeal = buMealOrders.get(mealId)

    if (isAllergy) {
      let inAllergyOrders = inMeal.get('allergies') || getMap({})
      let buAllergyOrders = buMeal.get('allergies')
      const allergyId = meal.get('allergyId')

      let inAllergyOrder = inAllergyOrders.get(allergyId) || getMap({
        adult: meal.get('adult') || null,
        adultCount: 0,
        allergyId,
        allergyText: meal.get('allergyText'),
        child: meal.get('child') || null,
        childCount: 0,
        mealId
      })
      let buAllergyOrder = buAllergyOrders.get(allergyId)
      let count = inAllergyOrder.get(countKey)
      if (sign === 'plus' && count < totalOrder && totalOrderAfter < totalOrder) {
        count = count + 1
        inAllergyOrder = inAllergyOrder.set(countKey, count)
        buAllergyOrder = buAllergyOrder.set(countKey, buAllergyOrder.get(countKey) - 1)
      }

      if (sign === 'minus' && count > 0) {
        count = count - 1
        inAllergyOrder = inAllergyOrder.set(countKey, count)
        buAllergyOrder = buAllergyOrder.set(countKey, buAllergyOrder.get(countKey) + 1)
      }

      inAllergyOrders = inAllergyOrders.set(allergyId, inAllergyOrder)
      buAllergyOrders = buAllergyOrders.set(allergyId, buAllergyOrder)

      inMeal = inMeal.set('allergies', inAllergyOrders)
      buMeal = buMeal.set('allergies', buAllergyOrders)
    } else {
      let count = inMeal.get(countKey)
      if (sign === 'plus' && count < totalOrder && totalOrderAfter < totalOrder) {
        count = count + 1
        inMeal = inMeal.set(countKey, count)
        buMeal = buMeal.set(countKey, buMeal.get(countKey) - 1)
      }

      if (sign === 'minus' && count > 0) {
        count = count - 1
        inMeal = inMeal.set(countKey, count)
        buMeal = buMeal.set(countKey, buMeal.get(countKey) + 1)
      }
    }

    inMealOrders = inMealOrders.set(mealId, inMeal)
    buMealOrders = buMealOrders.set(mealId, buMeal)

    dInOrders = dInOrders.set('meal', inMealOrders)
    dBuOrders = dBuOrders.set('meal', buMealOrders)

    inOrders = inOrders.set(direction, dInOrders)
    buOrders = buOrders.set(direction, dBuOrders)

    invoicee = invoicee.set('orders', inOrders)
    bucket = bucket.set('orders', buOrders)

    invoiceeList = invoiceeList.set(paxId, invoicee)

    this.setState({ invoiceeList, bucket })
  }

  // _distributeDrink = (paxId, drink, direction, sign) => () => {
  //   let { invoiceeList } = this.state
  //   let invoicee = invoiceeList.get(paxId)
  //   let orders = invoicee.get('orders') || getMap({})
  //   let directionOrders = orders.get(direction) || getMap({})
  //   let drinkOrders = directionOrders.get('drink') || getMap({})
  //   const drinkId = drink.get('drinkId')
  //   const drinkCount = drink.get('count')
  //   let drinkOrder = drinkOrders.get(drinkId) || getMap({ drinkId, count: 0, isChild: 0 })
  //   let count = drinkOrder.get('count')
  //   count = sign === 'plus'
  //     ? count < drinkCount ? count + 1 : count
  //     : count === 0 ? 0 : count - 1
  //   drinkOrder = drinkOrder.set('count', count)
  //   drinkOrders = drinkOrders.set(drinkId, drinkOrder)
  //   directionOrders = directionOrders.set('drink', drinkOrders)
  //   orders = orders.set(direction, directionOrders)
  //   invoicee = invoicee.set('orders', orders)
  //   invoiceeList = invoiceeList.set(paxId, invoicee)
  //   this.setState({ invoiceeList })
  // }

  _distributeExcursion = (paxId, excursion, sign, totalOrderAfter) => () => {
    const { totalOrder } = this.state
    const excursionId = excursion.get('id')
    const isAdult = excursion.get('adult')
    // const exCount = excursion.getIn(['ex', 'count'])
    let { invoiceeList, bucket } = this.state
    let invoicee = invoiceeList.get(paxId)
    let participants = invoicee.get('participants') || getMap({})
    let parExcursion = participants.get(excursionId) ||
      getMap({
        id: excursionId,
        name: excursion.get('name'),
        adult: getMap({ count: 0, pax: getSet([]) }),
        child: getMap({ count: 0, pax: getSet([]) })
      })

    let count = isAdult ? parExcursion.getIn(['adult', 'count']) : parExcursion.getIn(['child', 'count'])

    let bParticipants = bucket.get('participants')
    let bucketEx = bParticipants.get(excursionId)
    let bSection = bucketEx.get(isAdult ? 'adult' : 'child')
    let section = parExcursion.get(isAdult ? 'adult' : 'child')

    if (sign === 'plus' && count < totalOrder && totalOrderAfter < totalOrder) {
      count = count + 1
      section = section.set('count', count)
      let pax = section.get('pax')
      let bPax = bSection.get('pax')
      const item = bPax.last()
      section = section.set('pax', pax.add(item))
      bSection = bSection.set('pax', bPax.delete(item))
      bSection = bSection.set('count', bSection.get('count') - 1)
    }

    if (sign === 'minus' && count > 0) {
      count = count - 1
      section = section.set('count', count)
      let pax = section.get('pax')
      let bPax = bSection.get('pax')
      const item = pax.last()
      bSection = bSection.set('pax', bPax.add(item))
      bSection = bSection.set('count', bSection.get('count') + 1)
      section = section.set('pax', pax.delete(item))
    }

    parExcursion = parExcursion.set(isAdult ? 'adult' : 'child', section)
    bucketEx = bucketEx.set(isAdult ? 'adult' : 'child', bSection)

    bParticipants = bParticipants.set(excursionId, bucketEx)
    participants = participants.set(excursionId, parExcursion)

    invoicee = invoicee.set('participants', participants)
    invoiceeList = invoiceeList.set(paxId, invoicee)

    bucket = bucket.set('participants', bParticipants)

    this.setState({ invoiceeList, bucket })
  }

  _renderInvoiceeForMeal = (invoiceeList, direction, meal, totalOrderAfter) => {
    return invoiceeList.keySeq().toArray().map(paxId => {
      const invoicee = invoiceeList.get(paxId)
      const orders = invoicee.get('orders') || getMap({})
      const invoiceeName = invoicee.get('name')
      const mealId = meal.get('mealId')

      const order = orders.getIn([direction, 'meal', mealId])

      let count = order
        ? meal.get('adult') ? order.get('adultCount') : order.get('childCount')
        : 0

      if (order && meal.get('type') === 'allergy') {
        const allergyMeals = order.get('allergies') || getMap({})
        const allergyId = meal.get('allergyId')
        const allergyMeal = allergyMeals.get(allergyId)
        count = allergyMeal ? meal.get('adult') ? allergyMeal.get('adultCount') : allergyMeal.get('childCount') : 0
      }

      return (
        <View style={ss.item} key={paxId}>
          <View style={ss.itemLeft}>
            <Text style={ss.invoicee}>{invoiceeName}</Text>
          </View>
          <View style={ss.itemRight}>
            <TouchableOpacity style={ss.minus} onPress={this._distributeMeal(paxId, meal, direction, 'minus', totalOrderAfter)}>
              <Text style={ss.sign}>-</Text>
            </TouchableOpacity>
            <View style={ss.counter}>
              <Text style={ss.count}>{count}</Text>
            </View>
            <TouchableOpacity style={ss.plus} onPress={this._distributeMeal(paxId, meal, direction, 'plus', totalOrderAfter)}>
              <Text style={ss.sign}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    })
  }

  // _renderInvoiceeForDrink = (invoiceeList, direction, drink) => {
  //   return invoiceeList.keySeq().toArray().map(paxId => {
  //     const invoicee = invoiceeList.get(paxId)
  //     const orders = invoicee.get('orders') || getMap({})
  //     const invoiceeName = invoicee.get('name') || ''
  //     const drinkId = drink.get('drinkId')
  //     const order = orders.getIn([direction, 'drink', drinkId])
  //     const count = order ? order.get('count') : 0

  //     return (
  //       <View style={ss.item} key={paxId}>
  //         <View style={ss.itemLeft}>
  //           <Text style={ss.invoicee}>{invoiceeName}</Text>
  //         </View>
  //         <View style={ss.itemRight}>
  //           <TouchableOpacity style={ss.minus} onPress={this._distributeDrink(paxId, drink, direction, 'minus')}>
  //             <Text style={ss.sign}>-</Text>
  //           </TouchableOpacity>
  //           <View style={ss.counter}>
  //             <Text style={ss.count}>{count}</Text>
  //           </View>
  //           <TouchableOpacity style={ss.plus} onPress={this._distributeDrink(paxId, drink, direction, 'plus')}>
  //             <Text style={ss.sign}>+</Text>
  //           </TouchableOpacity>
  //         </View>
  //       </View>
  //     )
  //   })
  // }

  _renderInvoiceeForExcursion = (invoiceeList, excursion, totalOrderAfter) => {
    return invoiceeList.keySeq().toArray().map(paxId => {
      const excursionId = excursion.get('id')
      const isAdult = excursion.get('adult')
      const invoicee = invoiceeList.get(paxId)
      const invoiceeName = invoicee.get('name') || ''
      const participants = invoicee.get('participants') || getMap({})
      let count = 0
      const parExcursion = participants.get(excursionId)
      if (parExcursion) count = parExcursion.getIn([isAdult ? 'adult' : 'child', 'count'])

      return (
        <View style={ss.item} key={paxId}>
          <View style={ss.itemLeft}>
            <Text style={ss.invoicee}>{invoiceeName}</Text>
          </View>
          <View style={ss.itemRight}>
            <TouchableOpacity style={ss.minus} onPress={this._distributeExcursion(paxId, excursion, 'minus', totalOrderAfter)}>
              <Text style={ss.sign}>-</Text>
            </TouchableOpacity>
            <View style={ss.counter}>
              <Text style={ss.count}>{count}</Text>
            </View>
            <TouchableOpacity style={ss.plus} onPress={this._distributeExcursion(paxId, excursion, 'plus', totalOrderAfter)}>
              <Text style={ss.sign}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      )
    })
  }

  render () {
    const { distribution } = this.props
    const config = distribution.get('config') || null
    const {
      invoiceeList, meal, totalOrder,
      // drink,
      excursion, mealType, orderType, direction
    } = this.state

    let totalOrderAfter = 0

    if (orderType === 'orders') {
      if (mealType === 'meal') {
        totalOrderAfter = this._getTotalMealOrder(invoiceeList, direction, meal)
      }

      // if (mealType === 'drink') {
      //   totalOrderAfter = this._getTotalDrinkOrder(invoiceeList, direction, drink)
      // }
    }

    if (orderType === 'excursion') {
      totalOrderAfter = this._getTotalExcursionOrder(invoiceeList, excursion)
    }

    const isDisabled = totalOrder !== totalOrderAfter

    return (
      <Modal
        animationType='slide'
        transparent
        visible={!!distribution.size}
        onRequestClose={() => {}}
      >
        <View style={ss.modal}>
          <View style={ss.container}>
            <View style={ss.top}>
              <View style={ss.label}>
                {!!config && <Text style={ss.labelText}>{config.get('label')}</Text>}
              </View>
              <TouchableOpacity style={ss.close} onPress={this._onCancel}>
                <IonIcon name='x' size={30} color={Colors.silver} />
              </TouchableOpacity>
            </View>
            <View style={ss.body}>
              <View style={[ss.totalOrder, { height: 25 }]}>
                <Text style={ss.totalText}>Total order: {totalOrder}</Text>
              </View>
              <View style={[ss.totalOrder, { height: 30, marginTop: 0 }]}>
                {!!config &&
                <Text numberOfLines={2} style={ss.instruction}>{config.get('instruction')}</Text>}
              </View>
              <ScrollView contentContainerStyle={ss.scroll}>

                {
                  !!invoiceeList.size && orderType === 'orders' && mealType === 'meal' &&
                  this._renderInvoiceeForMeal(invoiceeList, direction, meal, totalOrderAfter)
                }

                {/* {
                  !!invoiceeList.size && orderType === 'orders' && mealType === 'drink' &&
                  this._renderInvoiceeForDrink(invoiceeList, direction, drink)
                } */}

                {
                  !!invoiceeList.size && orderType === 'excursion' &&
                  this._renderInvoiceeForExcursion(invoiceeList, excursion, totalOrderAfter)
                }

              </ScrollView>
            </View>
            <View style={ss.footer}>
              <FooterButtons disabled={isDisabled} onSave={this._onSave} onCancel={this._onCancel} />
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}

const stateToProps = state => ({
  distribution: getDistributionModal(state)
})

export default connect(stateToProps, null)(DistributionModal)

const ss = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.overlay
  },
  container: {
    height: modalHeight,
    width: modalWidth,
    borderRadius: 7,
    backgroundColor: Colors.silver
  },
  top: {
    height: topHeight,
    width: '100%',
    flexDirection: 'row',
    backgroundColor: Colors.blue,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5
  },
  label: {
    height: topHeight,
    width: modalWidth - closeIconWidth,
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  labelText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: Colors.silver
  },
  close: {
    height: topHeight,
    width: closeIconWidth,
    justifyContent: 'center',
    alignItems: 'center'
  },
  body: {
    height: modalHeight - (topHeight + footerHeight),
    width: '100%'
  },
  totalOrder: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    paddingHorizontal: 10
  },
  totalText: {
    fontWeight: 'bold',
    fontSize: 16
  },
  instruction: {
    fontStyle: 'italic',
    color: Colors.cancel,
    fontSize: 12
  },
  scroll: {
    marginHorizontal: 10
  },
  item: {
    width: '100%',
    minHeight: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
    marginTop: 5
  },
  itemLeft: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingRight: 5
  },
  invoiceeName: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  itemRight: {
    flex: 1.2,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  plus: {
    height: 30,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.green,
    borderRadius: 3
  },
  minus: {
    height: 30,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cancel,
    borderRadius: 3
  },
  counter: {
    height: 30,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sign: {
    fontWeight: 'bold',
    color: Colors.white
  },
  count: {
    fontWeight: 'bold'
  },
  footer: {
    height: footerHeight,
    width: '100%',
    paddingHorizontal: 10
  }
})
