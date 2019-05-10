
import React, { Component } from 'react'
import { View, Text } from 'native-base'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { IonIcon, Colors } from '../theme'
import { connect } from 'react-redux'
import {
  getLunches, getFormattedMealsData,
  getOrderForBooking, getInvoicee,
  getDistributionFlag
} from '../selectors'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
// import { actionDispatcher } from '../utils/actionDispatcher'
// import { resetAllOrders } from '../modules/modifiedData/action'
import _T from '../utils/translator'
import FoodItem from './foodItem'
import NoData from './noData'
import OutHomeTab from './outHomeTab'
import ExcursionOrderSummaryMode from './excursionOrderSummaryMode'
import ExtraOrderSummaryMode from './extraOrderSummaryMode'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import isIOS from '../utils/isIOS'
import isIphoneX from '../utils/isIphoneX'
import SelectInvoicee from './selectInvoicee'
import DistributeOrders from './distributeOrders'
import { getMap } from '../utils/immutable'

class SummaryOrderItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      lunchOrders: false,
      excursionOrders: false,
      extraOrders: false,
      invoicee: false,
      distribution: false,
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
    const { navigation, brand, bookingId, departureId } = this.props
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
          navigation={navigation}
          brand={brand}
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
      meals.every(meal => {
        count = count + meal.get('adultCount') + meal.get('childCount')
        const allergies = meal.get('allergies')
        if (allergies) {
          allergies.every(order => {
            count = count + order.get('adultCount') + order.get('childCount')
          })
          return true
        }
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

  _renderMeals = (meals, mealOrders, paxCount) => {
    const formattedMeals = getFormattedMealsData(getMap({ meals, mealOrders }), _T('child'))
    return (
      <View style={ss.section}>
        <Text style={ss.boldText}>{_T('meals')}</Text>
        {
          <ImmutableVirtualizedList
            immutableData={formattedMeals}
            renderItem={this._renderFoodItem('meal', paxCount, this.totalMealOrder)}
            // keyExtractor={item => `${item.get('id')}${item.get('adult') || item.get('child')}`}
            keyExtractor={(_, index) => String(index)}
            renderEmpty={_T('noMealData')}
          />
        }
      </View>
    )
  }

  _renderBeverages = (beverages, paxCount) => {
    return (
      <View style={ss.section}>
        <Text style={ss.boldText}>{_T('beverages')}</Text>
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

  // _resetOrders = (departureId, bookingId) => {
  //   return () => {
  //     actionDispatcher(resetAllOrders({
  //       key: 'ordersSummaryMode', departureId, bookingId
  //     }))
  //   }
  // }

  _onTabSwitch = tab => {
    return () => {
      this.setState({ tab })
    }
  }

  _renderLunchOrders = () => {
    const { lunchOrders, tab } = this.state
    const {
      pax, lunches,
      // departureId, bookingId,
      orderForBooking } = this.props
    const meals = lunches.getIn([tab, 'meals'])
    const beverages = lunches.getIn([tab, 'beverages'])
    const icon = lunchOrders ? 'minus' : 'plus'

    const mealOrders = orderForBooking.getIn([tab, 'meal'])

    return (
      <View>
        <TouchableOpacity style={ss.topHeader} onPress={this._viewToggle('lunchOrders')}>
          {/* <Left style={ss.headerLeft}>
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
          <Right style={ss.headerRight} /> */}

          <View style={ss.sectionIcon}>
            <IonIcon name={icon} size={22} />
          </View>
          <Text style={ss.headerText}>{_T('lunchOrders')}</Text>
        </TouchableOpacity>
        {
          lunchOrders &&
          <View>
            <View style={ss.tabContainer}>
              <OutHomeTab selected={tab} onPress={this._onTabSwitch} />
            </View>
            {this._renderMeals(meals, mealOrders, pax.size)}
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
        <TouchableOpacity style={ss.topHeader} onPress={this._viewToggle('excursionOrders')}>
          <View style={ss.sectionIcon}>
            <IonIcon name={icon} size={22} />
          </View>
          <Text style={ss.headerText}>{_T('excursionOrders')}</Text>
        </TouchableOpacity>
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
        <TouchableOpacity style={ss.topHeader} onPress={this._viewToggle('extraOrders')}>
          <View style={ss.sectionIcon}>
            <IonIcon name={icon} size={22} />
          </View>
          <Text style={ss.headerText}>{_T('extraOrders')}</Text>
        </TouchableOpacity>
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

  _renderInvoiceeSelection = () => {
    const { booking, bookingId, pax, departureId } = this.props
    const { invoicee, tab: { direction } } = this.state
    const icon = invoicee ? 'minus' : 'plus'
    return (
      <View>
        <TouchableOpacity style={ss.topHeader} onPress={this._viewToggle('invoicee')}>
          <View style={ss.sectionIcon}>
            <IonIcon name={icon} size={22} />
          </View>
          <Text style={ss.headerText}>{_T('selectInvoicee')}</Text>
        </TouchableOpacity>
        {
          invoicee &&
          <SelectInvoicee
            booking={booking}
            pax={pax}
            direction={direction}
            bookingId={bookingId}
            departureId={departureId}
          />
        }
      </View>
    )
  }

  _renderDistribution = invoiceeList => {
    const { booking, bookingId, departureId, isNeedDistribution } = this.props
    const { distribution } = this.state
    const icon = distribution ? 'minus' : 'plus'
    return (
      <View>
        <TouchableOpacity style={ss.topHeader} onPress={this._viewToggle('distribution')}>
          <View style={ss.sectionIcon}>
            <IonIcon name={icon} size={22} />
          </View>
          <Text style={ss.headerText}>Distribute orders</Text>
          <View style={ss.distributionIcon}>
            {isNeedDistribution &&
            <IonIcon name='clipBoard' size={22} color={Colors.blue} />}
          </View>
        </TouchableOpacity>
        {
          distribution &&
          <DistributeOrders
            booking={booking}
            invoiceeList={invoiceeList}
            bookingId={bookingId}
            departureId={departureId}
          />
        }
      </View>
    )
  }

  render () {
    const { invoiceeList } = this.props
    return (
      <View style={ss.container}>

        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={ss.scroll}
          extraScrollHeight={isIOS ? 40 : 200}
          enableOnAndroid
          keyboardShouldPersistTaps='always'
        >

          {this._renderInvoiceeSelection()}
          {this._renderLunchOrders()}
          {this._renderExcursionOrders()}
          {this._renderExtraOrders()}
          {invoiceeList.size > 1 && this._renderDistribution(invoiceeList)}

        </KeyboardAwareScrollView>

      </View>
    )
  }
}

const stateToProps = (state, props) => {
  const { departureId, bookingId } = props
  return {
    invoiceeList: getInvoicee(state, departureId, bookingId),
    lunches: getLunches(state),
    orderForBooking: getOrderForBooking(state, departureId, bookingId),
    isNeedDistribution: getDistributionFlag(state, departureId, bookingId)
  }
}

export default connect(stateToProps, null)(SummaryOrderItem)

const ss = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 10,
    marginHorizontal: 15
  },
  boldText: {
    fontWeight: 'bold'
  },
  section: {
    marginVertical: 10
  },
  header: {
    paddingBottom: 5,
    marginLeft: 0,
    borderBottomWidth: 0
  },
  scroll: {
    marginTop: 5,
    paddingBottom: isIphoneX ? 30 : 20
  },
  topHeader: {
    height: 40,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 5,
    backgroundColor: Colors.cloud,
    marginVertical: 5,
    paddingLeft: 10
  },
  headerLeft: {
    flex: 3
  },
  headerRight: {
    flex: 2
  },
  headerText: {
    fontWeight: 'bold'
    // marginBottom: 3
  },
  reset: {
    paddingHorizontal: 20
  },
  sectionIcon: {
    marginRight: 10
  },
  distributionIcon: {
    marginLeft: 10
  },
  tabContainer: {
    width: '100%',
    marginTop: 5
  }
})
