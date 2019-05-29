
import React, { Component } from 'react'
import {
  View, Text, TouchableOpacity,
  StyleSheet
} from 'react-native'
import { connect } from 'react-redux'
import {
  getParticipantsByBooking,
  getExtraOrdersByBooking,
  getOrdersByBooking,
  getMeals, getExcursions,
  getDrinks, getBucket, getModifiedPax
} from '../selectors'
import { actionDispatcher } from '../utils/actionDispatcher'
import {
  setOrderBucket,
  setInvoiceeList,
  setIsNeedDistribution
} from '../modules/modifiedData/action'
import { getMap, getList, listToMap, getSet } from '../utils/immutable'
import { flattenParticipants, checkIfAllDistributed } from '../utils/distribution'
import { Colors } from '../theme'
import OutHomeTab from '../components/outHomeTab'
import { showModal } from '../modal/action'
import _T from '../utils/translator'

class DistributeOrders extends Component {
  constructor (props) {
    super(props)
    const { participants, orders, excursions, booking, modifiedPax } = props
    this.state = {
      tab: 'out',
      mainParticipants: flattenParticipants(participants, excursions, booking, modifiedPax),
      mainOrders: orders
    }
  }

  componentWillReceiveProps (nextProps) {
    const { participants, orders, excursions, booking, modifiedPax } = nextProps
    this.setState({
      mainParticipants: flattenParticipants(participants, excursions, booking, modifiedPax),
      mainOrders: orders
    })
  }

  _calculateParticipantsCount = participants => {
    return participants.map(par => par.size)
  }

  _setInvoiceeList = (invoiceeList, bucket) => {
    const { bookingId, departureId } = this.props
    actionDispatcher(setInvoiceeList({
      bookingId,
      departureId,
      invoiceeList
    }))

    actionDispatcher((setOrderBucket({
      departureId, bookingId, bucket
    })))

    actionDispatcher(setIsNeedDistribution({
      departureId,
      bookingId,
      isNeedDistribution: !checkIfAllDistributed(bucket)
    }))
  }

  _onModalSave = (invoiceeList, bucket) => {
    this._setInvoiceeList(invoiceeList, bucket)
  }

  _onModalCancel = () => {
    console.log('Distribution modal canceled')
  }

  _distributeAllOrders = paxId => {
    const { mainOrders } = this.state
    let { invoiceeList, bucket } = this.props
    invoiceeList = invoiceeList.map((invoicee, id) => {
      if (paxId === id) {
        invoicee = invoicee.set('orders', mainOrders)
      } else {
        invoicee = invoicee.set('orders', getMap({ out: getMap({ meal: getMap({}) }), home: getMap({ meal: getMap({}) }) }))
      }
      return invoicee
    })
    bucket = bucket.set('orders', getMap({ out: getMap({ meal: getMap({}) }), home: getMap({ meal: getMap({}) }) }))
    this._setInvoiceeList(invoiceeList, bucket)
  }

  _distributeAllExcursion = paxId => {
    const { mainParticipants } = this.state
    let { invoiceeList, bucket } = this.props
    invoiceeList = invoiceeList.map((invoicee, id) => {
      if (paxId === id) {
        invoicee = invoicee.set('participants', mainParticipants)
      } else {
        invoicee = invoicee.delete('participants')
      }
      return invoicee
    })
    bucket = bucket.set('participants', getMap({}))
    this._setInvoiceeList(invoiceeList, bucket)
  }

  _distributeAllExtraOrders = paxId => {
    let { extraOrders, invoiceeList, bucket } = this.props
    invoiceeList = invoiceeList.map((invoicee, id) => {
      if (paxId === id) {
        invoicee = invoicee.set('extraOrders', extraOrders)
      } else {
        invoicee = invoicee.delete('extraOrders')
      }
      return invoicee
    })

    bucket = bucket.set('extraOrders', getMap({}))
    this._setInvoiceeList(invoiceeList, bucket)
  }

