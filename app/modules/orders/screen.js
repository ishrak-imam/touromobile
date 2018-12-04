
import React, { Component } from 'react'
import {
  Container
} from 'native-base'
import { StyleSheet } from 'react-native'
import Header from '../../components/header'
import Translator from '../../utils/translator'
import OrderItem from '../../components/orderItem'
import isIphoneX from '../../utils/isIphoneX'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'

const _T = Translator('OrdersScreen')

export default class OrdersScreen extends Component {
  _renderItem = bookingId => {
    return ({ item }) => (
      <OrderItem
        bookingId={bookingId}
        pax={item}
      />
    )
  }

  render () {
    const { navigation } = this.props
    const booking = navigation.getParam('booking')
    const brand = navigation.getParam('brand')
    const bookingId = String(booking.get('id'))
    const pax = booking.get('pax')
    const title = `${_T('title')} - ${bookingId}`
    return (
      <Container>
        <Header left='back' title={title} navigation={navigation} brand={brand} />
        <ImmutableVirtualizedList
          contentContainerStyle={ss.scroll}
          immutableData={pax}
          renderItem={this._renderItem(bookingId)}
          keyExtractor={item => String(item.get('id'))}
        />
      </Container>
    )
  }
}

const ss = StyleSheet.create({
  scroll: {
    paddingBottom: isIphoneX ? 20 : 0
  }
})
