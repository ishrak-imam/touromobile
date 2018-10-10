
import React, { Component } from 'react'
import {
  Container
} from 'native-base'
import Header from '../../components/header'
import PastTrips from '../../components/pastTrips'
import { connect } from 'react-redux'
import { getTrips } from '../../selectors/index'
import Translator from '../../utils/translator'

const _T = Translator('PastTripsScreen')

class PastTripsScreen extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.trips.equals(this.props.trips)
  }

  render () {
    const { navigation, trips } = this.props
    const pastTrips = trips.get('past')
    const trip = trips.get('current').get('trip')
    const brand = trip.get('brand')
    return (
      <Container>
        <Header left='back' title={_T('title')} navigation={navigation} brand={brand} />
        <PastTrips pastTrips={pastTrips} brand={brand} />
      </Container>
    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state)
})

export default connect(stateToProps, null)(PastTripsScreen)
