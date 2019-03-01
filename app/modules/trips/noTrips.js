
import React, { Component } from 'react'
import { StyleSheet, ScrollView, View, Text, RefreshControl } from 'react-native'
import Header from '../../components/header'
import Translator from '../../utils/translator'
import { connect } from 'react-redux'
import {
  networkActionDispatcher
} from '../../utils/actionDispatcher'
import { getTrips, getUser } from '../../selectors'
import {
  tripsReq,
  connectionsReq
} from './action'
import OverlaySpinner from '../../components/overlaySpinner'

const _T = Translator('NoTripsScreen')

class NoTrips extends Component {
  constructor (props) {
    super(props)
    this.pendingModal = {
      showWarning: false,
      msg: '',
      onOk: null
    }
  }

  _onRefresh = () => {
    this._requestTrips(true)
    this._requestConnections()
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

  _requestConnections = () => {
    networkActionDispatcher(connectionsReq({
      isNeedJwt: true
    }))
  }

  render () {
    const { trips, navigation } = this.props
    const isRefreshing = trips.get('isRefreshing')

    return (
      <View style={ss.screen}>
        <Header left='menu' title={_T('title')} navigation={navigation} />
        {isRefreshing && <OverlaySpinner />}
        <ScrollView
          contentContainerStyle={ss.container}
          refreshControl={<RefreshControl refreshing={false} onRefresh={this._onRefresh} />}
        >
          <Text style={ss.textStyle}>{_T('text')}</Text>
        </ScrollView>
      </View>
    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state),
  user: getUser(state)
})

export default connect(stateToProps, null)(NoTrips)

const ss = StyleSheet.create({
  screen: {
    flex: 1
  },
  container: {
    flex: 1,
    marginHorizontal: 30
  },
  textStyle: {
    marginTop: 30
  }
})