  _onDistributeAll = section => ({ value }) => {
    const paxId = value.key
    switch (section) {
      case 'participants':
        this._distributeAllExcursion(paxId)
        break
      case 'orders':
        this._distributeAllOrders(paxId)
        break
      case 'extraOrders':
        this._distributeAllExtraOrders(paxId)
        break
    }
  }

  _onPressDistributeAll = section => () => {
    actionDispatcher(showModal({
      type: 'selection',
      options: this._getSelectionOptions(),
      onSelect: this._onDistributeAll(section)
    }))
  }

  _prepareMealData = (orders, bucket, storage, direction) => {
    orders.every(meal => {
      const mealId = meal.get('mealId')
      const adultCount = meal.get('adultCount')
      const childCount = meal.get('childCount')
      if (adultCount > 0) {
        bucket.push({
          mealId,
          name: storage.getIn([mealId, 'name']),
          type: 'regular',
          count: adultCount,
          allergyId: '',
          allergyText: '',
          adult: true
        })
      }
      if (childCount > 0) {
        bucket.push({
          mealId,
          name: `(Child) ${storage.getIn([mealId, 'name'])}`,
          type: 'regular',
          count: childCount,
          allergyId: '',
          allergyText: '',
          adult: false
        })
      }
      const allergyOrders = meal.get('allergies')
      if (allergyOrders) {
        allergyOrders.every(meal => {
          const mealId = meal.get('mealId')
          const allergyId = meal.get('allergyId')
          const allergyText = meal.get('allergyText')
          const adultCount = meal.get('adultCount')
          const childCount = meal.get('childCount')
          if (adultCount > 0) {
            bucket.push({
              mealId,
              name: `${storage.getIn([mealId, 'name'])} (${allergyText})`,
              type: 'allergy',
              count: adultCount,
              allergyId,
              allergyText,
              adult: meal.get('adult'),
              child: null
            })
          }
          if (childCount > 0) {
            bucket.push({
              mealId,
              name: `(Child) ${storage.getIn([mealId, 'name'])} (${allergyText})`,
              type: 'allergy',
              count: childCount,
              allergyId,
              allergyText,
              adult: null,
              child: meal.get('child')
            })
          }
          return true
        })
      }
      return true
    })
    return bucket
  }

  _prepareDrinkData = (orders, bucket, storage) => {
    orders.every(drink => {
      const drinkId = drink.get('drinkId')
      bucket.push({
        drinkId,
        name: storage.getIn([drinkId, 'name']),
        count: drink.get('count'),
        isChild: drink.get('isChild')
      })
      return true
    })
    return bucket
  }

  _flattenMealsAndDrinks = orders => {
    const aggregated = {
      out: { meals: [], drinks: [] },
      home: { meals: [], drinks: [] }
    }

    if (orders) {
      const { meals, drinks } = this.props
      const outMeals = listToMap(meals.get('out'), 'id')
      const outDrinks = listToMap(drinks.get('out'), 'id')
      const homeMeals = listToMap(meals.get('home'), 'id')
      const homeDrinks = listToMap(drinks.get('home'), 'id')

      const outOrders = orders.get('out')
      const homeOrders = orders.get('home')

      if (outOrders && outOrders.size) {
        const out = { meals: [], drinks: [] }
        const mealOrders = outOrders.get('meal')
        const drinkOrders = outOrders.get('drink')
        if (mealOrders) out.meals = this._prepareMealData(mealOrders, out.meals, outMeals, 'out')
        if (drinkOrders) out.drinks = this._prepareDrinkData(drinkOrders, out.drinks, outDrinks)
        aggregated.out = out
      }

      if (homeOrders && homeOrders.size) {
        const home = { meals: [], drinks: [] }
        const mealOrders = homeOrders.get('meal')
        const drinkOrders = homeOrders.get('drink')
        if (mealOrders) home.meals = this._prepareMealData(mealOrders, home.meals, homeMeals, 'home')
        if (drinkOrders) home.drinks = this._prepareDrinkData(drinkOrders, home.drinks, homeDrinks)
        aggregated.home = home
      }
    }

    return aggregated
  }

