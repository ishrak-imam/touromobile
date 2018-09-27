import React, { Component } from 'react'
import {
  View, Text, ListItem, Body, Right
} from 'native-base'
import { getSortedBookings, filterBookingBySearchText } from '../selectors'
import IconButton from '../components/iconButton'
import { Text as Sms } from 'react-native-openanything'
import { StyleSheet } from 'react-native'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import SearchBar from '../components/searchBar'
import NoData from '../components/noData'

import Translator from '../utils/translator'
const _T = Translator('PassengersScreen')

export default class BookingList extends Component {
  /**
   * currently this is just a dumb component only receiving
   * some props. So any re-render optimization is not needed
   */

  constructor (props) {
    super(props)
    this.state = {
      searchText: ''
    }
  }

  _renderBooking = ({ item }) => {
    const id = item.get('id')
    const pax = item.get('pax')
    const sortedPax = pax.sortBy(p => `${p.get('firstName')} ${p.get('lastName')}`)
    const paxNames = sortedPax.map(p => <Text note key={p.get('id')}>{`${p.get('firstName')} ${p.get('lastName')}`}</Text>)
    const phones = pax.filter(p => p.get('phone')).map(p => p.get('phone')).join(',')
    return (
      <ListItem onPress={() => {}}>
        <Body>
          <Text>{id}</Text>
          {paxNames}
        </Body>
        <Right>
          {!!phones && <IconButton name='sms' color='blue' onPress={() => Sms(phones)} />}
        </Right>
      </ListItem>
    )
  }

  _renderList = trip => {
    const { searchText } = this.state
    let bookings = getSortedBookings(trip)
    if (searchText) {
      bookings = filterBookingBySearchText(bookings, searchText)
    }
    return (
      bookings.size
        ? <ImmutableVirtualizedList
          keyboardShouldPersistTaps='always'
          immutableData={bookings}
          renderItem={this._renderBooking}
          keyExtractor={item => String(item.get('id'))}
        />
        : <NoData text='No match found' textStyle={{ marginTop: 30 }} />
    )
  }

  _onSearch = searchText => {
    this.setState({ searchText })
  }

  render () {
    const { trip } = this.props
    const bookings = trip.get('bookings')
    return (
      <View style={ss.container}>
        <SearchBar
          onSearch={this._onSearch}
          icon='booking'
          placeholder={_T('bookingSearch')}
        />
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
