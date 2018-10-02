
import React, { Component } from 'react'
import {
  Container, ListItem, Left,
  CheckBox, Body, Text, Right
} from 'native-base'
import SearchBar from '../../components/searchBar'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import Header from '../../components/header'
import { getSortedPax, getTrips, getExcursions, filterPaxBySearchText } from '../../selectors'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import { getSet } from '../../utils/immutable'
import { actionDispatcher } from '../../utils/actionDispatcher'
import { setParticipants } from './action'
import { IonIcon, Colors } from '../../theme'
import Translator from '../../utils/translator'
import NoData from '../../components/noData'

const PARTICIPATING = 'PARTICIPATING'
const ALL = 'ALL'

const _T = Translator('ExcursionDetailsScreen')

class PaxListItem extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.pax.equals(this.props.pax) ||
            nextProps.selected !== this.props.selected
  }

  render () {
    const { pax, selected, onPress } = this.props
    const paxId = String(pax.get('id'))
    const checked = pax.get('excursionPack')
    const bookingId = pax.get('booking').get('id')
    const key = `${paxId}${bookingId}`
    const name = `${pax.get('firstName')} ${pax.get('lastName')}`

    return (
      <ListItem key={key}>
        <Left style={{ flex: 1 }}>
          <CheckBox checked={checked || selected} onPress={onPress(paxId, checked)} />
        </Left>
        <Body style={ss.itemBody}>
          <Text style={{ flex: 1, flexWrap: 'wrap' }}>{bookingId}</Text>
          <Text style={{ flex: 2, flexWrap: 'wrap' }}>{name}</Text>
        </Body>
        <Right style={{ flex: 1 }}>
          {checked && <IonIcon name='star' color={Colors.headerBg} />}
        </Right>
      </ListItem>
    )
  }
}

class ExcursionDetailsScreen extends Component {
  constructor (props) {
    super(props)
    const { navigation, excursions } = props
    const excursion = navigation.getParam('excursion')
    const excursionId = String(excursion.get('id'))
    const participants = excursions.get('participants').get(excursionId)
    this.state = {
      participants: participants || getSet([]),
      searchText: '',
      filter: PARTICIPATING
    }
  }

  _onPress = (paxId, checked) => {
    const { navigation } = this.props
    const excursion = navigation.getParam('excursion')
    const excursionId = String(excursion.get('id'))
    return () => {
      if (!checked) {
        const { participants } = this.state
        this.state.participants = participants.has(paxId) ? participants.remove(paxId) : participants.add(paxId)
        actionDispatcher(setParticipants({
          key: excursionId,
          value: this.state.participants
        }))
      }
    }
  }

  _renderItem = (participants) => {
    return ({ item }) => {
      const paxId = String(item.get('id'))
      const selected = participants ? participants.has(paxId) : false
      return (
        <PaxListItem
          pax={item}
          selected={selected}
          onPress={this._onPress}
        />
      )
    }
  }

  _keyExtractor = (item, index) => `${item.get('id')}${item.get('booking').get('id')}`

  _renderPersons = (pax, participants) => {
    return (
      pax.size
        ? <ImmutableVirtualizedList
          contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
          keyboardShouldPersistTaps='always'
          immutableData={pax}
          renderItem={this._renderItem(participants)}
          keyExtractor={this._keyExtractor}
          initialNumToRender={20}
          getItemLayout={(data, index) => ({
              length: 53,
              offset: 53 * index,
              index
            })
          }
          />
        : <NoData text='No match found' textStyle={{ marginTop: 30 }} />
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
          style={[ss.tab, { backgroundColor: filter === PARTICIPATING ? Colors.headerBg : Colors.silver }]}
          onPress={this._onTabSwitch(PARTICIPATING)}
        >
          <Text style={{ color: filter === PARTICIPATING ? Colors.silver : Colors.black }}>{_T('participating')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[ss.tab, { backgroundColor: filter === ALL ? Colors.headerBg : Colors.silver }]}
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
      const selected = participants ? participants.has(paxId) : false
      return selected || p.get('excursionPack')
    })
  }

  render () {
    const { navigation, trips, excursions } = this.props
    const { searchText, filter } = this.state
    const trip = trips.getIn(['current', 'trip'])
    const excursion = navigation.getParam('excursion')
    const excursionId = String(excursion.get('id'))
    const participants = excursions.get('participants').get(excursionId)

    let sortedPax = getSortedPax(trip)
    if (searchText) {
      sortedPax = filterPaxBySearchText(sortedPax, searchText)
    }

    if (filter === PARTICIPATING) {
      sortedPax = this._findParticipatingPax(sortedPax, participants)
    }

    return (
      <Container>
        <Header left='back' title={excursion.get('name')} navigation={navigation} />
        <SearchBar onSearch={this._onSearch} icon='people' placeholder={_T('paxSearch')} />
        {this._renderTabs()}
        {this._renderPersons(sortedPax, participants)}
      </Container>
    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state),
  excursions: getExcursions(state)
})

export default connect(stateToProps, null)(ExcursionDetailsScreen)

const ss = StyleSheet.create({
  itemText: {
    paddingHorizontal: 10
  },
  itemBody: {
    flexDirection: 'row',
    flex: 4,
    alignItems: 'center'
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 5,
    marginHorizontal: 10,
    borderWidth: 1,
    padding: 2,
    borderRadius: 5
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 7,
    borderRadius: 5
  }
})
