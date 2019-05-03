
import React, { Component } from 'react'
import { Container } from 'native-base'
import Header from '../../components/header'
import _T from '../../utils/translator'
import SummaryOrderItem from '../../components/summaryOrderItem'

export default class OrdersScreen extends Component {
  render () {
    const { navigation } = this.props
    const booking = navigation.getParam('booking')
    const brand = navigation.getParam('brand')
    const departureId = navigation.getParam('departureId')
    const bookingId = String(booking.get('id'))
    const title = `${_T('orders')} - ${bookingId}`
    return (
      <Container>
        <Header left='back' title={title} navigation={navigation} brand={brand} />

        <SummaryOrderItem
          // direction='out'
          booking={booking}
          pax={booking.get('pax')}
          bookingId={bookingId}
          departureId={departureId}
          screen='booking'
          navigation={navigation}
          brand={brand}
        />

      </Container>
    )
  }
}
