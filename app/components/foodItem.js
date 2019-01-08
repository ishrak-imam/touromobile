
import React, { Component } from 'react'
import {
  View, Text, ListItem, Right, Left
} from 'native-base'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { Colors } from '../theme'
import { getOrderSummaryMode } from '../selectors'
import { actionDispatcher } from '../utils/actionDispatcher'
import { takeOrderSummaryMode } from '../modules/modifiedData/action'

class FoodItem extends Component {
  _onFoodSelect = sign => {
    const { departureId, bookingId, direction, meal, order, mealType, paxCount } = this.props
    return () => {
      const mealId = String(meal.get('id'))
      const oldCount = order.get('count') || 0
      let newCount = 0

      if (sign === 'minus' && oldCount === 0) return null
      if (sign === 'plus' && oldCount >= paxCount) return null

      if (sign === 'minus' && oldCount !== 0) newCount = oldCount - 1
      if (sign === 'plus') newCount = oldCount + 1

      const newOrder = {
        [`${mealType}Id`]: mealId,
        count: newCount,
        isChild: !!meal.get('adult')
      }

      actionDispatcher(takeOrderSummaryMode({
        departureId, bookingId, direction, mealType, mealId, order: newOrder
      }))
    }
  }

  render () {
    const { meal, order } = this.props
    const count = order.get('count') || 0
    return (
      <ListItem style={ss.item}>
        <Left style={ss.itemLeft}>
          <Text>{meal.get('name')}</Text>
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
    justifyContent: 'space-around'
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
    width: 35,
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
