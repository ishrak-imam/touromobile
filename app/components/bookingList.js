import React, { Component } from 'react'
import {
  View, Text, List, ListItem, Body, Right
} from 'native-base'
import { getSortedBookings } from '../selectors'
import IconButton from '../components/iconButton'
import { Text as Sms } from 'react-native-openanything'

export default class BookingList extends Component {
  _smsAll = pax => {
    const phones = pax
      .filter(p => p.get('phone'))
      .map(p => p.get('phone'))
      .join(',')
    Sms(phones)
  }

  _renderBooking = booking => {
    const id = booking.get('id')
    const pax = booking.get('pax')
    const sortedPax = pax.sortBy(p => `${p.get('firstName')} ${p.get('lastName')}`)
    const paxNames = sortedPax.map(p => <Text note key={p.get('id')}>{`${p.get('firstName')} ${p.get('lastName')}`}</Text>)
    return (
      <ListItem onPress={() => {}} key={id}>
        <Body>
          <Text>{id}</Text>
          {paxNames}
        </Body>
        <Right>
          <IconButton name='sms' color='blue' onPress={() => this._smsAll(sortedPax)} />
        </Right>
      </ListItem>
    )
  }

  _renderList = trip => {
    const bookings = getSortedBookings(trip)
    return (
      <List>
        {bookings.map(b => this._renderBooking(b))}
      </List>
    )
  }

  render () {
    const { trip } = this.props
    const bookings = trip.get('bookings')
    return (
      <View>
        {!!bookings && this._renderList(trip)}
      </View>
    )
  }
}
