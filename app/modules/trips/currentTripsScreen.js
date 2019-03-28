
import React, { Component } from 'react'
import {
  Container
} from 'native-base'
import Header from '../../components/header'
import CurrentTrips from '../../components/pastTrips'
import { connect } from 'react-redux'
import { getUser, getTrips } from '../../selectors/index'
import _T from '../../utils/translator'
import { actionDispatcher, networkActionDispatcher } from '../../utils/actionDispatcher'
import { setCurrentTrip, tripsReq, connectionsReq } from './action'

class CurrentTripsScreen extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.trips.equals(this.props.trips)
  }

  _onRefresh = () => {
    const { user } = this.props
    networkActionDispatcher(tripsReq({
      isNeedJwt: true,
      guideId: user.get('guideId'),
      pendingModal: {}
    }))
    networkActionDispatcher(connectionsReq({
      isNeedJwt: true
    }))
  }

  _onTripPress = trip => {
    actionDispatcher(setCurrentTrip(trip))
    this.props.navigation.navigate('Home', { left: 'back' })
  }

  render () {
    const { navigation, trips } = this.props
    const currentTrips = trips.get('current')
    const isLoading = trips.get('isLoading')

    return (
      <Container>
        <Header left='menu' title={_T('currentTrips')} navigation={navigation} />
        <CurrentTrips
          screen='CURRENT_TRIPS'
          pastTrips={currentTrips}
          refreshing={isLoading}
          onRefresh={this._onRefresh}
          onTripPress={this._onTripPress}
        />
      </Container>
    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state),
  user: getUser(state)
})

export default connect(stateToProps, null)(CurrentTripsScreen)
