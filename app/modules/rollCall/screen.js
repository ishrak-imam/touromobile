
import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import {
  Container, View, ListItem, Left,
  CheckBox, Body, Text, Title
} from 'native-base'
import { Colors, IonIcon } from '../../theme'
import Header from '../../components/header'
import { connect } from 'react-redux'
import Translator from '../../utils/translator'
import {

  currentTripSelector, getPax, getPresents,
  getSortedPaxByFirstName, getPaxDataGroupByFirstName,
  getSortedPaxByLastName, getPaxDataGroupByLastName,
  getSortedPaxByAirport, getPaxDataGroupByAirport,
  getSortedPaxByHotel, getPaxDataGroupByHotel,
  getSortedPaxByBookingId, getPaxDataGroupByBooking,
  filterPaxBySearchText,
  checkIfFlightTrip

} from '../../selectors'
import isIphoneX from '../../utils/isIphoneX'
import SearchBar from '../../components/searchBar'
import ContextMenu from '../../components/contextMenu'
import NoData from '../../components/noData'
import { actionDispatcher } from '../../utils/actionDispatcher'
import { addToPresent, removeFromPresent, resetPresent } from './action'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'

const { width } = Dimensions.get('window')

const dataProvider = new DataProvider((r1, r2) => {
  return r1 !== r2
})

const layoutProvider = new LayoutProvider(
  () => 'type', (_, dim) => { dim.width = width; dim.height = 53 }
)

const _T = Translator('RollCallScreen')

const CONTEXT_OPTIONS = {
  firstName: { text: 'firstName', key: 'FIRST_NAME', icon: 'person' },
  lastName: { text: 'lastName', key: 'LAST_NAME', icon: 'person' },
  // name: { text: 'name', key: 'NAME', icon: 'person' },
  hotel: { text: 'hotel', key: 'HOTEL', icon: 'home' },
  airport: { text: 'airport', key: 'AIRPORT', icon: 'flight' },
  booking: { text: 'booking', key: 'BOOKING', icon: 'booking' }
}

class PaxItem extends Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.pax.id !== this.props.pax.id ||
            nextProps.selected !== this.props.selected
  }

  render () {
    const { pax, selected, onItemPress } = this.props
    const paxId = String(pax.id)
    const name = `${pax.firstName} ${pax.lastName}`
    const bookingId = pax.booking.id
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
      groupBy: CONTEXT_OPTIONS.firstName.key
    }
  }

  _onSelect = option => {
    this.setState({ groupBy: option.key })
  }

  _renderRight = () => {
    const { currentTrip } = this.props
    const trip = currentTrip.get('trip')

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

  _renderPerson = (type, item) => {
    const { currentTrip, presents } = this.props
    const trip = currentTrip.get('trip')
    const hotels = trip.get('hotels')

    if (item.first) {
      const { groupBy } = this.state
      let text = String(item.initial)
      if (groupBy === CONTEXT_OPTIONS.hotel.key) {
        text = hotels.find(h => String(h.get('id')) === text).get('name')
      }
      return (
        <ListItem itemDivider style={ss.sectionHeader}>
          <Text style={ss.sectionText}>{text}</Text>
        </ListItem>
      )
    }

    const paxId = String(item.id)
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
      case CONTEXT_OPTIONS.firstName.key:
        sortedPax = getSortedPaxByFirstName(trip)
        break
      case CONTEXT_OPTIONS.lastName.key:
        sortedPax = getSortedPaxByLastName(trip)
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
      case CONTEXT_OPTIONS.firstName.key:
        paxList = getPaxDataGroupByFirstName(sortedPax)
        break
      case CONTEXT_OPTIONS.lastName.key:
        paxList = getPaxDataGroupByLastName(sortedPax)
        break
      case CONTEXT_OPTIONS.hotel.key:
        paxList = getPaxDataGroupByHotel(sortedPax)
        break
      case CONTEXT_OPTIONS.airport.key:
        paxList = getPaxDataGroupByAirport(sortedPax)
        break
      case CONTEXT_OPTIONS.booking.key:
        paxList = getPaxDataGroupByBooking(sortedPax)
        break
    }

    return (
      paxList.size
        ? <RecyclerListView
          contentContainerStyle={ss.listView}
          dataProvider={dataProvider.cloneWithRows(paxList.toJS())}
          rowRenderer={this._renderPerson}
          layoutProvider={layoutProvider}
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
    const { navigation, currentTrip } = this.props
    const trip = currentTrip.get('trip')
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
  currentTrip: currentTripSelector(state),
  presents: getPresents(state)
})

export default connect(stateToProps, null)(RollCallScreen)

const ss = StyleSheet.create({
  container: {
    flex: 1
  },
  listView: {
    paddingBottom: isIphoneX ? 30 : 10
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
