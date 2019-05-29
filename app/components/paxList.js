
import React, { Component } from 'react'
import {
  View, ListItem, Right, Left
} from 'native-base'

import {
  getSortedPax, getPaxDataGroup, getPax,
  filterPaxBySearchText, getModifiedPax,
  checkIfFlightTrip, getTransportType
} from '../selectors'

import { call, sms } from '../utils/comms'
import { StyleSheet, Text } from 'react-native'
import SearchBar from '../components/searchBar'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { Colors, IonIcon } from '../theme'
import _T from '../utils/translator'
import { connect } from 'react-redux'
import { mergeMapShallow } from '../utils/immutable'
import ContextMenu from './contextMenu'

const CONTEXT_OPTIONS = {
  firstName: { text: 'firstName', key: 'FIRST_NAME', icon: 'person' },
  lastName: { text: 'lastName', key: 'LAST_NAME', icon: 'person' },
  // name: { text: 'name', key: 'NAME', icon: 'person' },
  hotel: { text: 'hotel', key: 'HOTEL', icon: 'home' },
  airport: { text: 'airport', key: 'AIRPORT', icon: 'flight' },
  booking: { text: 'booking', key: 'BOOKING', icon: 'booking' }
}

class PaxItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      comment: false
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !nextProps.pax.equals(this.props.pax) ||
            nextState.comment !== this.state.comment ||
            nextProps.tripType !== this.props.tripType
  }

  _renderPhone = number => (
    <IonIcon name='phone' color={Colors.green} onPress={() => call(number)} />
  )

  _renderSMS = number => (
    <IonIcon name='sms' color={Colors.blue} onPress={() => sms(number)} />
  )

  _commentToggle = () => {
    const { comment } = this.state
    const name = comment ? 'up' : 'info'
    return (
      <IonIcon
        name={name} color={Colors.black}
        onPress={() => this.setState({ comment: !this.state.comment })}
      />
    )
  }

  _renderAirport = airport => {
    return (
      <View style={ss.airportCon}>
        <Text style={ss.airportText}>{airport}</Text>
      </View>
    )
  }

  _renderHotel = (hotelId, hotels) => {
    let index = hotels.findIndex(h => String(h.get('id')) === hotelId)
    return (
      <Text style={{ fontWeight: 'bold' }}>{`H${++index}`}</Text>
    )
  }

  render () {
    const { pax, onItemPress, hotels, tripType } = this.props
    const { comment } = this.state
    const isHotels = hotels && hotels.size

    if (pax.get('first')) {
      const { groupBy } = this.props
      let text = String(pax.get('initial'))
      if (groupBy === CONTEXT_OPTIONS.hotel.key) {
        text = hotels.find(h => String(h.get('id')) === text).get('name')
      }

      return (
        <ListItem itemDivider style={ss.itemDivider}>
          <Text style={ss.sectionText}>{text}</Text>
        </ListItem>
      )
    }

    const paxComment = pax.get('comment')
    const phone = pax.get('phone')
    const name = `${pax.get('firstName')} ${pax.get('lastName')}`
    const airport = pax.get('airport')
    const hotelId = pax.get('hotel')
    return (
      <ListItem style={ss.listItem} onPress={onItemPress(pax)}>
        <Left style={ss.itemLeft}>
          {
            (!!airport && tripType === 'flight') &&
            <View style={ss.iconCon}>
              {/* {(!!airport && tripType === 'flight') && this._renderAirport(airport)} */}
              {this._renderAirport(airport)}
            </View>
          }
          <View style={ss.iconCon}>
            {!!hotelId && isHotels && this._renderHotel(String(hotelId), hotels)}
          </View>
        </Left>
        <View style={ss.itemBody}>
          <Text style={ss.name} numberOfLines={2}>{name}</Text>
          {comment && <Text style={ss.comment}>{paxComment}</Text>}
        </View>
        <Right style={ss.itemRight}>
          <View style={ss.iconCon}>
            {!!paxComment && this._commentToggle()}
          </View>
          <View style={ss.iconCon}>
            {!!phone && this._renderPhone(phone)}
          </View>
          <View style={ss.iconCon}>
            {!!phone && this._renderSMS(phone)}
          </View>

        </Right>
      </ListItem>
    )
  }
}

