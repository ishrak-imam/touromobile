
import React, { Component } from 'react'
import {
  View, Text, ListItem, Right, Left
} from 'native-base'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Colors } from '../theme'
import { getOrderSummaryMode } from '../selectors'
import { actionDispatcher } from '../utils/actionDispatcher'
import { takeOrderSummaryMode, takeAllergyOrderSummaryMode } from '../modules/modifiedData/action'
import { getMap } from '../utils/immutable'

class FoodItem extends Component {
  // shouldComponentUpdate (nextProps) {
  //   return !nextProps.order.equals(this.props.order)
  // }

  _onFoodSelect = sign => {
    const { departureId, bookingId, meal, mealType, paxCount } = this.props

    return () => {
      let newOrder = null
      const { direction, totalOrder, order } = this.props
      const mealId = String(meal.get('id'))

      if (mealType === 'meal') {
        const isAdult = meal.get('adult')
        const isChild = meal.get('child')
        let adultCount = order.get('adultCount') || 0
        let childCount = order.get('childCount') || 0

        /**
         * Allergy
         */
        if (meal.get('type') === 'allergy') {
          const allergyId = meal.get('allergyId')
          const allergies = order.get('allergies')
          const allergyOrder = allergies.get(allergyId)

          adultCount = allergyOrder.get('adultCount') || 0
          childCount = allergyOrder.get('childCount') || 0
        }

        if (sign === 'minus' && isAdult && adultCount === 0) return null
        if (sign === 'minus' && isChild && childCount === 0) return null

        if (sign === 'plus' && totalOrder === paxCount) return null
        if (sign === 'plus' && (adultCount >= paxCount || childCount >= paxCount)) return null

        if (sign === 'minus' && isAdult && adultCount !== 0) adultCount--
        if (sign === 'minus' && isChild && childCount !== 0) childCount--

        if (sign === 'plus' && isAdult) adultCount++
        if (sign === 'plus' && isChild) childCount++

        /**
         * Allergy
         */
        if (meal.get('type') === 'allergy') {
          const allergyId = meal.get('allergyId')
          const allergyOrder = getMap({
            allergyId,
            adultCount,
            childCount
          })
          actionDispatcher(takeAllergyOrderSummaryMode({
            departureId, bookingId, direction, mealId, allergyId, allergyOrder
          }))
          return
        }

        newOrder = {
          [`${mealType}Id`]: mealId,
          adultCount,
          childCount
        }
      }

      if (mealType === 'drink') {
        const oldCount = order.get('count') || 0
        let newCount = 0

        if (sign === 'minus' && oldCount === 0) return null
        if (sign === 'plus' && totalOrder === paxCount) return null
        if (sign === 'plus' && oldCount >= paxCount) return null

        if (sign === 'minus' && oldCount !== 0) newCount = oldCount - 1
        if (sign === 'plus') newCount = oldCount + 1

        newOrder = {
          [`${mealType}Id`]: mealId,
          count: newCount,
          isChild: !meal.get('adult') && (mealType === 'meal')
        }
      }

      actionDispatcher(takeOrderSummaryMode({
        departureId, bookingId, direction, mealType, mealId, order: getMap(newOrder)
      }))
    }
  }

  _toAllergySelection = meal => () => {
    const { navigation, brand, direction, bookingId, departureId } = this.props
    let { order } = this.props
    const mealId = String(meal.get('id'))
    if (!order.size) {
      order = order.set('mealId', mealId).set('adultCount', 0).set('childCount', 0)
      actionDispatcher(takeOrderSummaryMode({
        departureId, bookingId, direction, mealType: 'meal', mealId, order
      }))
    }
    navigation.navigate('Allergy', { meal, brand, direction, bookingId, departureId })
  }

  render () {
    const { meal, order, mealType } = this.props
    let count = 0
    if (mealType === 'meal') {
      const isAdult = meal.get('adult')
      count = isAdult ? order.get('adultCount') || 0 : order.get('childCount') || 0

      /**
       * Allergy
       */
      if (meal.get('type') === 'allergy') {
        const allergyId = meal.get('allergyId')
        const allergies = order.get('allergies')
        const allergyOrder = allergies.get(allergyId)

        count = isAdult ? allergyOrder.get('adultCount') || 0 : allergyOrder.get('childCount') || 0
      }
    }
    if (mealType === 'drink') count = order.get('count') || 0

    const mealName = meal.get('name')

    return (
      <ListItem style={ss.item}>
        <Left style={ss.itemLeft}>
          <Text>{mealName}</Text>
        </Left>
        <Right style={ss.itemRight}>
          <TouchableOpacity style={ss.minus} onPress={this._onFoodSelect('minus')}>
            <Text style={ss.sign}>-</Text>
          </TouchableOpacity>
          <View style={ss.counter}>
            <Text style={ss.count}>{count}</Text>
          </View>
          <TouchableOpacity style={ss.plus} onPress={this._onFoodSelect('plus')}>
            <Text style={ss.sign}>+</Text>
          </TouchableOpacity>
          {
            meal.get('type') === 'regular'
              ? <TouchableOpacity style={ss.allergy} onPress={this._toAllergySelection(meal)}>
                <Text style={ss.sign}>+</Text>
              </TouchableOpacity>
              : <View style={ss.empty} />
          }
        </Right>
      </ListItem>
    )
  }
}

const stateToProps = (state, props) => {
  const { meal, direction, bookingId, departureId, mealType } = props
  const mealId = String(meal.get('id'))
  return {
    order: getOrderSummaryMode(state, departureId, bookingId, direction, mealType, mealId)
  }
}

export default connect(stateToProps, null)(FoodItem)

const ss = StyleSheet.create({
  item: {
    paddingBottom: 5,
    paddingRight: 0,
    marginLeft: 0,
    borderBottomWidth: 0
  },
  itemLeft: {
    flex: 1.5
  },
  itemRight: {
    flex: 1,
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
  allergy: {
    height: 30,
    width: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bloodOrange,
    borderRadius: 15,
    marginLeft: 10
  },
  empty: {
    height: 30,
    width: 35
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
  }
})
