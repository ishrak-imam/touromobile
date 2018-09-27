import React, { Component } from 'react'
import {
  View, Text, ListItem, Body, Right
} from 'native-base'
import { getSortedBookings } from '../selectors'
import IconButton from '../components/iconButton'
import { Text as Sms } from 'react-native-openanything'
import { StyleSheet } from 'react-native'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'

export default class BookingList extends Component {
  /**
   * currently this is just a dumb component only receiving
   * some props. So any re-render optimization is not needed
   */

  _smsAll = pax => {
    const phones = pax
      .filter(p => p.get('phone'))
      .map(p => p.get('phone'))
      .join(',')
    Sms(phones)
  }

  _renderBooking = ({ item }) => {
    const id = item.get('id')
    const pax = item.get('pax')
    const sortedPax = pax.sortBy(p => `${p.get('firstName')} ${p.get('lastName')}`)
    const paxNames = sortedPax.map(p => <Text note key={p.get('id')}>{`${p.get('firstName')} ${p.get('lastName')}`}</Text>)
    return (
      <ListItem onPress={() => {}}>
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
      <ImmutableVirtualizedList
        immutableData={bookings}
        renderItem={this._renderBooking}
        keyExtractor={item => String(item.get('id'))}
      />
    )
  }

  render () {
    const { trip } = this.props
    const bookings = trip.get('bookings')
    return (
      <View style={ss.container}>
        {!!bookings && this._renderList(trip)}
      </View>
    )
  }
}

const ss = StyleSheet.create({
  container: {
    flex: 1
  }
})
