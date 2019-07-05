
import React, { Component } from 'react'
import { Container, ListItem, Right } from 'native-base'
import { StyleSheet, View, Text } from 'react-native'
import Header from '../../components/header'
import { connect } from 'react-redux'
import {
  getModifiedPax,
  // checkIfFlightTrip,
  getSortedPax, filterPaxBySearchText,
  getPaxDataGroup, getHideMyPhone
} from '../../selectors'
import _T from '../../utils/translator'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { mergeMapShallow, getSet } from '../../utils/immutable'
import { Colors, IonIcon } from '../../theme'
import ContextMenu from '../../components/contextMenu'
import SearchBar from '../../components/searchBar'
import { call, sms } from '../../utils/comms'
import { navigate } from '../../navigation/service'

const CONTEXT_OPTIONS = {
  firstName: { text: 'firstName', key: 'FIRST_NAME', icon: 'person' },
  lastName: { text: 'lastName', key: 'LAST_NAME', icon: 'person' },
  // name: { text: 'name', key: 'NAME', icon: 'person' },
  // hotel: { text: 'hotel', key: 'HOTEL', icon: 'home' },
  // airport: { text: 'airport', key: 'AIRPORT', icon: 'flight' },
  booking: { text: 'booking', key: 'BOOKING', icon: 'booking' }
}

class LinePaxScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      searchText: '',
      groupBy: CONTEXT_OPTIONS.firstName.key
    }
  }

  _sms = (phone, brand) => {
    const { hideMyPhone } = this.props
    hideMyPhone
      ? navigate('SMS', { numbers: getSet([phone]), brand })
      : sms(phone)
  }

  _renderPhone = number => (
    <IonIcon name='phone' color={Colors.green} onPress={() => call(number)} />
  )

  _renderSMS = (number, brand) => (
    <IonIcon name='sms' color={Colors.blue} onPress={() => this._sms(number, brand)} />
  )

  _renderPaxItem = trip => {
    const brand = trip.get('brand')
    // const hotels = trip.get('hotels')
    const { modifiedPax } = this.props

    return ({ item }) => {
      if (item.get('first')) {
        // const { groupBy } = this.state
        let text = String(item.get('initial'))
        // if (groupBy === CONTEXT_OPTIONS.hotel.key) {
        //   text = hotels.find(h => String(h.get('id')) === text).get('name')
        // }

        return (
          <ListItem itemDivider style={ss.itemDivider}>
            <Text style={ss.sectionText}>{text}</Text>
          </ListItem>
        )
      }

      const paxId = String(item.get('id'))
      const mPax = modifiedPax.get(paxId)
      let pax = item
      if (mPax && mPax.size) {
        pax = mergeMapShallow(item, mPax)
      }
      const name = `${pax.get('firstName')} ${pax.get('lastName')}`
      const phone = pax.get('phone')

      return (
        <ListItem style={ss.listItem}>

          <View style={ss.itemBody}>
            <Text style={ss.name} numberOfLines={2}>{name}</Text>
          </View>

          <Right style={ss.itemRight}>
            <View style={ss.iconCon}>
              {!!phone && this._renderPhone(phone)}
            </View>
            <View style={ss.iconCon}>
              {!!phone && this._renderSMS(phone, brand)}
            </View>
          </Right>
        </ListItem>

      )
    }
  }

  _onSelect = option => {
    this.setState({ groupBy: option.key })
  }

  _onSearch = searchText => {
    this.setState({ searchText })
  }

  _renderRight = trip => {
    let options = [
      CONTEXT_OPTIONS.firstName,
      CONTEXT_OPTIONS.lastName,
      CONTEXT_OPTIONS.booking
    ]

    // const hotels = trip.get('hotels')
    // const isHotels = hotels && hotels.size
    // const isFlight = checkIfFlightTrip(trip)

    // if (isHotels) options.push(CONTEXT_OPTIONS.hotel)
    // if (isFlight) options.push(CONTEXT_OPTIONS.airport)

    return (
      <ContextMenu
        icon='sort'
        label='sortOrder'
        onSelect={this._onSelect}
        options={options}
      />
    )
  }

  _renderPaxList = (paxList, trip) => {
    const { searchText, groupBy } = this.state

    let sortedPax = paxList
    switch (groupBy) {
      case CONTEXT_OPTIONS.firstName.key:
        sortedPax = getSortedPax(sortedPax, CONTEXT_OPTIONS.firstName.text)
        break
      case CONTEXT_OPTIONS.lastName.key:
        sortedPax = getSortedPax(sortedPax, CONTEXT_OPTIONS.lastName.text)
        break
      // case CONTEXT_OPTIONS.hotel.key:
      //   sortedPax = getSortedPax(sortedPax, CONTEXT_OPTIONS.hotel.text)
      //   break
      // case CONTEXT_OPTIONS.airport.key:
      //   sortedPax = getSortedPax(sortedPax, CONTEXT_OPTIONS.airport.text)
      //   break
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
      // case CONTEXT_OPTIONS.hotel.key:
      //   sortedPax = getPaxDataGroup(sortedPax, CONTEXT_OPTIONS.hotel.text)
      //   break
      // case CONTEXT_OPTIONS.airport.key:
      //   sortedPax = getPaxDataGroup(sortedPax, CONTEXT_OPTIONS.airport.text)
      //   break
      case CONTEXT_OPTIONS.booking.key:
        sortedPax = getPaxDataGroup(sortedPax, CONTEXT_OPTIONS.booking.text)
        break
    }

    return (
      <ImmutableVirtualizedList
        keyboardShouldPersistTaps='always'
        immutableData={sortedPax}
        renderItem={this._renderPaxItem(trip)}
        keyExtractor={item => String(item.get('id'))}
        renderEmpty={_T('noMatch')}
      />
    )
  }

  render () {
    const { navigation } = this.props
    const paxList = navigation.getParam('paxList')
    const brand = navigation.getParam('brand')
    const trip = navigation.getParam('trip')
    const title = `${_T('pax')} (${paxList.size})`
    return (
      <Container>
        <Header title={title} left='back' navigation={navigation} brand={brand} />

        <SearchBar
          onSearch={this._onSearch}
          icon='people'
          placeholder={_T('search')}
          right={this._renderRight(trip)}
        />
        {this._renderPaxList(paxList, trip)}
      </Container>
    )
  }
}

const stateToProps = (state, props) => {
  const { navigation } = props
  const trip = navigation.getParam('trip')
  const departureId = String(trip.get('departureId'))
  return {
    modifiedPax: getModifiedPax(state, departureId),
    hideMyPhone: getHideMyPhone(state)
  }
}

export default connect(stateToProps, null)(LinePaxScreen)

const ss = StyleSheet.create({
  list: {
    paddingBottom: 20
  },
  paxItem: {
    height: 50,
    width: '100%',
    paddingHorizontal: 10,
    justifyContent: 'center',
    borderBottomWidth: 1
  },
  sectionText: {
    fontWeight: 'bold',
    color: Colors.silver
  },
  itemDivider: {
    backgroundColor: Colors.blue
  },
  listItem: {
    marginLeft: 0,
    paddingRight: 0,
    marginRight: 0
  },
  itemBody: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginLeft: 15
  },
  name: {
    fontSize: 15
  },
  itemRight: {
    flex: 2.5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  iconCon: {
    height: 22,
    width: 22
  }
})