  _onPressMeal = meal => () => {
    const mealId = meal.mealId
    const allergyId = meal.allergyId
    const { tab, mainOrders } = this.state
    const { invoiceeList, bucket } = this.props
    const isAdult = !!meal.adult
    const isAllergy = meal.type === 'allergy'
    const countKey = isAdult ? 'adultCount' : 'childCount'
    let totalOrder = mainOrders.getIn([tab, 'meal', mealId, countKey])
    if (isAllergy) {
      totalOrder = mainOrders.getIn([tab, 'meal', mealId, 'allergies', allergyId, countKey])
    }
    actionDispatcher(showModal({
      type: 'distribution',
      data: {
        meal,
        invoiceeList,
        bucket,
        direction: tab,
        totalOrder,
        mealType: 'meal',
        orderType: 'orders'
      },
      config: { label: meal.name, instruction: _T('distributionInstruction') },
      onSave: this._onModalSave,
      onCancel: this._onModalCancel
    }))
  }

  // _onPressDrink = drink => () => {
  //   const { tab } = this.state
  //   const { invoiceeList } = this.props
  //   actionDispatcher(showModal({
  //     type: 'distribution',
  //     data: {
  //       drink,
  //       invoiceeList,
  //       direction: tab,
  //       mealType: 'drink',
  //       orderType: 'orders'
  //     },
  //     config: { label: drink.name, instruction: _T('distributionInstruction') },
  //     onSave: this._onModalSave,
  //     onCancel: this._onModalCancel
  //   }))
  // }

  _onPressExcursion = excursion => () => {
    const { invoiceeList, bucket } = this.props
    const { mainParticipants } = this.state
    const isAdult = excursion.get('adult')
    const key = isAdult ? 'adult' : 'child'
    const exId = excursion.get('id')
    actionDispatcher(showModal({
      type: 'distribution',
      data: {
        excursion,
        bucket,
        totalOrder: mainParticipants.getIn([exId, key, 'count']),
        invoiceeList,
        direction: '',
        mealType: '',
        orderType: 'excursion'
      },
      config: { label: excursion.get('name'), instruction: _T('distributionInstruction') },
      onSave: this._onModalSave,
      onCancel: this._onModalCancel
    }))
  }

