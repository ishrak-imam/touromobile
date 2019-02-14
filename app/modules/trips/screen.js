import React, { Component } from 'react'
import { Container } from 'native-base'
import Header from '../../components/header'
import { IonIcon } from '../../theme/'
import { connect } from 'react-redux'
import Translator from '../../utils/translator'
import {
  tripsReq,
  getCurrentTrip,
  getFutureTrips,
  getPastTrips,
  getPendingStatsUpload,
  getRemainingFutureTrips,
  connectionsReq
} from './action'
import {
  networkActionDispatcher, actionDispatcher
} from '../../utils/actionDispatcher'
import Trip from '../../components/trip'
import { getTrips, getUser } from '../../selectors'
import NoData from '../../components/noData'
import { ScrollView, RefreshControl } from 'react-native'
import OverlaySpinner from '../../components/overlaySpinner'

const _T = Translator('CurrentTripScreen')

class TripScreen extends Component {
  static navigationOptions = () => {
    return {
      tabBarIcon: ({ focused, tintColor }) => {
        return <IonIcon name='home' color={tintColor} />
      },
      tabBarLabel: _T('title')
    }
  }

  shouldComponentUpdate (nextProps) {
    return !nextProps.trips.equals(this.props.trips)
  }

  _pendingModalOk = () => {
    this.props.navigation.navigate('PastTrips')
  }

  componentDidMount () {
    const { trips } = this.props
    const hasLocalData = trips.get('data').size > 0
    if (!hasLocalData) {
      this._requestTrips(false)
    } else {
      actionDispatcher(getCurrentTrip())
      actionDispatcher(getFutureTrips())
      actionDispatcher(getPastTrips())
      actionDispatcher(getPendingStatsUpload({
        showWarning: false,
        msg: _T('pendingStats'),
        onOk: this._pendingModalOk
      }))
      actionDispatcher(getRemainingFutureTrips())
    }
    const connections = trips.get('connections')
    const direct = connections.get('direct').size
    const overnight = connections.get('overnight').size
    if (!direct || !overnight) {
      this._requestConnections()
    }
  }

  _requestTrips = isRefreshing => {
    const { user } = this.props
    networkActionDispatcher(tripsReq({
      isNeedJwt: true,
      guideId: user.get('guideId'),
      isRefreshing,
      pendingModal: {
        showWarning: false,
        msg: _T('pendingStats'),
        onOk: this._pendingModalOk
      }
    }))
  }

  _requestConnections = () => {
    networkActionDispatcher(connectionsReq({
      isNeedJwt: true
    }))
  }

  _onRefresh = () => {
    this._requestTrips(true)
    this._requestConnections()
  }

  render () {
    const { navigation, trips } = this.props
    const isLoading = trips.get('isLoading')
    const isRefreshing = trips.get('isRefreshing')
    const current = trips.get('current')
    const brand = current.get('trip').get('brand')

    return (
      <Container>
        <Header
          left='menu'
          title={_T('title')}
          navigation={navigation}
          brand={brand}
        />
        {isRefreshing && <OverlaySpinner />}
        <ScrollView
          contentContainerStyle={{ justifyContent: 'center' }}
          refreshControl={<RefreshControl refreshing={false} onRefresh={this._onRefresh} />}
        >
          {
            isLoading
              ? <NoData text='fetchingData' textStyle={{ marginTop: 30 }} />
              : current.get('has')
                ? <Trip trip={current.get('trip')} navigation={navigation} />
                : <NoData text='noCurrentTrip' textStyle={{ marginTop: 30 }} />
          }
        </ScrollView>

      </Container>

    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state),
  user: getUser(state)
})

export default connect(stateToProps, null)(TripScreen)