class PaxList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchText: '',
      groupBy: CONTEXT_OPTIONS.firstName.key
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !nextProps.trip.equals(this.props.trip) ||
            nextState.searchText !== this.state.searchText ||
            !nextProps.modifiedPax.equals(this.props.modifiedPax) ||
            nextState.groupBy !== this.state.groupBy
  }

  _toPaxDetails = pax => {
    const { navigation, trip } = this.props
    const departureId = String(trip.get('departureId'))
    const brand = trip.get('brand')
    const isFlight = checkIfFlightTrip(trip)
    return () => {
      navigation.navigate('PaxDetails', { brand, pax, departureId, isFlight })
    }
  }

  _renderPerson = tripType => {
    const { modifiedPax, trip } = this.props
    const { groupBy } = this.state
    return ({ item }) => {
      const paxId = String(item.get('id'))
      const pax = mergeMapShallow(item, modifiedPax.get(paxId))
      return (
        <PaxItem
          pax={pax}
          onItemPress={this._toPaxDetails}
          groupBy={groupBy}
          hotels={trip.get('hotels')}
          tripType={tripType}
        />
      )
    }
  }

  _onSearch = searchText => {
    this.setState({ searchText })
  }

  _renderList = (tripType, trip) => {
    const { searchText, groupBy } = this.state

    let sortedPax = getPax(trip)
    switch (groupBy) {
      case CONTEXT_OPTIONS.firstName.key:
        sortedPax = getSortedPax(sortedPax, CONTEXT_OPTIONS.firstName.text)
        break
      case CONTEXT_OPTIONS.lastName.key:
        sortedPax = getSortedPax(sortedPax, CONTEXT_OPTIONS.lastName.text)
        break
      case CONTEXT_OPTIONS.hotel.key:
        sortedPax = getSortedPax(sortedPax, CONTEXT_OPTIONS.hotel.text)
        break
      case CONTEXT_OPTIONS.airport.key:
        sortedPax = getSortedPax(sortedPax, CONTEXT_OPTIONS.airport.text)
        break
      case CONTEXT_OPTIONS.booking.key:
        sortedPax = getSortedPax(sortedPax, CONTEXT_OPTIONS.booking.text)
        break
    }

    if (searchText) {
      sortedPax = filterPaxBySearchText(sortedPax, searchText)
    }

    switch (groupBy) {
      case CONTEXT_OPTIONS.firstName.key:
        sortedPax = getPaxDataGroup(sortedPax, CONTEXT_OPTIONS.firstName.text)
        break
      case CONTEXT_OPTIONS.lastName.key:
        sortedPax = getPaxDataGroup(sortedPax, CONTEXT_OPTIONS.lastName.text)
        break
      case CONTEXT_OPTIONS.hotel.key:
        sortedPax = getPaxDataGroup(sortedPax, CONTEXT_OPTIONS.hotel.text)
        break
      case CONTEXT_OPTIONS.airport.key:
        sortedPax = getPaxDataGroup(sortedPax, CONTEXT_OPTIONS.airport.text)
        break
      case CONTEXT_OPTIONS.booking.key:
        sortedPax = getPaxDataGroup(sortedPax, CONTEXT_OPTIONS.booking.text)
        break
    }

    return (
      <ImmutableVirtualizedList
        keyboardShouldPersistTaps='always'
        immutableData={sortedPax}
        renderItem={this._renderPerson(tripType)}
        keyExtractor={item => String(item.get('id'))}
        renderEmpty={_T('noMatch')}
      />
    )
  }

  _onSelect = option => {
    this.setState({ groupBy: option.key })
  }

  _renderRight = () => {
    const { trip } = this.props

    let options = [
      CONTEXT_OPTIONS.firstName,
      CONTEXT_OPTIONS.lastName,
      CONTEXT_OPTIONS.booking
    ]

    const hotels = trip.get('hotels')
    const isHotels = hotels && hotels.size
    const isFlight = checkIfFlightTrip(trip)

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

  render () {
    const { trip } = this.props
    const bookings = trip.get('bookings')
    const tripType = getTransportType(trip)
    return (
      <View style={ss.container}>
        <SearchBar
          onSearch={this._onSearch}
          icon='people'
          placeholder={_T('search')}
          right={this._renderRight()}
        />
        {!!bookings && this._renderList(tripType, trip)}
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

export default connect(stateToProps, null)(PaxList)

const ss = StyleSheet.create({
  container: {
    flex: 1
  },
  itemLeft: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  itemBody: {
    flex: 3.5,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  name: {
    fontSize: 15
  },
  comment: {
    marginTop: 5,
    color: Colors.steel
  },
  itemRight: {
    flex: 3,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  sectionText: {
    fontWeight: 'bold',
    color: Colors.silver
  },
  airportCon: {
    height: 22,
    width: 34,
    borderWidth: 1,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center'
  },
  airportText: {
    fontSize: 12
  },
  iconCon: {
    height: 22,
    width: 22
  },
  listItem: {
    marginLeft: 0,
    paddingRight: 0,
    marginRight: 0
  },
  itemDivider: {
    backgroundColor: Colors.blue
  }
})
