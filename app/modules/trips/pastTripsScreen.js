
import React, { Component } from 'react'
import {
  Container
} from 'native-base'
import Header from '../../components/header'
import PastTrips from '../../components/pastTrips'
import { connect } from 'react-redux'
import { pastTripsSelector } from '../../selectors/index'
import Translator from '../../utils/translator'

const _T = Translator('PastTripsScreen')

class PastTripsScreen extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.futureTrips.equals(this.props.futureTrips)
  }

  render () {
    const { navigation, pastTrips } = this.props
    return (
      <Container>
        <Header left='back' title={_T('title')} navigation={navigation} />
        <PastTrips pastTrips={pastTrips} />
      </Container>
    )
  }
}

const stateToProps = state => ({
  pastTrips: pastTripsSelector(state)
})

export default connect(stateToProps, null)(PastTripsScreen)
