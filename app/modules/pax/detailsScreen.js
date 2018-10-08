import React, { Component } from 'react'
import {
  Container
} from 'native-base'
import Header from '../../components/header'
import PaxCard from '../../components/paxCard'

export default class PaxDetailsScreen extends Component {
  render () {
    const { navigation } = this.props
    const pax = navigation.getParam('pax')
    const departureId = navigation.getParam('departureId')
    const name = `${pax.get('firstName')} ${pax.get('lastName')}`
    return (
      <Container>
        <Header left='back' title={name} navigation={navigation} />
        <PaxCard pax={pax} departureId={departureId} />
      </Container>
    )
  }
}
