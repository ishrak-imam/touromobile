
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
  getDrinks
} from '../selectors'
import { actionDispatcher } from '../utils/actionDispatcher'
import { setOrderBucket } from '../modules/modifiedData/action'
import { getMap, listToMap } from '../utils/immutable'
import { Colors } from '../theme'
import OutHomeTab from '../components/outHomeTab'
import { showModal } from '../modal/action'
import _T from '../utils/translator'

class DistributeOrders extends Component {
  constructor (props) {
    super(props)
    const {
      participants, extraOrders, invoiceeList,
      orders, bookingId, departureId
    } = props

    actionDispatcher(setOrderBucket({
      bookingId,
      departureId,
      bucket: getMap({
        participants, extraOrders, orders
      })
    }))

    this.state = {
      tab: 'out',
      invoiceeList
    }
  }

  _onModalSave = invoiceeList => {
    console.log(invoiceeList.toJS())
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
    const flattenedList = []
    if (participants) {
      let { excursions } = this.props
      excursions = listToMap(excursions, 'id')
      return participants.reduce((list, par, id) => {
        const excursion = excursions.get(id)
        const paxCount = par.size
        list.push({
          id,
          name: excursion.get('name'),
          paxCount
        })
        return list
      }, flattenedList)
    }

    return flattenedList
  }

  _onPressMeal = meal => () => {
    const { invoiceeList, tab } = this.state
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

  _renderMeals = meals => {
    return (
      <View style={ss.itemCon}>
        <View style={ss.sectionHeader}>
          <Text style={ss.boldText}>Meals</Text>
          {/* <TouchableOpacity style={ss.headerButton}>
            <Text style={ss.buttonText}>Distribute all</Text>
          </TouchableOpacity> */}
        </View>
        <View style={ss.mealItems}>
          {meals.map((meal, index) => {
            const mealId = meal.mealId
            return (
              <TouchableOpacity
                onPress={this._onPressMeal(meal)}
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

  _renderDrinks = drinks => {
    return (
      <View style={ss.drinksCon}>
        {/* <Text style={ss.boldText}>Drinks</Text> */}
        <View style={ss.mealItems}>
          {drinks.map((drink, index) => {
            const drinkId = drink.drinkId
            return (
              <TouchableOpacity
                onPress={() => {}}
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

  _renderMealsAndDrinks = orders => {
    const { tab } = this.state
    const flatOrders = this._flattenMealsAndDrinks(orders)
    const { meals, drinks } = flatOrders[tab]

    return (
      <View style={ss.orders}>
        {this._renderMeals(meals)}
        {this._renderDrinks(drinks)}
      </View>
    )
  }

  _renderExcursions = participants => {
    const excursions = this._flattenParticipants(participants)
    return (
      <View style={ss.orderCon}>
        <View style={ss.sectionHeader}>
          <Text style={ss.boldText}>Excursions</Text>
          <TouchableOpacity style={ss.headerButton}>
            <Text style={ss.buttonText}>Distribute all</Text>
          </TouchableOpacity>
        </View>
        <View style={ss.mealItems}>
          {excursions.map(excursion => {
            return (
              excursion.paxCount
                ? <TouchableOpacity
                  onPress={() => {}}
                  style={ss.orderItem}
                  key={excursion.id}
                >
                  <View style={ss.itemName}>
                    <Text>{excursion.name}</Text>
                  </View>
                  <View style={ss.itemCount}>
                    <Text>{excursion.paxCount}</Text>
                  </View>
                </TouchableOpacity>
                : null
            )
          })}
        </View>
      </View>
    )
  }

  _renderExtraOrders = extraOrders => {
    return (
      <View style={ss.orderCon}>
        <View style={ss.sectionHeader}>
          <Text style={ss.boldText}>Extra orders</Text>
          <TouchableOpacity style={ss.headerButton}>
            <Text style={ss.buttonText}>Distribute all</Text>
          </TouchableOpacity>
        </View>
        <View style={ss.mealItems}>
          {extraOrders.keySeq().toArray().map(orderId => {
            const order = extraOrders.get(orderId)
            return (
              <TouchableOpacity
                onPress={() => {}}
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
    const { orders, participants, extraOrders } = this.props
    const { tab } = this.state

    return (
      <View style={ss.bucket}>
        <View style={ss.tab}>
          <OutHomeTab selected={tab} onPress={this._onTabSwitch} />
        </View>
        {this._renderMealsAndDrinks(orders)}
        <View style={ss.orders}>
          {this._renderExcursions(participants)}
        </View>
        <View style={ss.orders}>
          {this._renderExtraOrders(extraOrders)}
        </View>
      </View>
    )
  }

  _renderDistributedOrders = () => {
    const { invoiceeList, tab } = this.state
    return invoiceeList.keySeq().toArray().map(paxId => {
      const invoicee = invoiceeList.get(paxId)
      const name = invoicee.get('name')
      const orders = invoicee.get('orders') || getMap({ home: getMap({}), out: getMap({}) })
      const participants = invoicee.get('participants')
      const extraOrders = invoicee.get('extraOrders') || getMap({})

      return (
        <View style={ss.bucket} key={paxId}>
          <View style={ss.header}>
            <Text style={ss.boldText}>{name}</Text>
          </View>
          <View style={ss.tab}>
            <OutHomeTab selected={tab} onPress={this._onTabSwitch} />
          </View>
          {this._renderMealsAndDrinks(orders)}
          <View style={ss.orders}>
            {this._renderExcursions(participants)}
          </View>
          <View style={ss.orders}>
            {this._renderExtraOrders(extraOrders)}
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
    excursions: getExcursions(state)
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
