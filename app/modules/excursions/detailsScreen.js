
import React, { Component } from 'react'
import {
  Container, Content, List, ListItem, Left,
  CheckBox, Body, Text
} from 'native-base'
import Header from '../../components/header'
import { getPax } from '../../selectors'
import { StyleSheet } from 'react-native'

export default class ExcursionDetailsScreen extends Component {
  _sortByIdAndName = pax => {
    return pax.sortBy(p => `${p.get('booking').get('id')} ${p.get('firstName')}`)
  }

  _renderPersons = pax => {
    return (
      <List>
        {pax.map(p => {
          const id = p.get('id')
          const checked = p.get('excursionPack')
          const bookingId = p.get('booking').get('id')
          const name = `${p.get('firstName')} ${p.get('lastName')}`
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
        })}
      </List>
    )
  }

  render () {
    const { navigation } = this.props
    const excursion = navigation.getParam('excursion')
    const bookings = navigation.getParam('trip').get('bookings')
    const pax = getPax(bookings)
    const sortedPax = this._sortByIdAndName(pax)
    return (
      <Container>
        <Header left='back' title={excursion.get('name')} navigation={navigation} />
        <Content>
          {this._renderPersons(sortedPax)}
        </Content>
      </Container>
    )
  }
}

const ss = StyleSheet.create({
  itemText: {
    marginLeft: 16
  },
  itemBody: {
    flexDirection: 'row'
  }
})