
import React, { Component } from 'react'
import {
  View, ListItem, Left, Text, Right
} from 'native-base'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import MealsSelection from './mealsSelection'
import { getLunches, getOrder } from '../selectors'
import { getMap } from '../utils/immutable'
import { actionDispatcher } from '../utils/actionDispatcher'
import { takeOrderIndividualMode, resetPaxOrder } from '../modules/modifiedData/action'
import BeverageSelection from './beverageSelection'
import { Colors, IonIcon } from '../theme'
import Translator from '../utils/translator'
import CheckBox from './checkBox'
import { stringShorten } from '../utils/stringHelpers'

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

  get selected () {
    const { order, direction } = this.props
    return order.get(direction) ? order.get(direction) : getMap({})
  }

  _toggleChild = () => {
    this.setState({ child: !this.state.child })
  }

  _onMealSelect = item => {
    const { direction, pax, bookingId, departureId } = this.props
    const { child } = this.state
    const paxId = String(pax.get('id'))

    const o = getMap({
      drink: this.selected.get('drink') || null,
      meal: item.get('id'),
      pax: paxId,
      adult: !child
    })
    actionDispatcher(takeOrderIndividualMode({
      order: o, direction, bookingId, departureId, paxId
    }))
  }

  _onBeverageSelect = item => {
    const { direction, pax, bookingId, departureId } = this.props
    const { child } = this.state
    const paxId = String(pax.get('id'))

    const order = getMap({
      meal: this.selected.get('meal') || null,
      drink: item.get('id'),
      pax: paxId,
      adult: !child
    })
    actionDispatcher(takeOrderIndividualMode({
      order, direction, bookingId, departureId, paxId
    }))
  }

  _resetPaxOrders = () => {
    const { direction, pax, bookingId, departureId } = this.props
    const paxId = String(pax.get('id'))
    actionDispatcher(resetPaxOrder({
      direction, departureId, bookingId, paxId
    }))
  }

  render () {
    const { child } = this.state
    const { lunches, pax, direction } = this.props
    let paxName = `${pax.get('firstName')} ${pax.get('lastName')}`
    if (paxName.length > 17) {
      paxName = stringShorten(paxName, 17)
    }
    let meals = lunches.get(direction).get('meals')
    const beverages = lunches.get(direction).get('beverages')
    meals = child ? meals.filter(m => !!m.get('child')) : meals.filter(m => !!m.get('adult'))

    return (
      <View style={ss.orderItem}>

        <ListItem style={ss.header}>
          <Left style={ss.headerLeft}>
            <Text style={ss.boldText}>{paxName}</Text>
            <TouchableOpacity style={ss.reset} onPress={this._resetPaxOrders}>
              <IonIcon name='undo' size={22} />
            </TouchableOpacity>

          </Left>
          <Right style={ss.headerRight}>
            <TouchableOpacity style={ss.childCheck} onPress={this._toggleChild}>
              <Text style={ss.childText}>{_T('child')}</Text>
              <CheckBox checked={child} />
            </TouchableOpacity>
          </Right>
        </ListItem>

        <MealsSelection
          items={meals}
          label={_T('meals')}
          onSelect={this._onMealSelect}
          selected={this.selected}
          isChild={child}
        />

        {
          beverages &&
          <BeverageSelection
            items={beverages}
            label={_T('beverages')}
            onSelect={this._onBeverageSelect}
            selected={this.selected}
          />
        }

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
    flex: 3,
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
    paddingRight: 5
  },
  childText: {
    marginRight: 10,
    fontWeight: 'bold'
  },
  boldText: {
    fontWeight: 'bold'
  },
  reset: {
    marginHorizontal: 15
  }
})
