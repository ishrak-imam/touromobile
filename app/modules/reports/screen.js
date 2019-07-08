import React, { Component } from 'react'
import { Container, Text, View } from 'native-base'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { IonIcon, Colors } from '../../theme/'
import Header from '../../components/header'
import _T from '../../utils/translator'
import {
  currentTripSelector, getStatsData, getOrderStats,
  getParticipants, getTripExcursions, getReports, getOrders,
  getAllOrders, getPax, getMeals, getDrinks, checkIfFlightTrip,
  getSortedBookings, getUser, getModifiedPax,
  getAllExtraOrders
} from '../../selectors'
import Stats from '../../components/stats'
import OrderStats from '../../components/orderStats'
import { connect } from 'react-redux'
import { networkActionDispatcher } from '../../utils/actionDispatcher'
import { uploadStatsReq } from './action'
import FloatingButton from '../../components/floatingButton'
import { listToMap } from '../../utils/immutable'

const EXCURSIONS = 'EXCURSIONS'
const ORDERS = 'ORDERS'

class ReportsScreen extends Component {
  static navigationOptions = () => {
    return {
      tabBarIcon: ({ focused, tintColor }) => {
        return <IonIcon name='stats' color={tintColor} />
      },
      tabBarLabel: _T('reports')
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      tab: EXCURSIONS
    }
  }

  _onUpload = () => {
    const { excursions, participants, currentTrip, allOrders, extraOrders, user, modifiedPax } = this.props
    const trip = currentTrip.get('trip')
    const isFlight = checkIfFlightTrip(trip)
    const guideId = user.get('guideId')
    const departureId = String(trip.get('departureId'))
    const transportId = String(trip.get('transportId'))
    const statsData = getStatsData(excursions, modifiedPax, participants, trip)
    const orderStats = getOrderStats(allOrders, extraOrders, transportId, excursions, modifiedPax, participants, trip)

    networkActionDispatcher(uploadStatsReq({
      isNeedJwt: true,
      guideId,
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
            backgroundColor: tab === EXCURSIONS ? Colors.blue : Colors.cloud,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5
          }]}
          onPress={this._onTabSwitch(EXCURSIONS)}
        >
          <Text style={{ color: tab === EXCURSIONS ? Colors.silver : Colors.black }}>{_T('excursions')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[ss.tab, {
            backgroundColor: tab === ORDERS ? Colors.blue : Colors.cloud,
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

  _checkForIssuesInOrder = (orders, possibleIssues) => {
    const trip = this.props.currentTrip.get('trip')
    const brand = trip.get('brand')
    const departureId = String(trip.get('departureId'))
    let bookings = trip.get('bookings')

    const orderProblems = {
      canUploadReport: false
    }

    if (bookings) {
      bookings = listToMap(bookings, 'id')

      possibleIssues.reduce((map, issue) => {
        if (issue === 'Invoicee') {
          map[issue] = {
            desc: `missing${issue}`,
            bookings: []
          }
          orders.every((order, id) => {
            const invoicee = order.get('invoicee')
            if (!invoicee || !invoicee.size) {
              map.canUploadReport = true
              map[issue].bookings.push({
                booking: bookings.get(id),
                id,
                brand,
                departureId
              })
            }
            return true
          })
        }

        if (issue === 'Distribution') {
          map[issue] = {
            desc: `pending${issue}`,
            bookings: []
          }
          orders.every((order, id) => {
            const invoicee = order.get('invoicee')
            if (!invoicee || (invoicee.size > 1 && order.get('isNeedDistribution'))) {
              map.canUploadReport = true
              map[issue].bookings.push({
                booking: bookings.get(id),
                id,
                brand,
                departureId
              })
            }
            return true
          })
        }

        return map
      }, orderProblems)
    }

    return orderProblems
  }

  render () {
    const { tab } = this.state
    const {
      currentTrip, participants, excursions,
      reports, navigation, orders, meals, beverages,
      allOrders
    } = this.props

    const issues = ['Invoicee', 'Distribution']

    const orderIssues = this._checkForIssuesInOrder(allOrders, issues)

    const trip = currentTrip.get('trip')
    const departureId = String(trip.get('departureId'))
    const brand = trip.get('brand')
    const isDataReady = currentTrip.get('has')
    const isFlight = checkIfFlightTrip(trip)

    let sortedBookings = getSortedBookings(trip)
    const pax = getPax(trip)

    return (
      <Container>
        <Header left='menu' title={_T('reports')} navigation={navigation} brand={brand} />

        {this._renderTabs()}

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
            bookings={sortedBookings}
            pax={pax}
            meals={meals}
            beverages={beverages}
            isFlight={isFlight}
            orderIssues={orderIssues}
            issues={issues}
            brand={brand}
            departureId={departureId}
          />
        }

        {
          isDataReady && excursions && !!excursions.size &&
          <FloatingButton
            disabled={orderIssues.canUploadReport}
            topOffset={130} icon='upload'
            onPress={this._onUpload}
            loading={reports.get('isLoading')}
          />
        }

      </Container>
    )
  }
}

const stateToProps = state => {
  const currentTrip = currentTripSelector(state)
  const departureId = String(currentTrip.get('trip').get('departureId'))
  return {
    currentTrip,
    participants: getParticipants(state, departureId),
    excursions: getTripExcursions(state),
    reports: getReports(state),
    orders: getOrders(state, departureId),
    allOrders: getAllOrders(state, departureId),
    meals: getMeals(state),
    beverages: getDrinks(state),
    user: getUser(state),
    modifiedPax: getModifiedPax(state, departureId),
    extraOrders: getAllExtraOrders(state, departureId)
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
