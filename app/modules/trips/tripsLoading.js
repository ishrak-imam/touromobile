
import React, { Component } from 'react'
import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native'
import { connect } from 'react-redux'
import {
  networkActionDispatcher, actionDispatcher
} from '../../utils/actionDispatcher'
import { getTrips, getUser } from '../../selectors'
import NoData from '../../components/noData'
import {
  tripsReq,
  tripsActionsOnSuccess,
  navigateToOtherTripScreen,
  connectionsReq, reservationsReq
} from './action'
import Header from '../../components/header'
// import startSyncDataWorker from '../../utils/modifiedDataSync'
// import { connectionLinesReq } from '../connectionLines/action'
import { resolvePendingRequests } from '../../requestmanager/service'

class TripsLoading extends Component {
  constructor (props) {
    super(props)
    this.pendingModal = {
      showWarning: false,
      msg: '',
      onOk: null
    }
    this.syncDataTimer = null
  }

  componentDidMount () {
    resolvePendingRequests()
    const { trips } = this.props
    const hasLocalData = trips.get('data').size > 0
    if (!hasLocalData) {
      this._requestTrips(false)
    } else {
      /**
       * TODO:
       * remove setTimeout
       * >> make a separate saga composed of
       * following two sagas
       */
      actionDispatcher(tripsActionsOnSuccess({
        pendingModal: this.pendingModal
      }))
      setTimeout(() => {
        actionDispatcher(navigateToOtherTripScreen({
          refreshFromFutureTrip: false
        }))
      }, 0)
    }

    const connections = trips.get('connections')
    const direct = connections.get('direct').size
    const overnight = connections.get('overnight').size
    if (!direct || !overnight) {
      this._requestConnections()
    }

    this._requestReservations()
    // this._requestConnectionLines()

    // this.syncDataTimer = startSyncDataWorker()
  }

  // componentWillUnmount () {
  //   clearInterval(this.syncDataTimer)
  // }

  _requestTrips = isRefreshing => {
    const { user } = this.props
    networkActionDispatcher(tripsReq({
      isNeedJwt: true,
      guideId: user.get('guideId'),
      isRefreshing,
      pendingModal: this.pendingModal
    }))
  }

  _requestConnections = () => {
    networkActionDispatcher(connectionsReq({
      isNeedJwt: true
    }))
  }

  _requestReservations = () => {
    const { user } = this.props
    networkActionDispatcher(reservationsReq({
      isNeedJwt: true,
      guideId: user.get('guideId')
    }))
  }

  // _requestConnectionLines = () => {
  //   networkActionDispatcher(connectionLinesReq())
  // }

  _onRefresh = () => {
    this._requestTrips(false)
    this._requestConnections()
    this._requestReservations()
    // this._requestConnectionLines()
  }

  render () {
    const { trips, navigation } = this.props
    const isLoading = trips.get('isLoading')
    const text = isLoading ? 'fetchingData' : 'fetchingDataSucs'
    return (
      <View style={ss.screen}>
        <Header left='menu' navigation={navigation} />
        <ScrollView refreshControl={<RefreshControl refreshing={false} onRefresh={this._onRefresh} />}>
          <View style={ss.container}>
            <NoData text={text} textStyle={ss.textStyle} />
          </View>
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
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 20
  },
  textStyle: {
    marginTop: 30,
    textAlign: 'center'
  }
})
