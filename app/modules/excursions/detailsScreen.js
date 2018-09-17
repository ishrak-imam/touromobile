
import React, { Component } from 'react'
import {
  Container, Content, List, ListItem, Left,
  CheckBox, Body, Text
} from 'native-base'
import Header from '../../components/header'
import { getSortedPax } from '../../selectors'
import { StyleSheet } from 'react-native'

export default class ExcursionDetailsScreen extends Component {
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
    const trip = navigation.getParam('trip')
    const excursion = navigation.getParam('excursion')
    const sortedPax = getSortedPax(trip)
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
