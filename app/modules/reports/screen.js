import React, { Component } from 'react'
import { Container, Text, View } from 'native-base'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { IonIcon, Colors } from '../../theme/'
import Header from '../../components/header'
import Translator from '../../utils/translator'
import {
  currentTripSelector, getStatsData, getOrderStats,
  getParticipants, getTripExcursions, getReports, getOrders, getOrderMode,
  getAllOrders, getSortedPaxByFirstName, getFoods, checkIfFlightTrip
} from '../../selectors'
import Stats from '../../components/stats'
import OrderStats from '../../components/orderStats'
import { connect } from 'react-redux'
import { networkActionDispatcher } from '../../utils/actionDispatcher'
import { uploadStatsReq } from './action'
import FloatingButton from '../../components/floatingButton'

const _T = Translator('ReportsScreen')

const EXCURSIONS = 'EXCURSIONS'
const ORDERS = 'ORDERS'

class ReportsScreen extends Component {
  static navigationOptions = () => {
    return {
      tabBarIcon: ({ focused, tintColor }) => {
        return <IonIcon name='stats' color={tintColor} />
      },
      tabBarLabel: _T('title')
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      tab: EXCURSIONS
    }
  }

  _onUpload = () => {
    const { excursions, participants, currentTrip, allOrders } = this.props
    const trip = currentTrip.get('trip')
    const isFlight = checkIfFlightTrip(trip)
    const departureId = String(trip.get('departureId'))
    const transportId = String(trip.get('transportId'))
    const statsData = getStatsData(excursions, participants, trip)
    const orderStats = getOrderStats(allOrders, transportId)
    networkActionDispatcher(uploadStatsReq({
      isNeedJwt: true,
      departureId,
      isFlight,
      statsData,
      orderStats,
      showToast: true,
      sucsMsg: _T('statsSucs'),
      failMsg: _T('statsFail')
    }))
  }

  _onTabSwitch = tab => {
    return () => {
      this.setState({ tab })
    }
  }

  _renderTabs = () => {
    const { tab } = this.state
    return (
      <View style={ss.tabContainer}>
        <TouchableOpacity
          style={[ss.tab, {
            backgroundColor: tab === EXCURSIONS ? Colors.blue : Colors.silver,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5
          }]}
          onPress={this._onTabSwitch(EXCURSIONS)}
        >
          <Text style={{ color: tab === EXCURSIONS ? Colors.silver : Colors.black }}>{_T('excursions')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[ss.tab, {
            backgroundColor: tab === ORDERS ? Colors.blue : Colors.silver,
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5
          }]}
          onPress={this._onTabSwitch(ORDERS)}
        >
          <Text style={{ color: tab === ORDERS ? Colors.silver : Colors.black }}>{_T('orders')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render () {
    const { tab } = this.state
    const {
      currentTrip, participants, excursions,
      reports, navigation, orders, meals, beverages
    } = this.props
    const trip = currentTrip.get('trip')
    const brand = trip.get('brand')

    const isDataReady = currentTrip.get('has')
    const isFlight = checkIfFlightTrip(trip)

    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} brand={brand} />

        {!isFlight && this._renderTabs()}

        {
          tab === EXCURSIONS && isDataReady &&
          <Stats
            participants={participants}
            excursions={excursions}
            trip={trip}
          />
        }

        {
          tab === ORDERS && isDataReady &&
          <OrderStats
            orders={orders}
            pax={getSortedPaxByFirstName(trip)}
            meals={meals}
            beverages={beverages}
          />
        }

        <FloatingButton onPress={this._onUpload} loading={reports.get('isLoading')} />

      </Container>
    )
  }
}

const stateToProps = state => {
  const currentTrip = currentTripSelector(state)
  const departureId = String(currentTrip.get('trip').get('departureId'))
  const orderMode = getOrderMode(state)
  return {
    currentTrip,
    participants: getParticipants(state, departureId),
    excursions: getTripExcursions(state),
    reports: getReports(state),
    orders: getOrders(state, departureId, orderMode),
    allOrders: getAllOrders(state, departureId),
    meals: getFoods(state, 'meals'),
    beverages: getFoods(state, 'beverages')
  }
}

export default connect(stateToProps, null)(ReportsScreen)

const ss = StyleSheet.create({
  footerButton: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.blue
  },
  buttonItem: {
    flexDirection: 'row'
  },
  buttonIcon: {
    marginRight: 10
  },
  buttonText: {
    color: Colors.silver,
    marginTop: 2,
    marginLeft: 10
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
    marginHorizontal: 10,
    // borderWidth: 1,
    borderColor: Colors.blue,
    padding: 2,
    borderRadius: 5
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 7
  }
})
