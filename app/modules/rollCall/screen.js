
import React, { Component } from 'react'
import { Container } from 'native-base'
import Header from '../../components/header'
import { connect } from 'react-redux'
import Translator from '../../utils/translator'
import { getTrips } from '../../selectors'

const _T = Translator('RollCallScreen')

class RollCallScreen extends Component {
  render () {
    const { navigation, trips } = this.props
    const current = trips.get('current')
    const brand = current.get('trip').get('brand')
    return (
      <Container>
        <Header
          left='back'
          title={_T('title')}
          navigation={navigation}
          brand={brand}
        />
      </Container>
    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state)
})

export default connect(stateToProps, null)(RollCallScreen)
