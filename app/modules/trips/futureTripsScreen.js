
import React, { Component } from 'react'
import {
  Container
} from 'native-base'
import Header from '../../components/header'
import FutureTrips from '../../components/futureTrips'
import { connect } from 'react-redux'
import { getTrips } from '../../selectors/index'
import Translator from '../../utils/translator'

const _T = Translator('FutureTripsScreen')

class FutureTripsScreen extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.trips.equals(this.props.trips)
  }

  render () {
    const { navigation, trips } = this.props
    const futureTrips = trips.get('future')
    const trip = trips.get('current').get('trip')
    const brand = trip.get('brand')
    return (
      <Container>
        <Header left='back' title={_T('title')} navigation={navigation} brand={brand} />
        <FutureTrips futureTrips={futureTrips} />
      </Container>
    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state)
})

export default connect(stateToProps, null)(FutureTripsScreen)
