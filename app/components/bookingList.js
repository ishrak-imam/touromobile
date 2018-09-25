import React, { PureComponent } from 'react'
import {
  View, Text, ListItem, Body, Right
} from 'native-base'
import { getSortedBookings } from '../selectors'
import IconButton from '../components/iconButton'
import { Text as Sms } from 'react-native-openanything'
import { StyleSheet } from 'react-native'
import isIphoneX from '../utils/isIphoneX'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'

export default class BookingList extends PureComponent {
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
        keyExtractor={(item, index) => String(item.get('id'))}
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
    marginBottom: isIphoneX ? 100 : 85
  }
})
