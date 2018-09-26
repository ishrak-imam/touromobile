
import React, { Component } from 'react'
import {
  Container, ListItem, Left,
  CheckBox, Body, Text, Right
} from 'native-base'
import SearchBar from '../../components/searchBar'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import Header from '../../components/header'
import { getSortedPax, getTrips, getExcursions, filterPaxBySearchText } from '../../selectors'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { getSet } from '../../utils/immutable'
import { actionDispatcher } from '../../utils/actionDispatcher'
import { setParticipants } from './action'
import { IonIcon, Colors } from '../../theme'
import Translator from '../../utils/translator'
import NoData from '../../components/noData'

const _T = Translator('ExcursionDetailsScreen')

class PaxListItem extends Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.selected !== this.props.selected
  }

  render () {
    const { selected, checked, onPress, id, bookingId, name } = this.props
    return (
      <ListItem key={`${id}${bookingId}`}>
        <Left style={{ flex: 1 }}>
          <CheckBox checked={checked || selected} onPress={onPress(String(id), checked)} />
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
      searchText: ''
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

  _renderItem = ({ item }) => {
    const { navigation, excursions } = this.props
    const id = item.get('id')
    const checked = item.get('excursionPack')
    const bookingId = item.get('booking').get('id')
    const name = `${item.get('firstName')} ${item.get('lastName')}`

    const excursion = navigation.getParam('excursion')
    const excursionId = String(excursion.get('id'))
    const participants = excursions.get('participants').get(excursionId)
    const selected = participants ? participants.has(String(id)) : false

    /**
     * separate class component used to take advantage
     * of shouldComponentUpdate hook
     */
    return (
      <PaxListItem
        id={id}
        bookingId={bookingId}
        onPress={this._onPress}
        selected={selected}
        checked={checked}
        name={name}
      />
    )
  }

  _keyExtractor = (item, index) => `${item.get('id')}${item.get('booking').get('id')}`

  _renderPersons = pax => {
    return (
      pax.size
        ? <ImmutableVirtualizedList
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps
          immutableData={pax}
          renderItem={this._renderItem}
          keyExtractor={this._keyExtractor}
          extraData={this.state.participants}
        />
        : <NoData text='No match found' textStyle={{ marginTop: 30 }} />
    )
  }

  _onSearch = searchText => {
    this.setState({ searchText })
  }

  render () {
    const { navigation, trips } = this.props
    const { searchText } = this.state
    const trip = trips.getIn(['current', 'trip'])
    const excursion = navigation.getParam('excursion')
    let sortedPax = getSortedPax(trip)
    if (searchText) {
      sortedPax = filterPaxBySearchText(sortedPax, searchText)
    }
    return (
      <Container>
        <Header left='back' title={excursion.get('name')} navigation={navigation} />
        <SearchBar onSearch={this._onSearch} icon='people' placeholder={_T('paxSearch')} />
        {this._renderPersons(sortedPax)}
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
  }
})