  _onDeleteMeal = (paxId, mealItem, direction) => () => {
    const mealId = mealItem.mealId
    const isAdult = !!mealItem.adult
    const countKey = isAdult ? 'adultCount' : 'childCount'
    const isAllergy = mealItem.type === 'allergy'

    let { invoiceeList, bucket } = this.props

    let invoicee = invoiceeList.get(paxId)

    let inOrders = invoicee.get('orders')
    let buOrders = bucket.get('orders')

    let dInOrders = inOrders.get(direction)
    let dBuOrders = buOrders.get(direction)

    let inMealOrders = dInOrders.get('meal')
    let buMealOrders = dBuOrders.get('meal')

    let inMeal = inMealOrders.get(mealId)
    let buMeal = buMealOrders.get(mealId) || getMap({ mealId, adultCount: 0, childCount: 0 })

    if (isAllergy) {
      let inAllergyOrders = inMeal.get('allergies') || getMap({})
      let buAllergyOrders = buMeal.get('allergies') || getMap({})
      const allergyId = mealItem.allergyId

      let inAllergyOrder = inAllergyOrders.get(allergyId)
      let buAllergyOrder = buAllergyOrders.get(allergyId) || getMap({
        adult: mealItem.adult || null,
        adultCount: 0,
        allergyId,
        allergyText: mealItem.allergyText,
        child: mealItem.child,
        childCount: 0,
        mealId
      })
      const count = inAllergyOrder.get(countKey)

      inAllergyOrder = inAllergyOrder.set(countKey, 0)
      buAllergyOrder = buAllergyOrder.set(countKey, buAllergyOrder.get(countKey) + count)

      inAllergyOrders = inAllergyOrders.set(allergyId, inAllergyOrder)
      buAllergyOrders = buAllergyOrders.set(allergyId, buAllergyOrder)

      inMeal = inMeal.set('allergies', inAllergyOrders)
      buMeal = buMeal.set('allergies', buAllergyOrders)
    } else {
      const count = inMeal.get(countKey)
      inMeal = inMeal.set(countKey, 0)
      buMeal = buMeal.set(countKey, buMeal.get(countKey) + count)
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

    this._setInvoiceeList(invoiceeList, bucket)
  }

  _onDeleteExtraOrder = (paxId, itemId) => () => {
    let { invoiceeList, bucket } = this.props
    let invoicee = invoiceeList.get(paxId)
    let orders = invoicee.get('extraOrders')
    let order = orders.get(itemId)
    orders = orders.delete(itemId)
    invoicee = invoicee.set('extraOrders', orders)
    invoiceeList = invoiceeList.set(paxId, invoicee)
    bucket = bucket.setIn(['extraOrders', itemId], order)
    this._setInvoiceeList(invoiceeList, bucket)
  }

  _onDeleteExcursion = (paxId, excursion) => () => {
    let { invoiceeList, bucket } = this.props
    const exId = excursion.get('id')
    const isAdult = excursion.get('adult')

    let bParticipants = bucket.get('participants') || getMap({})
    let bEx = bParticipants.get(exId) || getMap({
      id: exId,
      name: excursion.get('name'),
      adult: getMap({ count: 0, pax: getSet([]) }),
      child: getMap({ count: 0, pax: getSet([]) })
    })

    let invoicee = invoiceeList.get(paxId)
    let inParticipants = invoicee.get('participants')
    let inEx = inParticipants.get(exId)

    let bSection = bEx.get(isAdult ? 'adult' : 'child')
    let inSection = inEx.get(isAdult ? 'adult' : 'child')

    bSection = bSection.set('count', bSection.get('count') + inSection.get('count'))
      .set('pax', bSection.get('pax').concat(inSection.get('pax')))

    inSection = inSection.set('count', 0).set('pax', getSet([]))

    bEx = bEx.set(isAdult ? 'adult' : 'child', bSection)
    inEx = inEx.set(isAdult ? 'adult' : 'child', inSection)

    bParticipants = bParticipants.set(exId, bEx)
    inParticipants = inParticipants.set(exId, inEx)

    bucket = bucket.set('participants', bParticipants)
    invoicee = invoicee.set('participants', inParticipants)
    invoiceeList = invoiceeList.set(paxId, invoicee)

    this._setInvoiceeList(invoiceeList, bucket)
  }

  _renderMeals = (meals, renderButtons, paxId, direction) => {
    return (
      <View style={ss.itemCon}>
        <View style={ss.sectionHeader}>
          <Text style={ss.boldText}>{_T('meals')}</Text>
          {renderButtons &&
          <TouchableOpacity
            style={ss.headerButton}
            onPress={this._onPressDistributeAll('orders')}
          >
            <Text style={ss.buttonText}>Distribute all</Text>
          </TouchableOpacity>}
        </View>
        <View style={ss.mealItems}>
          {meals.map((meal, index) => {
            const mealId = meal.mealId
            let onPress = this._onPressMeal(meal)
            if (!renderButtons) onPress = () => {}
            return (
              <TouchableOpacity
                disabled={!renderButtons}
                onPress={onPress}
                style={ss.orderItem}
                key={`${mealId} - ${index}`}
              >
                {!renderButtons &&
                <View style={ss.delete}>
                  <TouchableOpacity
                    style={ss.deleteButton}
                    onPress={this._onDeleteMeal(paxId, meal, direction)}
                  >
                    <Text style={ss.minus}>-</Text>
                  </TouchableOpacity>
                </View>}
                <View style={ss.itemName}>
                  <Text>{meal.name}</Text>
                </View>
                <View style={ss.itemCount}>
                  <Text>{meal.count}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  // _renderDrinks = (drinks, renderButtons) => {
  //   return (
  //     <View style={ss.drinksCon}>
  //       {/* <Text style={ss.boldText}>Drinks</Text> */}
  //       <View style={ss.mealItems}>
  //         {drinks.map((drink, index) => {
  //           const drinkId = drink.drinkId
  //           let onPress = this._onPressDrink(drink)
  //           if (!renderButtons) onPress = () => {}
  //           return (
  //             <TouchableOpacity
  //               disabled={!renderButtons}
  //               onPress={onPress}
  //               style={ss.orderItem}
  //               key={`${drinkId} - ${index}`}
  //             >
  //               {!renderButtons &&
  //               <View style={ss.delete}>
  //                 <TouchableOpacity style={ss.deleteButton}>
  //                   <Text style={ss.minus}>-</Text>
  //                 </TouchableOpacity>
  //               </View>}
  //               <View style={ss.itemName}>
  //                 <Text>{drink.name}</Text>
  //               </View>
  //               <View style={ss.itemCount}>
  //                 <Text>{drink.count}</Text>
  //               </View>
  //             </TouchableOpacity>
  //           )
  //         })}
  //       </View>
  //     </View>
  //   )
  // }

  _renderMealsAndDrinks = (orders, renderButtons, paxId) => {
    const { tab } = this.state
    const flatOrders = this._flattenMealsAndDrinks(orders)
    const { meals
      // drinks
    } = flatOrders[tab]

    return (
      <View style={ss.orders}>
        {this._renderMeals(meals, renderButtons, paxId, tab)}
        {/* {this._renderDrinks(drinks, renderButtons)} */}
      </View>
    )
  }

  _renderExcursions = (participants, renderButtons, paxId) => {
    return (
      <View style={ss.orderCon}>
        <View style={ss.sectionHeader}>
          <Text style={ss.boldText}>{_T('excursions')}</Text>
          {renderButtons &&
          <TouchableOpacity
            style={ss.headerButton}
            onPress={this._onPressDistributeAll('participants')}
          >
            <Text style={ss.buttonText}>Distribute all</Text>
          </TouchableOpacity>}
        </View>
        <View style={ss.mealItems}>
          {participants.keySeq().toArray().map(excursionId => {
            const ex = participants.get(excursionId) || getMap({})

            const adultEx = getMap({ id: ex.get('id'), name: ex.get('name'), adult: true, ex: ex.get('adult') })
            const childEx = getMap({ id: ex.get('id'), name: ex.get('name'), adult: false, ex: ex.get('child') })

            let onPressAdult = this._onPressExcursion(adultEx)
            let onPressChild = this._onPressExcursion(childEx)
            if (!renderButtons) {
              onPressAdult = () => {}
              onPressChild = () => {}
            }

            const adultCount = adultEx.getIn(['ex', 'count'])
            const childCount = childEx.getIn(['ex', 'count'])

            return (
              <View style={ss.orders} key={ex.get('id')}>
                {
                  !!adultCount &&
                  <TouchableOpacity
                    onPress={onPressAdult}
                    style={ss.orderItem}
                    disabled={!renderButtons}
                  >
                    {!renderButtons &&
                    <View style={ss.delete}>
                      <TouchableOpacity
                        style={ss.deleteButton}
                        onPress={this._onDeleteExcursion(paxId, adultEx, 'participants')}
                      >
                        <Text style={ss.minus}>-</Text>
                      </TouchableOpacity>
                    </View>}
                    <View style={ss.itemName}>
                      <Text>{adultEx.get('name')}</Text>
                    </View>
                    <View style={ss.itemCount}>
                      <Text>{adultCount}</Text>
                    </View>
                  </TouchableOpacity>
                }

                {
                  !!childCount &&
                  <TouchableOpacity
                    onPress={onPressChild}
                    style={ss.orderItem}
                    disabled={!renderButtons}
                  >
                    {!renderButtons &&
                    <View style={ss.delete}>
                      <TouchableOpacity
                        style={ss.deleteButton}
                        onPress={this._onDeleteExcursion(paxId, childEx, 'participants')}
                      >
                        <Text style={ss.minus}>-</Text>
                      </TouchableOpacity>
                    </View>}
                    <View style={ss.itemName}>
                      <Text>(Child) {childEx.get('name')}</Text>
                    </View>
                    <View style={ss.itemCount}>
                      <Text>{childCount}</Text>
                    </View>
                  </TouchableOpacity>
                }
              </View>
            )
          })}
        </View>
      </View>
    )
  }

  _getSelectionOptions = () => {
    const config = {
      label: 'Select invoicee',
      key: 'paxId',
      direction: ''
    }
    const { invoiceeList } = this.props
    const items = invoiceeList.reduce((list, b) => {
      list = list.push(getMap({
        key: b.get('id'),
        value: b.get('name')
      }))
      return list
    }, getList([]))

    return {
      config, items
    }
  }

  _onSelectInvoicee = order => ({ value }) => {
    const orderId = order.get('id')
    const paxId = value.key
    let { invoiceeList, bucket } = this.props
    invoiceeList = invoiceeList.map(invoicee => {
      const invoiceeId = invoicee.get('id')
      let extraOrders = invoicee.get('extraOrders') || getMap({})
      if (paxId === invoiceeId) {
        extraOrders = extraOrders.set(orderId, order)
      } else {
        extraOrders = extraOrders.delete(orderId, order)
      }
      invoicee = invoicee.set('extraOrders', extraOrders)
      return invoicee
    })

    let bExtraOrders = bucket.get('extraOrders')
    bExtraOrders = bExtraOrders.delete(orderId)
    bucket = bucket.set('extraOrders', bExtraOrders)

    this._setInvoiceeList(invoiceeList, bucket)
  }

  _onPressExtraOrder = order => () => {
    actionDispatcher(showModal({
      type: 'selection',
      options: this._getSelectionOptions(),
      onSelect: this._onSelectInvoicee(order)
    }))
  }

  _renderExtraOrders = (extraOrders, renderButtons, paxId) => {
    return (
      <View style={ss.orderCon}>
        <View style={ss.sectionHeader}>
          <Text style={ss.boldText}>{_T('extraOrders')}</Text>
          {renderButtons &&
          <TouchableOpacity
            style={ss.headerButton}
            onPress={this._onPressDistributeAll('extraOrders')}
          >
            <Text style={ss.buttonText}>Distribute all</Text>
          </TouchableOpacity>}
        </View>
        <View style={ss.mealItems}>
          {extraOrders.keySeq().toArray().map(orderId => {
            const order = extraOrders.get(orderId)
            let onPress = this._onPressExtraOrder(order)
            if (!renderButtons) onPress = () => {}
            return (
              <TouchableOpacity
                onPress={onPress}
                style={ss.orderItem}
                key={orderId}
              >
                {!renderButtons &&
                <View style={ss.delete}>
                  <TouchableOpacity
                    style={ss.deleteButton}
                    onPress={this._onDeleteExtraOrder(paxId, orderId)}
                  >
                    <Text style={ss.minus}>-</Text>
                  </TouchableOpacity>
                </View>}
                <View style={ss.itemName}>
                  <Text>{order.get('text')}</Text>
                </View>
                <View style={ss.itemAmount}>
                  <Text>Cost: {order.get('amount')}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  _onTabSwitch = tab => {
    return () => {
      this.setState({ tab })
    }
  }

  _renderBucket = () => {
    const { bucket } = this.props

    const orders = bucket.get('orders') || getMap({})
    const participants = bucket.get('participants') || getMap({})
    const extraOrders = bucket.get('extraOrders') || getMap({})
    const { tab } = this.state

    return (
      <View style={ss.bucket}>
        <View style={ss.tab}>
          <OutHomeTab selected={tab} onPress={this._onTabSwitch} />
        </View>
        {this._renderMealsAndDrinks(orders, true)}
        <View style={ss.orders}>
          {this._renderExcursions(participants, true)}
        </View>
        <View style={ss.orders}>
          {this._renderExtraOrders(extraOrders, true)}
        </View>
      </View>
    )
  }

  _renderDistributedOrders = () => {
    const { tab } = this.state
    const { invoiceeList } = this.props
    return invoiceeList.keySeq().toArray().map(paxId => {
      const invoicee = invoiceeList.get(paxId)
      const name = invoicee.get('name')
      const orders = invoicee.get('orders') || getMap({ home: getMap({}), out: getMap({}) })
      const participants = invoicee.get('participants') || getMap({})
      const extraOrders = invoicee.get('extraOrders') || getMap({})

      return (
        <View style={ss.bucket} key={paxId}>
          <View style={ss.header}>
            <Text style={ss.boldText}>{name}</Text>
          </View>
          <View style={ss.tab}>
            <OutHomeTab selected={tab} onPress={this._onTabSwitch} />
          </View>
          {this._renderMealsAndDrinks(orders, false, paxId)}
          <View style={ss.orders}>
            {this._renderExcursions(participants, false, paxId)}
          </View>
          <View style={ss.orders}>
            {this._renderExtraOrders(extraOrders, false, paxId)}
          </View>
        </View>
      )
    })
  }

  render () {
    return (
      <View>
        {this._renderBucket()}
        {this._renderDistributedOrders()}
      </View>
    )
  }
}

const stateToProps = (state, props) => {
  const { bookingId, departureId } = props
  return {
    participants: getParticipantsByBooking(state, departureId, bookingId),
    extraOrders: getExtraOrdersByBooking(state, departureId, bookingId),
    orders: getOrdersByBooking(state, departureId, bookingId),
    meals: getMeals(state),
    drinks: getDrinks(state),
    excursions: getExcursions(state),
    bucket: getBucket(state, departureId, bookingId),
    modifiedPax: getModifiedPax(state, departureId)
  }
}

export default connect(stateToProps, null)(DistributeOrders)

const ss = StyleSheet.create({
  bucket: {
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 10,
    padding: 5,
    paddingBottom: 10,
    alignItems: 'center'
  },
  header: {
    height: 30,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  tab: {
    marginBottom: 20
  },
  orders: {
    width: '100%'
  },
  itemCon: {
    alignItems: 'center',
    marginBottom: 5
  },
  drinksCon: {
    alignItems: 'center'
  },
  orderCon: {
    alignItems: 'center',
    marginTop: 25
  },
  sectionHeader: {
    height: 27,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 5
  },
  headerButton: {
    height: 27,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.blue,
    borderRadius: 4
  },
  buttonText: {
    color: Colors.white
  },
  boldText: {
    fontWeight: 'bold'
  },
  mealItems: {
    // marginTop: 5
  },
  orderItem: {
    width: '100%',
    minHeight: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    borderRadius: 5,
    backgroundColor: Colors.cloud,
    padding: 5
  },
  delete: {
    width: 40,
    height: 30,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  deleteButton: {
    width: 30,
    height: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cancel,
    borderRadius: 4
  },
  minus: {
    fontWeight: 'bold',
    fontSize: 20,
    color: Colors.white
  },
  itemName: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  itemCount: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemAmount: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
