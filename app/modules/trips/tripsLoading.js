
import React, { Component } from 'react'
import { RefreshControl, StyleSheet, ScrollView, View } from 'react-native'
import { connect } from 'react-redux'
import {
  networkActionDispatcher, actionDispatcher
} from '../../utils/actionDispatcher'
import { getTrips, getUser } from '../../selectors'
import OverlaySpinner from '../../components/overlaySpinner'
import NoData from '../../components/noData'
import {
  tripsReq,
  tripsActionsOnSuccess,
  navigateToOtherTripScreen,
  connectionsReq
} from './action'
import Header from '../../components/header'

class TripsLoading extends Component {
  constructor (props) {
    super(props)
    this.pendingModal = {
      showWarning: false,
      msg: '',
      onOk: null
    }
  }

  componentDidMount () {
    const { trips } = this.props
    const hasLocalData = trips.get('data').size > 0
    if (!hasLocalData) {
      this._requestTrips(false)
    } else {
      actionDispatcher(tripsActionsOnSuccess({
        pendingModal: this.pendingModal
      }))
      actionDispatcher(navigateToOtherTripScreen({
        refreshFromFutureTrip: false
      }))
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
      pendingModal: this.pendingModal
    }))
  }

  _pendingModalOk = () => {
    this.props.navigation.navigate('PastTrips')
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
    const { trips, navigation } = this.props
    const isLoading = trips.get('isLoading')
    const isRefreshing = trips.get('isRefreshing')
    const text = isLoading ? 'fetchingData' : 'fetchingDataSucs'
    return (
      <View style={ss.screen}>
        <Header left='menu' navigation={navigation} />
        {isRefreshing && <OverlaySpinner />}
        <ScrollView
          contentContainerStyle={ss.container}
          refreshControl={<RefreshControl refreshing={false} onRefresh={this._onRefresh} />}
        >
          <NoData text={text} textStyle={ss.textStyle} />
        </ScrollView>
      </View>
    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state),
  user: getUser(state)
})

export default connect(stateToProps, null)(TripsLoading)

const ss = StyleSheet.create({
  screen: {
    flex: 1
  },
  container: {
    flex: 1
  },
  textStyle: {
    marginTop: 30
  }
})
