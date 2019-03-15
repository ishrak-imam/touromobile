
import React, { Component } from 'react'
import { View, Text, ListItem, Left, Right } from 'native-base'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { IonIcon, Colors } from '../theme'
import { connect } from 'react-redux'
import {
  getLunches, getOrderForBookingSummaryMode,
  getFormattedMealsData
} from '../selectors'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { actionDispatcher } from '../utils/actionDispatcher'
import { resetAllOrders } from '../modules/modifiedData/action'
import Translator from '../utils/translator'
import FoodItem from './foodItem'
import NoData from './noData'
import OutHomeTab from './outHomeTab'
import ExcursionOrderSummaryMode from './excursionOrderSummaryMode'
import ExtraOrderSummaryMode from './extraOrderSummaryMode'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import isIOS from '../utils/isIOS'
import isIphoneX from '../utils/isIphoneX'

import SelectInvoiceeSummaryMode from './selectInvoiceeSummaryMode'

const _T = Translator('OrdersScreen')

class SummaryOrderItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lunchOrders: false,
      excursionOrders: false,
      extraOrders: false,
      tab: 'out'
    }
  }

  _viewToggle = section => () => {
    this.setState({
      [section]: !this.state[section]
    })
  }

  _renderFoodItem = (mealType, paxCount, totalOrder) => {
    const direction = this.state.tab
    const { bookingId, departureId } = this.props
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
    const { tab } = this.state
    const { orderForBooking } = this.props
    let count = 0
    const meals = orderForBooking.getIn([tab, 'meal'])
    if (meals && meals.size > 0) {
      meals.every((meal) => {
        count = count + meal.get('adultCount') + meal.get('childCount')
        return true
      })
    }
    return count
  }

  get totalDrinkOrder () {
    const { tab } = this.state
    const { orderForBooking } = this.props
    let count = 0
    const drinks = orderForBooking.getIn([tab, 'drink'])
    if (drinks && drinks.size > 0) {
      drinks.every((drink) => {
        count = count + drink.get('count')
        return true
      })
    }
    return count
  }

  _renderMeals = (meals, paxCount) => {
    const formattedMeals = getFormattedMealsData(meals, _T('child'))
    return (
      <View style={ss.section}>
        <ListItem style={ss.header}>
          <View>
            <Text style={ss.boldText}>{_T('meals')}</Text>
          </View>
        </ListItem>
        {
          <ImmutableVirtualizedList
            immutableData={formattedMeals}
            renderItem={this._renderFoodItem('meal', paxCount, this.totalMealOrder)}
            keyExtractor={item => `${item.get('id')}${item.get('adult') || item.get('child')}`}
            renderEmpty={_T('noMealData')}
          />
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

  _resetOrders = (departureId, bookingId) => {
    return () => {
      actionDispatcher(resetAllOrders({
        key: 'ordersSummaryMode', departureId, bookingId
      }))
    }
  }

  _onTabSwitch = tab => {
    return () => {
      this.setState({ tab })
    }
  }

  _renderLunchOrders = () => {
    const { lunchOrders, tab } = this.state
    const { pax, lunches, departureId, bookingId } = this.props
    const meals = lunches.getIn([tab, 'meals'])
    const beverages = lunches.getIn([tab, 'beverages'])
    const icon = lunchOrders ? 'minus' : 'plus'

    return (
      <View>
        <ListItem style={ss.topHeader} onPress={this._viewToggle('lunchOrders')}>
          <Left style={ss.headerLeft}>
            <View style={ss.sectionIcon}>
              <IonIcon name={icon} size={22} />
            </View>
            <Text style={ss.headerText}>{_T('lunchOrders')}</Text>
            {
              lunchOrders &&
              <TouchableOpacity style={ss.reset} onPress={this._resetOrders(departureId, bookingId)}>
                <IonIcon name='undo' size={22} />
              </TouchableOpacity>
            }
          </Left>
          <Right style={ss.headerRight} />
        </ListItem>
        {
          lunchOrders &&
          <View>
            <View style={ss.tabContainer}>
              <OutHomeTab selected={tab} onPress={this._onTabSwitch} />
            </View>
            {this._renderMeals(meals, pax.size)}
            {beverages && this._renderBeverages(beverages, pax.size)}
          </View>
        }
      </View>
    )
  }

  _renderExcursionOrders = () => {
    const { excursionOrders } = this.state
    const { pax, departureId, bookingId } = this.props
    const icon = excursionOrders ? 'minus' : 'plus'
    return (
      <View>
        <ListItem style={ss.topHeader} onPress={this._viewToggle('excursionOrders')}>
          <Left style={ss.headerLeft}>
            <View style={ss.sectionIcon}>
              <IonIcon name={icon} size={22} />
            </View>
            <Text style={ss.headerText}>{_T('excursionOrders')}</Text>
          </Left>
          <Right style={ss.headerRight} />
        </ListItem>
        {
          excursionOrders &&
          <ExcursionOrderSummaryMode
            pax={pax}
            departureId={departureId}
            bookingId={bookingId}
          />
        }
      </View>
    )
  }

  _renderExtraOrders = () => {
    const { departureId, bookingId } = this.props
    const { extraOrders } = this.state
    const icon = extraOrders ? 'minus' : 'plus'
    return (
      <View>
        <ListItem style={ss.topHeader} onPress={this._viewToggle('extraOrders')}>
          <Left style={ss.headerLeft}>
            <View style={ss.sectionIcon}>
              <IonIcon name={icon} size={22} />
            </View>
            <Text style={ss.headerText}>{_T('extraOrders')}</Text>
          </Left>
          <Right style={ss.headerRight} />
        </ListItem>
        {
          extraOrders &&
          <ExtraOrderSummaryMode
            departureId={departureId}
            bookingId={bookingId}
          />
        }
      </View>
    )
  }

  render () {
    const { booking, bookingId, pax, screen, departureId } = this.props
    const direction = this.state.tab

    return (
      <View style={ss.container}>

        {
          screen === 'booking' &&
          <SelectInvoiceeSummaryMode
            booking={booking}
            pax={pax}
            direction={direction}
            bookingId={bookingId}
            departureId={departureId}
          />
        }

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={ss.scroll}
          extraScrollHeight={isIOS ? 40 : 200}
          enableOnAndroid
          keyboardShouldPersistTaps='always'
        >
          {this._renderLunchOrders()}
          {this._renderExcursionOrders()}
          {this._renderExtraOrders()}

        </KeyboardAwareScrollView>

      </View>
    )
  }
}

const stateToProps = (state, props) => {
  const { departureId, bookingId } = props
  return {
    lunches: getLunches(state),
    orderForBooking: getOrderForBookingSummaryMode(state, departureId, bookingId)
  }
}

export default connect(stateToProps, null)(SummaryOrderItem)

const ss = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 15
  },
  boldText: {
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 20
  },
  header: {
    paddingBottom: 5,
    marginLeft: 0,
    borderBottomWidth: 0
  },
  scroll: {
    marginTop: 5,
    marginBottom: isIphoneX ? 30 : 20
  },
  topHeader: {
    marginLeft: 0,
    paddingBottom: 5,
    borderBottomColor: Colors.steel,
    borderBottomWidth: 0,
    paddingRight: 0,
    marginBottom: 10
  },
  headerLeft: {
    flex: 3
  },
  headerRight: {
    flex: 2
  },
  headerText: {
    fontWeight: 'bold',
    marginBottom: 3
  },
  reset: {
    paddingHorizontal: 20
  },
  sectionIcon: {
    marginRight: 5
  },
  tabContainer: {
    width: '100%',
    marginTop: 5
  }
})
