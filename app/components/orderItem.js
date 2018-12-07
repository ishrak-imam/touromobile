
import React, { Component } from 'react'
import {
  View, ListItem, Left, Text,
  Right, CheckBox
} from 'native-base'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import MealsSelection from './mealsSelection'
import { getLunches, getOrder } from '../selectors'
import { getMap } from '../utils/immutable'
import { actionDispatcher } from '../utils/actionDispatcher'
import { takeOrder } from '../modules/modifiedData/action'
import BeverageSelection from './beverageSelection'
import { Colors } from '../theme'
import Translator from '../utils/translator'

const _T = Translator('OrdersScreen')

class OrderItem extends Component {
  constructor (props) {
    super(props)

    let child = false
    const { order, direction } = props

    /**
     * for UI consistency. If any child order is selected in
     * earlier iteration then child will be checked automatically
     */
    if (order.get(direction)) child = !order.get(direction).get('adult')

    this.state = { child }
  }

  _toggleChild = () => {
    this.setState({ child: !this.state.child })
  }

  _onMealSelect = item => {
    const { direction, pax, bookingId, departureId } = this.props
    const { child } = this.state
    const paxId = String(pax.get('id'))

    const order = getMap({
      meal: item.get('id'),
      pax: paxId,
      adult: !child
    })
    actionDispatcher(takeOrder({
      order, direction, bookingId, departureId, paxId
    }))
  }

  _onBeverageSelect = item => {
    const { direction, pax, bookingId, departureId } = this.props
    const { child } = this.state
    const paxId = String(pax.get('id'))

    const order = getMap({
      drink: item.get('id'),
      pax: paxId,
      adult: !child
    })
    actionDispatcher(takeOrder({
      order, direction, bookingId, departureId, paxId
    }))
  }

  render () {
    const { child } = this.state
    const { lunches, pax, order, direction } = this.props
    const paxName = `${pax.get('firstName')} ${pax.get('lastName')}`
    const meals = lunches.get(direction).get('meals')
    const childMeals = meals.filter(m => child && !!m.get('child'))
    const adultMeals = meals.filter(m => !!m.get('adult'))

    const selected = order.get(direction) ? order.get(direction) : getMap({})

    return (
      <View style={ss.orderItem}>

        <ListItem style={ss.header}>
          <Left style={ss.headerLeft}>
            <Text style={ss.boldText}>{paxName}</Text>
          </Left>
          <Right style={ss.headerRight}>
            <TouchableOpacity style={ss.childCheck} onPress={this._toggleChild}>
              <Text style={ss.boldText}>{_T('child')}</Text>
              <CheckBox disabled checked={child} />
            </TouchableOpacity>
          </Right>
        </ListItem>

        {
          child &&
          <MealsSelection
            items={childMeals}
            label={_T('meals')}
            onSelect={this._onMealSelect}
            selected={selected}
          />
        }

        {
          !child &&
          <MealsSelection
            items={adultMeals}
            label={_T('meals')}
            onSelect={this._onMealSelect}
            selected={selected}
          />
        }

        <BeverageSelection
          onSelect={this._onBeverageSelect}
          selected={selected}
          label={_T('beverages')}
        />

      </View>
    )
  }
}

const stateToProps = (state, props) => {
  const { departureId, bookingId, pax } = props
  const paxId = String(pax.get('id'))

  return {
    lunches: getLunches(state),
    order: getOrder(state, departureId, bookingId, paxId)
  }
}

export default connect(stateToProps, null)(OrderItem)

const ss = StyleSheet.create({
  orderItem: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.steel
  },
  header: {
    paddingBottom: 10,
    borderBottomWidth: 0,
    marginLeft: 0,
    paddingRight: 0
  },
  headerLeft: {
    flex: 4,
    alignItems: 'center'
  },
  headerRight: {
    flex: 1.5
  },
  childCheck: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 15
  },
  boldText: {
    fontWeight: 'bold'
  }
})
