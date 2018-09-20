
import React, { Component } from 'react'
import {
  Container, ListItem, Left,
  CheckBox, Body, Text
} from 'native-base'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import Header from '../../components/header'
import { getSortedPax, getTrips } from '../../selectors'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'

class ExcursionDetailsScreen extends Component {
  _renderItem = ({ item }) => {
    const id = item.get('id')
    const checked = item.get('excursionPack')
    const bookingId = item.get('booking').get('id')
    const name = `${item.get('firstName')} ${item.get('lastName')}`
    return (
      <ListItem key={`${id}${bookingId}`}>
        <Left>
          <CheckBox checked={checked} />
          <Body style={ss.itemBody}>
            <Text style={ss.itemText}>{bookingId}</Text>
            <Text style={ss.itemText}>{name}</Text>
          </Body>
        </Left>
      </ListItem>
    )
  }

  _keyExtractor = (item, index) => `${item.get('id')}${item.get('booking').get('id')}`

  _renderPersons = pax => {
    return (
      <ImmutableVirtualizedList
        immutableData={pax}
        renderItem={this._renderItem}
        keyExtractor={this._keyExtractor}
      />
    )
  }

  render () {
    const { navigation, trips } = this.props
    const trip = trips.get('current')
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
  trips: getTrips(state)
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
