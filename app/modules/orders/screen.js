
import React, { Component } from 'react'
import {
  Container
} from 'native-base'
import Header from '../../components/header'
import Translator from '../../utils/translator'

const _T = Translator('OrdersScreen')

export default class OrdersScreen extends Component {
  render () {
    const { navigation } = this.props
    const booking = navigation.getParam('booking')
    const brand = navigation.getParam('brand')
    const title = `${_T('title')} - ${booking.get('id')}`
    return (
      <Container>
        <Header left='back' title={title} navigation={navigation} brand={brand} />
      </Container>
    )
  }
}
