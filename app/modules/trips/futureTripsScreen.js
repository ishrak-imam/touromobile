
import React, { Component } from 'react'
import { Container } from 'native-base'
import Header from '../../components/header'
import FutureTrips from '../../components/futureTrips'
import { connect } from 'react-redux'
import { getUser, getTrips } from '../../selectors/index'
import _T from '../../utils/translator'
import { networkActionDispatcher } from '../../utils/actionDispatcher'
import { tripsReq, connectionsReq } from './action'

class FutureTripsScreen extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.trips.equals(this.props.trips)
  }

  _onRefresh = () => {
    const { user } = this.props
    networkActionDispatcher(tripsReq({
      isNeedJwt: true,
      guideId: user.get('guideId'),
      refreshFromFutureTrip: true,
      pendingModal: {}
    }))
    networkActionDispatcher(connectionsReq({
      isNeedJwt: true
    }))
  }

  render () {
    const { navigation, trips } = this.props
    const futureTrips = trips.get('future')
    const currentTrip = trips.getIn(['current', 'trip'])
    const manualTrips = trips.get('manualTrips')
    const isLoading = trips.get('isLoading')
    const left = navigation.getParam('left') || 'back'

    return (
      <Container>
        <Header left={left} title={_T('futureTrips')} navigation={navigation} />
        <FutureTrips
          currentTrip={currentTrip}
          futureTrips={futureTrips}
          manualTrips={manualTrips}
          refreshing={isLoading}
          onRefresh={this._onRefresh}
          navigation={navigation}
        />
      </Container>
    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state),
  user: getUser(state)
})

export default connect(stateToProps, null)(FutureTripsScreen)
