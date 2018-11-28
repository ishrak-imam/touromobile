
import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import {
  Container, View, ListItem, Left,
  CheckBox, Body, Text, Title
} from 'native-base'
import { Colors, IonIcon } from '../../theme'
import Header from '../../components/header'
import { connect } from 'react-redux'
import Translator from '../../utils/translator'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import {
  getTrips, getSortedPax, getSortedPaxByHotel,
  getSortedPaxByAirport, filterPaxBySearchText,
  getPaxData, getPaxDataGroupByHotel, getPaxDataGroupByAirport,
  getSortedPaxByBookingId, paxDataGroupByBooking,
  getPresents, getPax
} from '../../selectors'
import SearchBar from '../../components/searchBar'
import ContextMenu from '../../components/contextMenu'
import NoData from '../../components/noData'
import { actionDispatcher } from '../../utils/actionDispatcher'
import { addToPresent, removeFromPresent, resetPresent } from './action'

const _T = Translator('RollCallScreen')

const CONTEXT_OPTIONS = {
  name: { text: 'name', key: 'NAME', icon: 'person' },
  hotel: { text: 'hotel', key: 'HOTEL', icon: 'home' },
  airport: { text: 'airport', key: 'AIRPORT', icon: 'flight' },
  booking: { text: 'booking', key: 'BOOKING', icon: 'booking' }
}

class PaxItem extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.pax.equals(this.props.pax) ||
            nextProps.selected !== this.props.selected
  }

  render () {
    const { pax, selected, onItemPress } = this.props
    const paxId = String(pax.get('id'))
    const name = `${pax.get('firstName')} ${pax.get('lastName')}`
    const bookingId = pax.get('booking').get('id')
    return (
      <ListItem style={ss.listItem} onPress={onItemPress(paxId)}>
        <Left style={{ flex: 1 }}>
          <CheckBox disabled checked={selected} />
        </Left>
        <Body style={ss.itemBody}>
          <View style={{ flex: 1 }}>
            <Text>{bookingId}</Text>
          </View>
          <View style={{ flex: 3 }}>
            <Text numberOfLines={1}>{name}</Text>
          </View>
        </Body>
      </ListItem>
    )
  }
}

class RollCallScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchText: '',
      groupBy: CONTEXT_OPTIONS.name.key
    }
  }

  _onSelect = option => {
    this.setState({ groupBy: option.key })
  }

  _renderRight = () => {
    const { trips } = this.props
    const trip = trips.get('current').get('trip')

    let options = [CONTEXT_OPTIONS.name, CONTEXT_OPTIONS.booking]

    const hotels = trip.get('hotels')
    const transport = trip.get('transport')

    const isHotels = hotels && hotels.size
    const isFlight = transport ? transport.get('type') === 'flight' : false

    if (isHotels) options.push(CONTEXT_OPTIONS.hotel)
    if (isFlight) options.push(CONTEXT_OPTIONS.airport)

    return (
      <ContextMenu
        icon='sort'
        label='sortOrder'
        onSelect={this._onSelect}
        options={options}
      />
    )
  }

  _onSearch = searchText => {
    this.setState({ searchText })
  }

  _onItemPress = paxId => {
    const { presents } = this.props
    return () => {
      presents.has(paxId)
        ? actionDispatcher(removeFromPresent(paxId))
        : actionDispatcher(addToPresent(paxId))
    }
  }

  _renderPerson = ({ item }) => {
    const { trips, presents } = this.props
    const trip = trips.get('current').get('trip')
    const hotels = trip.get('hotels')

    if (item.get('first')) {
      const { groupBy } = this.state
      let text = String(item.get('initial'))
      if (groupBy === CONTEXT_OPTIONS.hotel.key) {
        text = hotels.find(h => String(h.get('id')) === text).get('name')
      }
      return (
        <ListItem itemDivider style={ss.sectionHeader}>
          <Text style={ss.sectionText}>{text}</Text>
        </ListItem>
      )
    }

    const paxId = String(item.get('id'))
    return (
      <PaxItem
        pax={item}
        onItemPress={this._onItemPress}
        selected={presents.has(paxId)}
      />
    )
  }

  _renderList = trip => {
    const { searchText, groupBy } = this.state

    let sortedPax = null
    switch (groupBy) {
      case CONTEXT_OPTIONS.name.key:
        sortedPax = getSortedPax(trip)
        break
      case CONTEXT_OPTIONS.hotel.key:
        sortedPax = getSortedPaxByHotel(trip)
        break
      case CONTEXT_OPTIONS.airport.key:
        sortedPax = getSortedPaxByAirport(trip)
        break
      case CONTEXT_OPTIONS.booking.key:
        sortedPax = getSortedPaxByBookingId(trip)
        break
    }

    if (searchText) {
      sortedPax = filterPaxBySearchText(sortedPax, searchText)
    }

    let paxList = null
    switch (groupBy) {
      case CONTEXT_OPTIONS.name.key:
        paxList = getPaxData(sortedPax)
        break
      case CONTEXT_OPTIONS.hotel.key:
        paxList = getPaxDataGroupByHotel(sortedPax)
        break
      case CONTEXT_OPTIONS.airport.key:
        paxList = getPaxDataGroupByAirport(sortedPax)
        break
      case CONTEXT_OPTIONS.booking.key:
        paxList = paxDataGroupByBooking(sortedPax)
        break
    }

    return (
      paxList.size
        ? <ImmutableVirtualizedList
          contentContainerStyle={{ paddingBottom: 30 }}
          keyboardShouldPersistTaps='always'
          immutableData={paxList}
          renderItem={this._renderPerson}
          keyExtractor={item => String(item.get('id'))}
        />
        : <NoData text='noMatch' textStyle={{ marginTop: 30 }} />
    )
  }

  _onHeaderRightPress = () => {
    actionDispatcher(resetPresent())
  }

  _renderHeaderRight = () => {
    return (
      <TouchableOpacity style={ss.reset} onPress={this._onHeaderRightPress}>
        <IonIcon name='refresh' color={Colors.white} size={30} />
      </TouchableOpacity>
    )
  }

  _renderCenter = trip => {
    const { presents } = this.props
    const pax = getPax(trip)
    return (
      <Title style={ss.headerCenterText}>{`${presents.size}/${pax.size}`}</Title>
    )
  }

  render () {
    const { navigation, trips } = this.props
    const trip = trips.get('current').get('trip')
    const bookings = trip.get('bookings')
    const brand = trip.get('brand')

    return (
      <Container>
        <Header
          left='back'
          title={_T('title')}
          navigation={navigation}
          brand={brand}
          center={this._renderCenter(trip)}
          right={this._renderHeaderRight()}
        />
        <View style={ss.container}>
          <SearchBar
            onSearch={this._onSearch}
            icon='people'
            placeholder={_T('paxSearch')}
            right={this._renderRight()}
          />
          {!!bookings && this._renderList(trip)}
        </View>
      </Container>
    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state),
  presents: getPresents(state)
})

export default connect(stateToProps, null)(RollCallScreen)

const ss = StyleSheet.create({
  container: {
    flex: 1
  },
  sectionText: {
    fontWeight: 'bold',
    color: Colors.silver
  },
  itemBody: {
    flexDirection: 'row',
    flex: 7,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  sectionHeader: {
    backgroundColor: Colors.blue
  },
  listItem: {
    marginLeft: 10
  },
  reset: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 10
  },
  headerCenterText: {
    marginLeft: 20,
    color: Colors.white
  }
})
