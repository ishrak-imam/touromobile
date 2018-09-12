import React, { Component } from 'react'
import {
  Content, Container
} from 'native-base'
import Header from '../../components/header'
import PaxCard from '../../components/paxCard'

export default class PaxDetailsScreen extends Component {
  render () {
    const { navigation } = this.props
    const pax = navigation.getParam('pax')
    const name = `${pax.get('firstName')} ${pax.get('lastName')}`
    return (
      <Container>
        <Header left='back' title={name} navigation={navigation} />
        <Content scrollEnabled={false}>
          <PaxCard pax={pax} />
        </Content>
      </Container>
    )
  }
}
