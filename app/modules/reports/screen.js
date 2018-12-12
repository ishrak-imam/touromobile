import React, { Component } from 'react'
import {
  Container, CardItem, Text,
  Spinner, View
} from 'native-base'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { IonIcon, Colors } from '../../theme/'
import Header from '../../components/header'
import Translator from '../../utils/translator'
import {
  currentTripSelector, getStatsData,
  getParticipants, getTripExcursions,
  // getReports
  getAllOrders, getPax, getMeals
} from '../../selectors'
import Stats from '../../components/stats'
import OrderStats from '../../components/orderStats'
import { connect } from 'react-redux'
import { networkActionDispatcher } from '../../utils/actionDispatcher'
import { uploadStatsReq } from './action'
import Button from '../../components/button'

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
    const { excursions, participants, currentTrip } = this.props
    const trip = currentTrip.get('trip')
    const departureId = String(trip.get('departureId'))
    const statsData = getStatsData(excursions, participants, trip)
    networkActionDispatcher(uploadStatsReq({
      isNeedJwt: true,
      departureId,
      statsData,
      showToast: true,
      sucsMsg: _T('statsSucs'),
      failMsg: _T('statsFail')
    }))
  }

  // _renderUploadButton = reports => {
  //   const isLoading = reports.get('isLoading')
  //   return (
  //     <CardItem>
  //       <Button style={ss.footerButton} onPress={this._onUpload} disabled={isLoading}>
  //         {
  //           isLoading
  //             ? <Spinner color={Colors.blue} />
  //             : <View style={ss.buttonItem}>
  //               <IonIcon name='upload' color={Colors.white} style={ss.buttonIcon} />
  //               <Text style={ss.buttonText}>{_T('upload')}</Text>
  //             </View>
  //         }
  //       </Button>
  //     </CardItem>
  //   )
  // }

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
    const { currentTrip, participants, excursions,
      // reports,
      navigation, orders, meals } = this.props
    const trip = currentTrip.get('trip')
    const brand = trip.get('brand')

    const isDataReady = currentTrip.get('has')

    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} brand={brand} />
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
          <OrderStats orders={orders} pax={getPax(trip)} meals={meals} />
        }

        {/* {currentTrip.get('has') && this._renderUploadButton(reports)} */}

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
    // reports: getReports(state)
    orders: getAllOrders(state, departureId),
    meals: getMeals(state)
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
    // borderWidth: 2,
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
