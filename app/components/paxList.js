
import React, { Component } from 'react'
import {
  View, Text, ListItem, Body, Right, Left
} from 'native-base'
import {
  getSortedPax, getPaxData, getSortedPaxByAirport, getSortedPaxByHotel,
  filterPaxBySearchText, getModifiedPax, getPaxDataGroupByAirport,
  getPaxDataGroupByHotel
} from '../selectors'
import { call, sms } from '../utils/comms'
import { StyleSheet } from 'react-native'
import SearchBar from '../components/searchBar'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { Colors, IonIcon } from '../theme'
import Translator from '../utils/translator'
import NoData from '../components/noData'
import { connect } from 'react-redux'
import { mergeMapShallow } from '../utils/immutable'
import ContextMenu from './contextMenu'

const _T = Translator('PassengersScreen')

const CONTEXT_OPTIONS = {
  name: { text: 'name', key: 'NAME', icon: 'person' },
  hotel: { text: 'hotel', key: 'HOTEL', icon: 'home' },
  airport: { text: 'airport', key: 'AIRPORT', icon: 'flight' }
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
            nextState.comment !== this.state.comment
  }

  _renderPhone = number => <IonIcon name='phone' color='green' onPress={() => call(number)} />

  _renderSMS = number => <IonIcon name='sms' color='blue' onPress={() => sms(number)} />

  _commentToggle = () => {
    const { comment } = this.state
    const name = comment ? 'up' : 'info'
    return (
      <IonIcon
        name={name} color='black'
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
    const { pax, onItemPress, hotels } = this.props
    const { comment } = this.state
    const isHotels = hotels && hotels.size

    if (pax.get('first')) {
      const { groupBy } = this.props
      let text = String(pax.get('initial'))
      if (groupBy === CONTEXT_OPTIONS.hotel.key) {
        text = hotels.find(h => String(h.get('id')) === text).get('name')
      }

      return (
        <ListItem itemDivider style={{ backgroundColor: Colors.blue }}>
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
      <ListItem style={{ marginLeft: 0, paddingRight: 5 }} onPress={onItemPress(pax)}>
        <Left style={ss.itemLeft}>
          {!!airport && this._renderAirport(airport)}
          {!!hotelId && isHotels && this._renderHotel(String(hotelId), hotels)}
        </Left>
        <Body style={ss.itemBody}>
          <Text numberOfLines={1}>{name}</Text>
          {/* <Text note>{pax.get('booking').get('id')}</Text> */}
          {comment && <Text note>{paxComment}</Text>}
        </Body>
        <Right style={ss.itemRight}>
          {!!paxComment && this._commentToggle()}
          {!!phone && this._renderPhone(phone)}
          {!!phone && this._renderSMS(phone)}
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
      groupBy: CONTEXT_OPTIONS.name.key
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
    return () => {
      navigation.navigate('PaxDetails', { brand, pax, departureId })
    }
  }

  _renderPerson = ({ item }) => {
    const { modifiedPax, trip } = this.props
    const { groupBy } = this.state
    const paxId = String(item.get('id'))
    const pax = mergeMapShallow(item, modifiedPax.get(paxId))
    return (
      <PaxItem
        pax={pax}
        onItemPress={this._toPaxDetails}
        groupBy={groupBy}
        hotels={trip.get('hotels')}
      />
    )
  }

  _onSearch = searchText => {
    this.setState({ searchText })
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
    }

    return (
      paxList.size
        ? <ImmutableVirtualizedList
          keyboardShouldPersistTaps='always'
          immutableData={paxList}
          renderItem={this._renderPerson}
          keyExtractor={item => String(item.get('id'))}
        />
        : <NoData text='noMatch' textStyle={{ marginTop: 30 }} />
    )
  }

  _onSelect = option => {
    this.setState({ groupBy: option.key })
  }

  _renderRight = () => {
    const { trip } = this.props

    let options = [CONTEXT_OPTIONS.name]

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

  render () {
    const { trip } = this.props
    const bookings = trip.get('bookings')
    return (
      <View style={ss.container}>
        <SearchBar
          onSearch={this._onSearch}
          icon='people'
          placeholder={_T('paxSearch')}
          right={this._renderRight()}
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

export default connect(stateToProps, null)(PaxList)

const ss = StyleSheet.create({
  container: {
    flex: 1
  },
  itemLeft: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  itemBody: {
    flex: 4
  },
  itemRight: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  sectionText: {
    fontWeight: 'bold',
    color: Colors.silver
  },
  airportCon: {
    height: 20,
    width: 37,
    borderWidth: 1,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  airportText: {
    fontSize: 12
  }
})
