
import React, { Component } from 'react'
import { Container } from 'native-base'
import Header from '../../components/header'
import { StyleSheet, TouchableOpacity } from 'react-native'
import _T from '../../utils/translator'
import { connect } from 'react-redux'
import {
  getConnectionLines,
  getConnectionLineHotels,
  formatConnectionLines,
  formatConnectionLineHotels,
  currentTripSelector,
  checkIfFlightTrip,
  getPaxById,
  getPax, getPaxObjects
} from '../../selectors'
import Line from './line'
import Hotel from './hotel'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { IonIcon, Colors } from '../../theme'
import { getMap, getList } from '../../utils/immutable'

class ConnectionLines extends Component {
  static navigationOptions = () => {
    return {
      tabBarIcon: ({ focused, tintColor }) => {
        return <IonIcon name='bus' color={tintColor} />
      },
      tabBarLabel: _T('connections')
    }
  }

  constructor (props) {
    super(props)

    this.lineRefs = {}
    this.lineList = null

    this.state = {
      expand: false
    }
  }

  _onPaxItemPress = paxId => () => {
    const { navigation, currentTrip } = this.props
    const trip = currentTrip.get('trip')
    const departureId = String(trip.get('departureId'))
    const brand = trip.get('brand')
    const pax = getPaxById(trip, paxId)
    const isFlight = checkIfFlightTrip(trip)
    if (pax) navigation.navigate('PaxDetails', { brand, pax, departureId, isFlight })
  }

  _getPaxIdsFromLines = (locations, list = getList([])) => {
    return locations.reduce((list, loc) => {
      const passengers = loc.get('passengers')
      passengers.every(p => {
        list = list.push(String(p.get('id')))
        return true
      })
      const connectTo = loc.get('connectTo')
      if (connectTo.size) {
        connectTo.every(conn => {
          const locations = conn.get('locations')
          list = this._getPaxIdsFromLines(locations, list)
          return true
        })
      }
      return list
    }, list)
  }

  _getPaxIdsFromHotels = (lines, list = getList([])) => {
    return lines.reduce((list, line) => {
      const passengers = line.get('passengers')
      return passengers.reduce((list, pax) => {
        return list.push(String(pax.get('id')))
      }, list)
    }, list)
  }

  _toPaxList = (data, from) => {
    const { currentTrip, navigation } = this.props
    const trip = currentTrip.get('trip')
    const locations = data.get('locations')
    const lines = data.get('lines')
    const paxIds = from === 'lines'
      ? this._getPaxIdsFromLines(locations)
      : this._getPaxIdsFromHotels(lines)
    const paxList = getPax(trip)
    return () => {
      const linePax = getPaxObjects(paxIds, paxList)
      const brand = trip.get('brand')
      navigation.navigate('LinePax', {
        paxList: linePax,
        brand,
        trip
      })
    }
  }

  _onLineSwitchPress = (from, to) => () => {
    this.lineRefs[to].expandLine(to)

    const { lines } = this.props
    const item = lines.get(to)
    this.lineList.scrollToItem({ animated: true, item })
  }

  _renderLine = ({ item }) => {
    const { expand } = this.state
    const lineName = item.get('name')
    return <Line
      line={item}
      expand={expand}
      onLineSwitchPress={this._onLineSwitchPress}
      onPaxItemPress={this._onPaxItemPress}
      onIconPress={this._toPaxList}
      ref={ref => { this.lineRefs[lineName] = ref }}
    />
  }

  _onHeaderRightPress = () => {
    this.setState({ expand: !this.state.expand })
  }

  _renderHeaderRight = () => {
    const { expand } = this.state
    const icon = expand ? 'up' : 'down'
    return (
      <TouchableOpacity style={ss.expand} onPress={this._onHeaderRightPress}>
        <IonIcon name={icon} color={Colors.white} size={30} />
      </TouchableOpacity>
    )
  }

  _renderHotel = ({ item }) => {
    const { expand } = this.state
    return <Hotel
      expand={expand}
      hotel={item}
      onIconPress={this._toPaxList}
      onPaxItemPress={this._onPaxItemPress}
    />
  }

  _renderListFooter = hotels => {
    return (
      <ImmutableVirtualizedList
        contentContainerStyle={ss.list}
        keyboardShouldPersistTaps='always'
        immutableData={hotels.valueSeq()}
        renderItem={this._renderHotel}
        keyExtractor={item => String(item.get('id'))}
        renderEmpty=' '
      />
    )
  }

  render () {
    const { navigation, lines, hotels, currentTrip } = this.props

    const trip = currentTrip.get('trip')
    const brand = trip.get('brand')

    return (
      <Container>
        <Header
          brand={brand}
          left='menu'
          title={_T('connections')}
          navigation={navigation}
          right={this._renderHeaderRight()}
        />

        <ImmutableVirtualizedList
          contentContainerStyle={ss.list}
          keyboardShouldPersistTaps='always'
          immutableData={lines.valueSeq()}
          renderItem={this._renderLine}
          keyExtractor={item => String(item.get('name'))}
          renderEmpty={_T('noConnections')}
          ListFooterComponent={this._renderListFooter(hotels)}
          ref={ref => { this.lineList = ref }}
        />

      </Container>
    )
  }
}

const stateToProps = state => {
  const lines = getConnectionLines(state)
  const hotels = getConnectionLineHotels(state)
  return {
    lines: formatConnectionLines(lines),
    hotels: formatConnectionLineHotels(getMap({ lines, hotels })),
    currentTrip: currentTripSelector(state)
  }
}

export default connect(stateToProps, null)(ConnectionLines)

const ss = StyleSheet.create({
  list: {
    alignItems: 'center',
    paddingBottom: 20
  },
  expand: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 10
  }
})
