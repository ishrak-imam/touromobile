
import React, { Component } from 'react'
import {
  Container, ListItem, Left,
  CheckBox, Body, Text
} from 'native-base'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import Header from '../../components/header'
import { getSortedPax, getTrips, getExcursions } from '../../selectors'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { getSet } from '../../utils/immutable'
import { actionDispatcher } from '../../utils/actionDispatcher'
import { setParticipants } from './action'

class PaxListItem extends Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.selected !== this.props.selected
  }

  render () {
    const { selected, checked, onPress, id, bookingId, name } = this.props
    return (
      <ListItem key={`${id}${bookingId}`}>
        <Left>
          <CheckBox checked={checked || selected} onPress={onPress(String(id), checked)} />
          <Body style={ss.itemBody}>
            <Text style={ss.itemText}>{bookingId}</Text>
            <Text style={ss.itemText}>{name}</Text>
          </Body>
        </Left>
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
      participants: participants || getSet([])
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
      <ImmutableVirtualizedList
        immutableData={pax}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
        extraData={this.state.participants}
      />
    )
  }

  render () {
    const { navigation, trips } = this.props
    const trip = trips.get('current').get('trip')
    const excursion = navigation.getParam('excursion')
    const sortedPax = getSortedPax(trip)
    return (
      <Container>
        <Header left='back' title={excursion.get('name')} navigation={navigation} />
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
    marginLeft: 16
  },
  itemBody: {
    flexDirection: 'row'
  }
})
