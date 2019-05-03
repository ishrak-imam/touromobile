
import React, { Component } from 'react'
import { Container } from 'native-base'
import SearchBar from '../../components/searchBar'
import Header from '../../components/header'
import {
  currentTripSelector,
  getParticipants, filterPaxBySearchText,
  getPax, getSortedPax, getPaxDataGroup
} from '../../selectors'
import {
  StyleSheet, View, Text,
  TouchableOpacity, Dimensions
} from 'react-native'
import { connect } from 'react-redux'
import { getSet, getMap } from '../../utils/immutable'
import { actionDispatcher } from '../../utils/actionDispatcher'
import { setParticipants } from '../modifiedData/action'
import { IonIcon, Colors } from '../../theme'
import _T from '../../utils/translator'
import NoData from '../../components/noData'
import Switch from '../../components/switch'
import { RecyclerListView, DataProvider, LayoutProvider } from 'recyclerlistview'
import CheckBox from '../../components/checkBox'
import ContextMenu from '../../components/contextMenu'

const { width } = Dimensions.get('window')

const dataProvider = new DataProvider((r1, r2) => {
  return r1 !== r2
})

const layoutProvider = new LayoutProvider(
  () => 'type', (_, dim) => { dim.width = width; dim.height = 50 }
)

const PARTICIPATING = 'PARTICIPATING'
const ALL = 'ALL'

const CONTEXT_OPTIONS = {
  firstName: { text: 'firstName', key: 'FIRST_NAME', icon: 'person' },
  lastName: { text: 'lastName', key: 'LAST_NAME', icon: 'person' }
}

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
      <TouchableOpacity style={ss.item} onPress={onPress(paxId, bookingId, checked)}>
        <View style={{ flex: 1 }}>
          <CheckBox checked={checked || selected} />
        </View>
        <View style={ss.itemBody}>
          <View style={{ flex: 2 }}>
            <Text style={ss.boldText}>{bookingId}</Text>
          </View>
          <View style={{ flex: 5 }}>
            <Text style={ss.text} numberOfLines={2}>{name}</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {checked && <IonIcon name='star' color={Colors.blue} />}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

class ExcursionDetailsScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchText: '',
      filter: PARTICIPATING,
      groupByBooking: false,
      groupBy: CONTEXT_OPTIONS.firstName.key
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
      if (item.first) {
        const bookingId = item.initial

        let onPress = null
        let iconName = null
        let iconColor = null
        if (groupByBooking) {
          const { pax, isAllSelected, isAllHasPack, isAnySelected } = this._getBookingData(bookingId, participants)
          if (!isAllHasPack) onPress = this._onSectionHeaderPress(isAllSelected, pax, participants, bookingId)
          iconName = 'checkOutline'
          iconColor = Colors.black
          if (isAllSelected || isAnySelected || isAllHasPack) {
            iconColor = Colors.blue
            if (isAllSelected || isAllHasPack) {
              iconName = 'checkFill'
            }
          }
        }

        return (
          <TouchableOpacity style={ss.sectionHeader} onPress={onPress} disabled={!groupByBooking}>
            <Text style={ss.sectionText}>{bookingId}</Text>
            {groupByBooking && <IonIcon name={iconName} color={iconColor} size={27} />}
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
          style={{ marginBottom: 30 }}
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

  _onSelect = option => {
    this.setState({ groupBy: option.key })
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
    this.setState({
      groupByBooking,
      groupBy: groupByBooking ? null : CONTEXT_OPTIONS.firstName.key
    })
  }

  _renderSearchRight = () => {
    let options = [
      CONTEXT_OPTIONS.firstName,
      CONTEXT_OPTIONS.lastName
    ]

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
    const { navigation, currentTrip, participants } = this.props
    const { searchText, filter, groupByBooking, groupBy } = this.state
    const excursion = navigation.getParam('excursion')
    const brand = navigation.getParam('brand')
    const excursionId = String(excursion.get('id'))
    const exParticipants = participants.get(excursionId) || getMap({})
    const right = groupByBooking ? null : this._renderSearchRight()

    let sortedPax = getPax(currentTrip)

    if (groupByBooking) {
      sortedPax = getSortedPax(sortedPax, 'booking')
    }
    if (groupBy === CONTEXT_OPTIONS.firstName.key) {
      sortedPax = getSortedPax(sortedPax, CONTEXT_OPTIONS.firstName.text)
    }
    if (groupBy === CONTEXT_OPTIONS.lastName.key) {
      sortedPax = getSortedPax(sortedPax, CONTEXT_OPTIONS.lastName.text)
    }

    if (searchText) {
      sortedPax = filterPaxBySearchText(sortedPax, searchText)
    }
    if (filter === PARTICIPATING) {
      sortedPax = this._findParticipatingPax(sortedPax, exParticipants)
    }

    if (groupByBooking) {
      sortedPax = getPaxDataGroup(sortedPax, 'booking')
    }
    if (groupBy === CONTEXT_OPTIONS.firstName.key) {
      sortedPax = getPaxDataGroup(sortedPax, CONTEXT_OPTIONS.firstName.text)
    }
    if (groupBy === CONTEXT_OPTIONS.lastName.key) {
      sortedPax = getPaxDataGroup(sortedPax, CONTEXT_OPTIONS.lastName.text)
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
        <SearchBar
          onSearch={this._onSearch}
          icon='people'
          placeholder={_T('search')}
          right={right}
        />
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
    flex: 9,
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
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: Colors.steel
  },
  sectionText: {
    fontWeight: 'bold'
  },
  item: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginHorizontal: 10,
    marginBottom: 5,
    borderBottomWidth: 0.7,
    borderColor: Colors.steel
  },
  text: {
    fontSize: 15
  },
  boldText: {
    fontSize: 15,
    fontWeight: 'bold'
  }
})
