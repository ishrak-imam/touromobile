
import React, { Component } from 'react'
import { View, Text, ListItem } from 'native-base'
import { TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { IonIcon, Colors } from '../theme'
import { connect } from 'react-redux'
import {
  getLunches, getInvoiceeSummaryMode,
  getOrderForBookingSummaryMode
} from '../selectors'
import isIphoneX from '../utils/isIphoneX'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { actionDispatcher } from '../utils/actionDispatcher'
import { showModal } from '../modal/action'
import { getMap, getList } from '../utils/immutable'
import { selectInvoiceeSummaryMode } from '../modules/modifiedData/action'
import Translator from '../utils/translator'
import FoodItem from './foodItem'
import NoData from './noData'

const _T = Translator('OrdersScreen')

class SummaryOrderItem extends Component {
  componentDidMount () {
    const { pax } = this.props
    this._prefillInvoicee(pax)
  }

  _prefillInvoicee = pax => {
    if (pax.size === 1) {
      const selection = {
        key: String(pax.get(0).get('id')),
        value: `${pax.get(0).get('firstName')} ${pax.get(0).get('lastName')}`
      }
      this._selectInvoicee(selection)
    }
  }

  _onSelectInvoicee = selection => {
    this._selectInvoicee(selection.value)
  }

  _selectInvoicee = invoicee => {
    const { departureId, bookingId } = this.props
    actionDispatcher(selectInvoiceeSummaryMode({
      departureId,
      bookingId,
      invoicee
    }))
  }

  _showSelections = options => {
    return () => {
      actionDispatcher(showModal({
        type: 'selection',
        options,
        onSelect: this._onSelectInvoicee
      }))
    }
  }

  _renderInvoiceeSelection = (options, selected) => {
    const paxName = selected ? selected.get('value') : _T('selectInvoicee')
    return (
      <View style={ss.combo}>
        <View style={ss.comboText}>
          <Text style={ss.comboLabel}>{_T('invoicee')}:</Text>
        </View>
        <View style={ss.selector}>
          <View style={ss.selectorBox}>
            <Text numberOfLines={1} style={ss.selectorText}>{paxName}</Text>
          </View>
          <TouchableOpacity style={ss.dropDown} onPress={this._showSelections(options)} >
            <IonIcon name='down' color={Colors.silver} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _renderFoodItem = (mealType, paxCount, totalOrder) => {
    const { direction, bookingId, departureId } = this.props
    return ({ item }) => {
      return (
        <FoodItem
          meal={item}
          direction={direction}
          bookingId={bookingId}
          departureId={departureId}
          mealType={mealType}
          paxCount={paxCount}
          totalOrder={totalOrder}
        />
      )
    }
  }

  get totalMealOrder () {
    const { orderForBooking } = this.props
    let count = 0
    const meals = orderForBooking.get('meal')
    if (meals && meals.size > 0) {
      meals.every((meal) => {
        count = count + meal.get('adultCount') + meal.get('childCount')
        return true
      })
    }
    return count
  }

  get totalDrinkOrder () {
    const { orderForBooking } = this.props
    let count = 0
    const drinks = orderForBooking.get('drink')
    if (drinks && drinks.size > 0) {
      drinks.every((drink) => {
        count = count + drink.get('count')
        return true
      })
    }
    return count
  }

  /**
   * TODO:
   * Try to cache this function result
   */
  _formatMeals = meals => {
    return meals.reduce((list, meal) => {
      if (meal.get('child') && meal.get('adult')) {
        list = list
          .push(meal.set('child', null))
          .push(meal.set('name', `(${_T('child')}) ${meal.get('name')}`).set('adult', null))
      }
      if (meal.get('child') && !meal.get('adult')) {
        list = list.push(meal.set('name', `(${_T('child')}) ${meal.get('name')}`))
      }
      if (!meal.get('child') && meal.get('adult')) {
        list = list.push(meal)
      }
      return list
    }, getList([]))
  }

  _renderMeals = (meals, paxCount) => {
    const formattedMeals = this._formatMeals(meals)
    return (
      <View style={ss.section}>
        <ListItem style={ss.header}>
          <View>
            <Text style={ss.boldText}>{_T('meals')}</Text>
          </View>
        </ListItem>
        {
          formattedMeals.size
            ? <ImmutableVirtualizedList
              immutableData={formattedMeals}
              renderItem={this._renderFoodItem('meal', paxCount, this.totalMealOrder)}
              keyExtractor={item => `${item.get('id')}${item.get('adult') || item.get('child')}`}
            />
            : <NoData text='noMealData' textStyle={{ marginTop: 30 }} />
        }
      </View>
    )
  }

  _renderBeverages = (beverages, paxCount) => {
    return (
      <View style={ss.section}>
        <ListItem style={ss.header}>
          <View>
            <Text style={ss.boldText}>{_T('beverages')}</Text>
          </View>
        </ListItem>
        {
          beverages.size
            ? <ImmutableVirtualizedList
              immutableData={beverages}
              renderItem={this._renderFoodItem('drink', paxCount, this.totalDrinkOrder)}
              keyExtractor={item => String(item.get('id'))}
            />
            : <NoData text='noBeverageData' textStyle={{ marginTop: 30 }} />
        }
      </View>
    )
  }

  _getInvoiceeOptions = (pax, direction, selected) => {
    const config = {
      label: _T('invoiceeSelection'),
      key: 'invoicee',
      direction
    }
    const items = pax.map(p => (getMap({
      key: String(p.get('id')),
      value: `${p.get('firstName')} ${p.get('lastName')}`
    })))

    return {
      config, items, selected
    }
  }

  render () {
    const { pax, lunches, direction, invoicee, screen } = this.props
    const meals = lunches.get(direction).get('meals')
    const beverages = lunches.get(direction).get('beverages')

    return (
      <View style={ss.container}>
        {
          screen === 'booking' &&
          this._renderInvoiceeSelection(this._getInvoiceeOptions(pax, direction, invoicee), invoicee)
        }
        <ScrollView style={ss.scroll} showsVerticalScrollIndicator={false}>
          {this._renderMeals(meals, pax.size)}
          {beverages && this._renderBeverages(beverages, pax.size)}
        </ScrollView>
      </View>
    )
  }
}

const stateToProps = (state, props) => {
  const { departureId, bookingId, direction } = props
  return {
    invoicee: getInvoiceeSummaryMode(state, departureId, bookingId),
    lunches: getLunches(state),
    orderForBooking: getOrderForBookingSummaryMode(state, departureId, bookingId, direction)
  }
}

export default connect(stateToProps, null)(SummaryOrderItem)

const ss = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 15
  },
  selector: {
    height: 30,
    flex: 1.7,
    flexDirection: 'row',
    backgroundColor: Colors.silver,
    borderRadius: 3
  },
  selectorBox: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRightWidth: 0,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderColor: Colors.charcoal
  },
  selectorText: {
    fontSize: 14
  },
  dropDown: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: Colors.blue
  },
  combo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10
  },
  comboLabel: {
    fontWeight: 'bold'
  },
  comboText: {
    flex: 1.5,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center'
  },
  boldText: {
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 20
  },
  header: {
    paddingBottom: 5,
    marginLeft: 0
  },
  scroll: {
    marginBottom: isIphoneX ? 20 : 10
  }
})
