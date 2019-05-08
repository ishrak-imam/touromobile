
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
  getDrinks, getBucket
} from '../selectors'
import { actionDispatcher } from '../utils/actionDispatcher'
import { setOrderBucket, setInvoiceeList } from '../modules/modifiedData/action'
import { getMap, getList, listToMap } from '../utils/immutable'
import { Colors } from '../theme'
import OutHomeTab from '../components/outHomeTab'
import { showModal } from '../modal/action'
import _T from '../utils/translator'

class DistributeOrders extends Component {
  constructor (props) {
    super(props)
    let {
      participants, extraOrders, orders,
      bookingId, departureId
    } = props

    participants = this._flattenParticipants(participants)

    actionDispatcher(setOrderBucket({
      bookingId,
      departureId,
      bucket: getMap({
        participants, extraOrders, orders
      })
    }))

    this.state = {
      tab: 'out'
    }
  }

  _onModalSave = invoiceeList => {
    const { bookingId, departureId } = this.props
    actionDispatcher(setInvoiceeList({
      bookingId,
      departureId,
      invoiceeList
    }))
  }

  _onModalCancel = () => {
    console.log('Distribution modal canceled')
  }

  _prepareMealData = (orders, bucket, storage) => {
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
              name: `${storage.getIn([mealId, 'name'])} (${allergyText})`,
              type: 'allergy',
              count: childCount,
              allergyId,
              allergyText,
              adult: null,
              child: meal.get('child')
            })
          }
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
        if (mealOrders) out.meals = this._prepareMealData(mealOrders, out.meals, outMeals)
        if (drinkOrders) out.drinks = this._prepareDrinkData(drinkOrders, out.drinks, outDrinks)
        aggregated.out = out
      }

      if (homeOrders && homeOrders.size) {
        const home = { meals: [], drinks: [] }
        const mealOrders = homeOrders.get('meal')
        const drinkOrders = homeOrders.get('drink')
        if (mealOrders) home.meals = this._prepareMealData(mealOrders, home.meals, homeMeals)
        if (drinkOrders) home.drinks = this._prepareDrinkData(drinkOrders, home.drinks, homeDrinks)
        aggregated.home = home
      }
    }

    return aggregated
  }

  _flattenParticipants = participants => {
    let flattenedList = getMap({})
    if (participants) {
      let { excursions } = this.props
      excursions = listToMap(excursions, 'id')
      return participants.reduce((map, par, id) => {
        const excursion = excursions.get(id)
        map = map.set(id, getMap({
          id,
          name: excursion.get('name'),
          count: par.size
        }))
        return map
      }, flattenedList)
    }

    return flattenedList
  }

  _onPressMeal = meal => () => {
    const { tab } = this.state
    const { invoiceeList } = this.props
    actionDispatcher(showModal({
      type: 'distribution',
      data: {
        meal,
        invoiceeList,
        direction: tab,
        mealType: 'meal',
        orderType: 'orders'
      },
      config: { label: meal.name, instruction: _T('distributionInstruction') },
      onSave: this._onModalSave,
      onCancel: this._onModalCancel
    }))
  }

  _onPressDrink = drink => () => {
    const { tab } = this.state
    const { invoiceeList } = this.props
    actionDispatcher(showModal({
      type: 'distribution',
      data: {
        drink,
        invoiceeList,
        direction: tab,
        mealType: 'drink',
        orderType: 'orders'
      },
      config: { label: drink.name, instruction: _T('distributionInstruction') },
      onSave: this._onModalSave,
      onCancel: this._onModalCancel
    }))
  }

  _onPressExcursion = excursion => () => {
    const { invoiceeList } = this.props
    actionDispatcher(showModal({
      type: 'distribution',
      data: {
        excursion,
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

  _renderMeals = (meals, renderButtons) => {
    return (
      <View style={ss.itemCon}>
        <View style={ss.sectionHeader}>
          <Text style={ss.boldText}>Meals</Text>
          {renderButtons &&
          <TouchableOpacity style={ss.headerButton}>
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
                onPress={onPress}
                style={ss.orderItem}
                key={`${mealId} - ${index}`}
              >
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

  _renderDrinks = (drinks, renderButtons) => {
    return (
      <View style={ss.drinksCon}>
        {/* <Text style={ss.boldText}>Drinks</Text> */}
        <View style={ss.mealItems}>
          {drinks.map((drink, index) => {
            const drinkId = drink.drinkId
            let onPress = this._onPressDrink(drink)
            if (!renderButtons) onPress = () => {}
            return (
              <TouchableOpacity
                onPress={onPress}
                style={ss.orderItem} key={`${drinkId} - ${index}`}
              >
                <View style={ss.itemName}>
                  <Text>{drink.name}</Text>
                </View>
                <View style={ss.itemCount}>
                  <Text>{drink.count}</Text>
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </View>
    )
  }

  _renderMealsAndDrinks = (orders, renderButtons) => {
    const { tab } = this.state
    const flatOrders = this._flattenMealsAndDrinks(orders)
    const { meals, drinks } = flatOrders[tab]

    return (
      <View style={ss.orders}>
        {this._renderMeals(meals, renderButtons)}
        {/* {this._renderDrinks(drinks, renderButtons)} */}
      </View>
    )
  }

  _renderExcursions = (participants, renderButtons) => {
    return (
      <View style={ss.orderCon}>
        <View style={ss.sectionHeader}>
          <Text style={ss.boldText}>Excursions</Text>
          {renderButtons &&
          <TouchableOpacity style={ss.headerButton}>
            <Text style={ss.buttonText}>Distribute all</Text>
          </TouchableOpacity>}
        </View>
        <View style={ss.mealItems}>
          {participants.keySeq().toArray().map(excursionId => {
            const excursion = participants.get(excursionId) || getMap({})
            let onPress = this._onPressExcursion(excursion)
            if (!renderButtons) onPress = () => {}
            return (
              <TouchableOpacity
                onPress={onPress}
                style={ss.orderItem}
                key={excursion.get('id')}
              >
                <View style={ss.itemName}>
                  <Text>{excursion.get('name')}</Text>
                </View>
                <View style={ss.itemCount}>
                  <Text>{excursion.get('count')}</Text>
                </View>
              </TouchableOpacity>
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

  _onSelectBooking = order => ({ value }) => {
    const orderId = order.get('id')
    const paxId = value.key
    let { invoiceeList } = this.props
    let invoicee = invoiceeList.get(paxId)
    let extraOrders = invoicee.get('extraOrders') || getMap({})
    extraOrders = extraOrders.set(orderId, order)
    invoicee = invoicee.set('extraOrders', extraOrders)
    invoiceeList = invoiceeList.set(paxId, invoicee)
    this._onModalSave(invoiceeList)
  }

  _onPressExtraOrder = order => () => {
    actionDispatcher(showModal({
      type: 'selection',
      options: this._getSelectionOptions(),
      onSelect: this._onSelectBooking(order)
    }))
  }

  _renderExtraOrders = (extraOrders, renderButtons) => {
    return (
      <View style={ss.orderCon}>
        <View style={ss.sectionHeader}>
          <Text style={ss.boldText}>Extra orders</Text>
          {renderButtons &&
          <TouchableOpacity style={ss.headerButton}>
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
    const participants = bucket.get('participants') || getList([])
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
          {this._renderMealsAndDrinks(orders, false)}
          <View style={ss.orders}>
            {this._renderExcursions(participants, false)}
          </View>
          <View style={ss.orders}>
            {this._renderExtraOrders(extraOrders, false)}
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
    bucket: getBucket(state, departureId, bookingId)
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
