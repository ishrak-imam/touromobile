import React, { Component } from 'react'
import {
  View, Text, ListItem, Body, Right
} from 'native-base'
import {
  getSortedBookings, getModifiedPax, getModifiedPaxByBooking,
  filterBookingBySearchText, getPhoneNumbers, getMeals
} from '../selectors'
import IconButton from '../components/iconButton'
import { Colors } from '../theme'
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
    const { booking, modifiedPax, onPress } = this.props
    const id = String(booking.get('id'))
    const pax = booking.get('pax')
    const sortedPax = pax.sortBy(p => `${p.get('firstName')} ${p.get('lastName')}`)
    const paxNames = sortedPax.map(p => <Text note key={p.get('id')}>{`${p.get('firstName')} ${p.get('lastName')}`}</Text>)
    const phones = getPhoneNumbers(getMap({ pax, modifiedPax }))
    return (
      <ListItem onPress={onPress(booking)}>
        <Body>
          <Text>{id}</Text>
          {paxNames}
        </Body>
        <Right>
          {!!phones && <IconButton name='sms' color={Colors.blue} onPress={this._sms(phones)} />}
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

  _toOrdersScreen = booking => {
    const { meals } = this.props
    if (!meals) return () => {}

    const { navigation, trip } = this.props
    const brand = trip.get('brand')
    const departureId = String(trip.get('departureId'))
    return () => {
      navigation.navigate('Orders', { brand, booking, departureId })
    }
  }

  _renderBooking = ({ item }) => {
    const { modifiedPax } = this.props
    const pax = item.get('pax')
    const filteredModifiedPax = getModifiedPaxByBooking(getMap({ pax, modifiedPax }))
    return (
      <BookingItem booking={item} modifiedPax={filteredModifiedPax} onPress={this._toOrdersScreen} />
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
        : <NoData text='noMatch' textStyle={{ marginTop: 30 }} />
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

const stateToProps = (state, props) => {
  const { trip } = props
  const departureId = String(trip.get('departureId'))
  return {
    modifiedPax: getModifiedPax(state, departureId),
    meals: getMeals(state)
  }
}

export default connect(stateToProps, null)(BookingList)

const ss = StyleSheet.create({
  container: {
    flex: 1
  }
})
