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
    const brand = navigation.getParam('brand')
    const isFlight = navigation.getParam('isFlight')
    const name = `${pax.get('firstName')} ${pax.get('lastName')}`
    return (
      <Container>
        <Header left='back' title={name} navigation={navigation} brand={brand} />
        <PaxCard brand={brand} pax={pax} departureId={departureId} isFlight={isFlight} />
      </Container>
    )
  }
}
