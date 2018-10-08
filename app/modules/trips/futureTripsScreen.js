
import React, { Component } from 'react'
import {
  Container
} from 'native-base'
import Header from '../../components/header'
import FutureTrips from '../../components/futureTrips'
import { connect } from 'react-redux'
import { futureTripsSelector } from '../../selectors/index'
import Translator from '../../utils/translator'

const _T = Translator('FutureTripsScreen')

class FutureTripsScreen extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.futureTrips.equals(this.props.futureTrips)
  }

  render () {
    const { navigation, futureTrips } = this.props
    return (
      <Container>
        <Header left='back' title={_T('title')} navigation={navigation} />
        <FutureTrips futureTrips={futureTrips} />
      </Container>
    )
  }
}

const stateToProps = state => ({
  futureTrips: futureTripsSelector(state)
})

export default connect(stateToProps, null)(FutureTripsScreen)
