
import React, { Component } from 'react'
import { View, Text, ListItem, Left, Right } from 'native-base'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { IonIcon, Colors } from '../theme'
import { connect } from 'react-redux'
import {
  getLunches, getInvoiceeSummaryMode,
  getOrderForBookingSummaryMode, getFormattedMealsData
} from '../selectors'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { actionDispatcher } from '../utils/actionDispatcher'
import { showModal } from '../modal/action'
import { getMap } from '../utils/immutable'
import { selectInvoiceeSummaryMode, resetAllOrders } from '../modules/modifiedData/action'
import Translator from '../utils/translator'
import FoodItem from './foodItem'
import NoData from './noData'
import OutHomeTab from './outHomeTab'
import ExcursionOrderSummaryMode from './excursionOrderSummaryMode'
import ExtraOrderSummaryMode from './extraOrderSummaryMode'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import isIOS from '../utils/isIOS'
import isIphoneX from '../utils/isIphoneX'

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
    const { pax, invoicee, screen } = this.props
    const direction = this.state.tab

    return (
      <View style={ss.container}>

        {
          screen === 'booking' &&
          this._renderInvoiceeSelection(this._getInvoiceeOptions(pax, direction, invoicee), invoicee)
        }

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          style={ss.scroll}
          extraScrollHeight={isIOS ? 40 : 150}
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
    invoicee: getInvoiceeSummaryMode(state, departureId, bookingId),
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
