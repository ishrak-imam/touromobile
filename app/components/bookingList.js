import React, { Component } from 'react'
import {
  View, Text, ListItem, Body, Right
} from 'native-base'
import {
  getSortedBookings, getModifiedPax, getModifiedPaxByBooking,
  filterBookingBySearchText, getPhoneNumbers
} from '../selectors'
import IconButton from '../components/iconButton'
import { sms } from '../utils/comms'
import { StyleSheet } from 'react-native'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import SearchBar from '../components/searchBar'
import NoData from '../components/noData'
import { connect } from 'react-redux'
import Translator from '../utils/translator'
import { getMap } from '../utils/immutable'
const _T = Translator('PassengersScreen')

class BookingItem extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.booking.equals(this.props.booking) ||
            !nextProps.modifiedPax.equals(this.props.modifiedPax)
  }

  _sms = phones => {
    return () => {
      sms(phones)
    }
  }

  render () {
    const { booking, modifiedPax } = this.props
    const id = booking.get('id')
    const pax = booking.get('pax')
    const sortedPax = pax.sortBy(p => `${p.get('firstName')} ${p.get('lastName')}`)
    const paxNames = sortedPax.map(p => <Text note key={p.get('id')}>{`${p.get('firstName')} ${p.get('lastName')}`}</Text>)
    const phones = getPhoneNumbers(getMap({ pax, modifiedPax }))
    return (
      <ListItem>
        <Body>
          <Text>{id}</Text>
          {paxNames}
        </Body>
        <Right>
          {!!phones && <IconButton name='sms' color='blue' onPress={this._sms(phones)} />}
        </Right>
      </ListItem>
    )
  }
}

class BookingList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchText: ''
    }
  }

  _renderBooking = ({ item }) => {
    const { modifiedPax } = this.props
    const pax = item.get('pax')
    const filteredModifiedPax = getModifiedPaxByBooking(getMap({ pax, modifiedPax }))
    return (
      <BookingItem booking={item} modifiedPax={filteredModifiedPax} />
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

const stateToProps = state => ({
  modifiedPax: getModifiedPax(state)
})

export default connect(stateToProps, null)(BookingList)

const ss = StyleSheet.create({
  container: {
    flex: 1
  }
})
