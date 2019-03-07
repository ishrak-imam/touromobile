
import React, { Component } from 'react'
import {
  Container, ListItem, Left, Body, Text, Right
} from 'native-base'
import SearchBar from '../../components/searchBar'
import Header from '../../components/header'
import {
  getSortedPax, getSortedPaxByBookingId,
  currentTripSelector, getPaxDataGroupByBooking,
  getParticipants, filterPaxBySearchText
} from '../../selectors'
import {
  StyleSheet, View,
  TouchableOpacity, Dimensions
} from 'react-native'
import { connect } from 'react-redux'
import { getSet, getMap } from '../../utils/immutable'
import { actionDispatcher } from '../../utils/actionDispatcher'
import { setParticipants } from '../modifiedData/action'
import { IonIcon, Colors } from '../../theme'
import Translator from '../../utils/translator'
import NoData from '../../components/noData'
import Switch from '../../components/switch'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import CheckBox from '../../components/checkBox'

const { width } = Dimensions.get('window')

const dataProvider = new DataProvider((r1, r2) => {
  return r1 !== r2
})

const layoutProvider = new LayoutProvider(
  () => 'type', (_, dim) => { dim.width = width; dim.height = 55 }
)

const PARTICIPATING = 'PARTICIPATING'
const ALL = 'ALL'

const _T = Translator('ExcursionDetailsScreen')

class PaxListItem extends Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.selected !== this.props.selected ||
            nextProps.pax.id !== this.props.pax.id
  }

  render () {
    const { pax, selected, onPress } = this.props
    const paxId = String(pax.id)
    const checked = pax.excursionPack
    const bookingId = String(pax.booking.id)
    // const key = `${paxId}${bookingId}`
    const name = `${pax.firstName} ${pax.lastName}`

    return (
      <ListItem style={ss.item} onPress={onPress(paxId, bookingId, checked)}>
        <Left style={{ flex: 1 }}>
          <CheckBox checked={checked || selected} />
        </Left>
        <Body style={ss.itemBody}>
          <View style={{ flex: 1 }}>
            <Text>{bookingId}</Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text numberOfLines={1}>{name}</Text>
          </View>
        </Body>
        <Right style={{ flex: 1 }}>
          {checked && <IonIcon name='star' color={Colors.blue} />}
        </Right>
      </ListItem>
    )
  }
}

class ExcursionDetailsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchText: '',
      filter: PARTICIPATING,
      groupByBooking: false
    }
  }

  _onPress = (paxId, bookingId, checked) => {
    const { navigation, currentTrip } = this.props
    const excursion = navigation.getParam('excursion')
    const excursionId = String(excursion.get('id'))
    const departureId = String(currentTrip.get('departureId'))
    return () => {
      if (!checked) {
        const { participants } = this.props
        const exParticipants = participants.get(excursionId) || getMap({})
        let bParticipants = exParticipants.get(bookingId) || getSet([])
        bParticipants = bParticipants.has(paxId) ? bParticipants.remove(paxId) : bParticipants.add(paxId)
        actionDispatcher(setParticipants({
          departureId,
          bookingId,
          excursionId,
          participants: bParticipants
        }))
      }
    }
  }

  _getBookingData = (bookingId, participants) => {
    const { currentTrip } = this.props
    const bookings = currentTrip.get('bookings')
    const pax = bookings.find(b => b.get('id') === bookingId).get('pax')
    const bParticipants = participants.get(bookingId) || getSet([])

    const isAllSelected = pax.reduce((flag, p) => {
      const paxId = String(p.get('id'))
      return (flag && bParticipants.has(paxId)) || p.get('excursionPack')
    }, true)

    const isAllHasPack = pax.reduce((flag, p) => {
      return flag && p.get('excursionPack')
    }, true)

    const isAnySelected = pax.some(p => {
      const paxId = String(p.get('id'))
      return bParticipants.has(paxId)
    })

    return {
      pax,
      isAnySelected,
      isAllSelected,
      isAllHasPack
    }
  }

  _onSectionHeaderPress = (isAllSelected, pax, participants, bookingId) => {
    const { currentTrip, navigation } = this.props
    const excursion = navigation.getParam('excursion')
    const excursionId = String(excursion.get('id'))
    const departureId = String(currentTrip.get('departureId'))
    let bParticipants = participants.get(bookingId) || getSet([])
    return () => {
      bParticipants = pax.reduce((participants, p) => {
        const paxId = String(p.get('id'))
        if (!p.get('excursionPack')) {
          participants = isAllSelected ? participants.remove(paxId) : participants.add(paxId)
        }
        return participants
      }, bParticipants)
      actionDispatcher(setParticipants({
        departureId,
        bookingId,
        excursionId,
        participants: bParticipants
      }))
    }
  }

  _renderItem = participants => {
    return (type, item) => {
      const { groupByBooking } = this.state
      if (item.first && groupByBooking) {
        const bookingId = item.initial
        const { pax, isAllSelected, isAllHasPack, isAnySelected } = this._getBookingData(bookingId, participants)
        const onPress = isAllHasPack ? null : this._onSectionHeaderPress(isAllSelected, pax, participants, bookingId)

        let iconName = 'checkOutline'
        let iconColor = Colors.black
        if (isAllSelected || isAnySelected || isAllHasPack) {
          iconColor = Colors.blue
          if (isAllSelected || isAllHasPack) {
            iconName = 'checkFill'
          }
        }

        return (
          <TouchableOpacity style={ss.sectionHeader} onPress={onPress}>
            <Text style={ss.sectionText}>{bookingId}</Text>
            <IonIcon name={iconName} color={iconColor} size={27} />
          </TouchableOpacity>
        )
      }

      const paxId = String(item.id)
      const bookingId = String(item.booking.id)
      const bParticipants = participants.get(bookingId) || getSet([])
      const selected = bParticipants.has(paxId)
      return (
        <PaxListItem
          pax={item}
          selected={selected}
          onPress={this._onPress}
        />
      )
    }
  }

  _renderPersons = (pax, participants) => {
    return (
      pax.size
        ? <RecyclerListView
          dataProvider={dataProvider.cloneWithRows(pax.toJS())}
          rowRenderer={this._renderItem(participants)}
          layoutProvider={layoutProvider}
        />
        : <NoData text='noMatch' textStyle={{ marginTop: 30 }} />
    )
  }

  _onSearch = searchText => {
    this.setState({ searchText })
  }

  _onTabSwitch = filter => {
    return () => {
      this.setState({ filter })
    }
  }

  _renderTabs = () => {
    const { filter } = this.state
    return (
      <View style={ss.tabContainer}>
        <TouchableOpacity
          style={[ss.tab, {
            backgroundColor: filter === PARTICIPATING ? Colors.blue : Colors.silver,
            borderTopLeftRadius: 5,
            borderBottomLeftRadius: 5
          }]}
          onPress={this._onTabSwitch(PARTICIPATING)}
        >
          <Text style={{ color: filter === PARTICIPATING ? Colors.silver : Colors.black }}>{_T('participating')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[ss.tab, {
            backgroundColor: filter === ALL ? Colors.blue : Colors.silver,
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5
          }]}
          onPress={this._onTabSwitch(ALL)}
        >
          <Text style={{ color: filter === ALL ? Colors.silver : Colors.black }}>{_T('all')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _findParticipatingPax = (pax, participants) => {
    return pax.filter(p => {
      const paxId = String(p.get('id'))
      const bookingId = String(p.getIn(['booking', 'id']))
      const bParticipants = participants.get(bookingId) || getSet([])
      const selected = bParticipants.has(paxId)
      return selected || p.get('excursionPack')
    })
  }

  _renderRight = brand => {
    const { groupByBooking } = this.state
    const iconColor = Colors.silver
    const switchColor = Colors[`${brand}Brand`] || Colors.blue
    const iconSize = 16
    return (
      <View style={ss.headerRight}>
        <IonIcon name='people' color={iconColor} size={iconSize} style={{ paddingRight: 5 }} />
        <Switch
          isOn={groupByBooking}
          onColor={switchColor}
          offColor={switchColor}
          onToggle={this._onToggle}
        />
        <IonIcon name='booking' color={iconColor} size={iconSize} style={{ paddingLeft: 5 }} />
      </View>
    )
  }

  _onToggle = groupByBooking => {
    this.setState({ groupByBooking })
  }

  render () {
    const { navigation, currentTrip, participants } = this.props
    const { searchText, filter, groupByBooking } = this.state
    const excursion = navigation.getParam('excursion')
    const brand = navigation.getParam('brand')
    const excursionId = String(excursion.get('id'))
    const exParticipants = participants.get(excursionId) || getMap({})

    let sortedPax = groupByBooking ? getSortedPaxByBookingId(currentTrip) : getSortedPax(currentTrip)
    if (searchText) {
      sortedPax = filterPaxBySearchText(sortedPax, searchText)
    }

    if (filter === PARTICIPATING) {
      sortedPax = this._findParticipatingPax(sortedPax, exParticipants)
    }

    if (groupByBooking) {
      sortedPax = getPaxDataGroupByBooking(sortedPax)
    }

    return (
      <Container>
        <Header
          left='back'
          title={excursion.get('name')}
          navigation={navigation}
          right={this._renderRight(brand)}
          brand={brand}
        />
        <SearchBar onSearch={this._onSearch} icon='people' placeholder={_T('paxSearch')} />
        {this._renderTabs()}
        {this._renderPersons(sortedPax, exParticipants)}
      </Container>
    )
  }
}

const stateToProps = state => {
  const currentTrip = currentTripSelector(state).get('trip')
  const departureId = String(currentTrip.get('departureId'))
  return {
    currentTrip,
    participants: getParticipants(state, departureId)
  }
}

export default connect(stateToProps, null)(ExcursionDetailsScreen)

const ss = StyleSheet.create({
  itemText: {
    paddingHorizontal: 10
  },
  itemBody: {
    flexDirection: 'row',
    flex: 7,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
    marginHorizontal: 10,
    // borderWidth: 2,
    borderColor: Colors.blue,
    padding: 2,
    borderRadius: 5
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 7
  },
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 5
  },
  sortText: {
    color: Colors.silver,
    fontSize: 10,
    lineHeight: 11,
    fontWeight: 'bold'
  },
  sectionHeader: {
    width: '100%',
    flexDirection: 'row',
    paddingVertical: 10,
    backgroundColor: Colors.steel,
    justifyContent: 'space-between',
    paddingLeft: 10,
    paddingRight: 18
  },
  sectionText: {
    fontWeight: 'bold',
    paddingLeft: 20
  },
  item: {
    paddingTop: 5
  }
})
