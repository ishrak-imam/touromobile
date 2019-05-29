
import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Dimensions, Text } from 'react-native'
import {
  Container, View, ListItem, Title
} from 'native-base'
import { Colors, IonIcon } from '../../theme'
import Header from '../../components/header'
import { connect } from 'react-redux'
import _T from '../../utils/translator'
import {
  currentTripSelector, getPresents,
  getPax, getSortedPax, getPaxDataGroup,
  filterPaxBySearchText, checkIfFlightTrip
} from '../../selectors'
import isIphoneX from '../../utils/isIphoneX'
import SearchBar from '../../components/searchBar'
import ContextMenu from '../../components/contextMenu'
import NoData from '../../components/noData'
import { actionDispatcher } from '../../utils/actionDispatcher'
import { addToPresent, removeFromPresent, resetPresent } from './action'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import CheckBox from '../../components/checkBox'
import { showModal } from '../../modal/action'
import Swipeout from 'react-native-swipeout'

const { width } = Dimensions.get('window')

const dataProvider = new DataProvider((r1, r2) => {
  return r1 !== r2
})

const layoutProvider = new LayoutProvider(
  () => 'type', (_, dim) => { dim.width = width; dim.height = 53 }
)

const CONTEXT_OPTIONS = {
  firstName: { text: 'firstName', key: 'FIRST_NAME', icon: 'person' },
  lastName: { text: 'lastName', key: 'LAST_NAME', icon: 'person' },
  // name: { text: 'name', key: 'NAME', icon: 'person' },
  hotel: { text: 'hotel', key: 'HOTEL', icon: 'home' },
  airport: { text: 'airport', key: 'AIRPORT', icon: 'flight' },
  booking: { text: 'booking', key: 'BOOKING', icon: 'booking' }
}

// const AddOrRemoveBtn = ({ selected, onPress }) => {
//   const text = selected ? 'Remove' : 'Add'
//   const backgroundColor = selected ? Colors.fire : Colors.green
//   return (
//     <TouchableOpacity style={[ss.swipeBtn, { backgroundColor }]} onPress={onPress}>
//       <Text style={{ color: Colors.white }}>{text}</Text>
//     </TouchableOpacity>
//   )
// }

class PaxItem extends Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.pax.id !== this.props.pax.id ||
            nextProps.selected !== this.props.selected
  }

  _onSwipeOpen = paxId => (sId, rId, direction) => {
    const { onAdd, onRemove } = this.props
    if (direction && direction === 'left') {
      onAdd(paxId)
      this.forceUpdate()
    }

    if (direction && direction === 'right') {
      onRemove(paxId)
      this.forceUpdate()
    }
  }

  render () {
    const { pax, selected, onItemPress } = this.props
    const paxId = String(pax.id)
    const name = `${pax.firstName} ${pax.lastName}`
    const bookingId = pax.booking.id

    // onPress={onItemPress(paxId)}

    // const swipeBtn = [
    //   {
    //     // component: <AddOrRemoveBtn selected={selected} onPress={onItemPress(paxId)} />
    //     text: selected ? 'Remove' : 'Add',
    //     backgroundColor: selected ? Colors.fire : Colors.green,
    //     color: Colors.white,
    //     onPress: onItemPress(paxId)
    //   }
    // ]

    const leftSwipe = [{
      text: _T('add'),
      backgroundColor: Colors.green,
      color: Colors.white
    }]

    const rightSwipe = [{
      text: _T('remove'),
      backgroundColor: Colors.fire,
      color: Colors.white
    }]

    const swipeProps = {
      close: true,
      backgroundColor: 'transparent'
    }

    return (
      <Swipeout
        {...swipeProps}
        left={leftSwipe}
        right={rightSwipe}
        onOpen={this._onSwipeOpen(paxId)}
      >
        <View style={ss.listItem}>
          <TouchableOpacity style={{ flex: 1 }} onPress={onItemPress(paxId)}>
            <CheckBox checked={selected} />
          </TouchableOpacity>
          <View style={ss.itemBody}>
            <View style={{ flex: 1.3 }}>
              <Text style={ss.boldText}>{bookingId}</Text>
            </View>
            <View style={{ flex: 4 }}>
              <Text style={ss.text} numberOfLines={2}>{name}</Text>
            </View>
          </View>
        </View>
      </Swipeout>
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

  _onAdd = paxId => {
    const { presents } = this.props
    if (!presents.has(paxId)) {
      actionDispatcher(addToPresent(paxId))
    }
  }

  _onRemove = paxId => {
    const { presents } = this.props
    if (presents.has(paxId)) {
      actionDispatcher(removeFromPresent(paxId))
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
        onAdd={this._onAdd}
        onRemove={this._onRemove}
        selected={presents.has(paxId)}
      />
    )
  }

  _renderList = trip => {
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

    let paxList = null
    switch (groupBy) {
      case CONTEXT_OPTIONS.firstName.key:
        paxList = getPaxDataGroup(sortedPax, CONTEXT_OPTIONS.firstName.text)
        break
      case CONTEXT_OPTIONS.lastName.key:
        paxList = getPaxDataGroup(sortedPax, CONTEXT_OPTIONS.lastName.text)
        break
      case CONTEXT_OPTIONS.hotel.key:
        paxList = getPaxDataGroup(sortedPax, CONTEXT_OPTIONS.hotel.text)
        break
      case CONTEXT_OPTIONS.airport.key:
        paxList = getPaxDataGroup(sortedPax, CONTEXT_OPTIONS.airport.text)
        break
      case CONTEXT_OPTIONS.booking.key:
        paxList = getPaxDataGroup(sortedPax, CONTEXT_OPTIONS.booking.text)
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
    actionDispatcher(showModal({
      type: 'warning',
      text: _T('resetWarning'),
      onOk: this._onWarningModalOk
    }))
  }

  _onWarningModalOk = () => {
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
          title={_T('rollCall')}
          navigation={navigation}
          brand={brand}
          center={this._renderCenter(trip)}
          right={this._renderHeaderRight()}
        />
        <View style={ss.container}>
          <SearchBar
            onSearch={this._onSearch}
            icon='people'
            placeholder={_T('search')}
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
    flex: 9,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  sectionHeader: {
    backgroundColor: Colors.blue,
    height: 50

  },
  listItem: {
    height: 53,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 0,
    borderBottomWidth: 0.7,
    borderColor: Colors.steel
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
  },
  text: {
    fontSize: 15
  },
  boldText: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  swipeBtn: {
    width: 75,
    height: 53,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
