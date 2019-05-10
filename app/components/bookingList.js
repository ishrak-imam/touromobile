import React, { Component } from 'react'
import {
  getSortedBookings, getModifiedPax,
  filterBookingBySearchText, checkIfFlightTrip,
  getModifiedPaxByBooking
} from '../selectors'
import { View, StyleSheet } from 'react-native'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import SearchBar from '../components/searchBar'
import { connect } from 'react-redux'
import _T from '../utils/translator'
import { getMap } from '../utils/immutable'
import BookingItem from '../components/bookingItem'

class BookingList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchText: ''
    }
  }

  _toOrdersScreen = booking => {
    const { trip } = this.props
    const isFlight = checkIfFlightTrip(trip)
    if (isFlight) return () => {}

    const { navigation } = this.props
    const brand = trip.get('brand')
    const departureId = String(trip.get('departureId'))
    return () => {
      const pax = booking.get('pax')
      if (pax.size) {
        navigation.navigate('Orders', { brand, booking, departureId })
      }
    }
  }

  _renderBooking = departureId => ({ item }) => {
    const { modifiedPax } = this.props
    const pax = item.get('pax')
    const filteredModifiedPax = getModifiedPaxByBooking(getMap({ pax, modifiedPax }))
    return (
      <BookingItem
        departureId={departureId}
        booking={item}
        modifiedPax={filteredModifiedPax}
        onPress={this._toOrdersScreen}
      />
    )
  }

  _renderList = trip => {
    const { searchText } = this.state
    const departureId = String(trip.get('departureId'))
    let bookings = getSortedBookings(trip)
    if (searchText) {
      bookings = filterBookingBySearchText(bookings, searchText)
    }
    return (
      <ImmutableVirtualizedList
        keyboardShouldPersistTaps='always'
        immutableData={bookings}
        renderItem={this._renderBooking(departureId)}
        keyExtractor={item => String(item.get('id'))}
        renderEmpty={_T('noMatch')}
      />
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
          placeholder={_T('search')}
        />
        {!!bookings && this._renderList(trip)}
      </View>
    )
  }
}

const stateToProps = (state, props) => {
  const { trip } = props
  const departureId = String(trip.get('departureId'))
  return {
    modifiedPax: getModifiedPax(state, departureId)
  }
}

export default connect(stateToProps, null)(BookingList)

const ss = StyleSheet.create({
  container: {
    flex: 1
  }
})
