
import React, { Component } from 'react'
import {
  View, Text, ListItem, Body, Right
} from 'native-base'
import { getSortedPax, preparePaxData } from '../selectors'
import IconButton from '../components/iconButton'
import { Call, Text as Sms } from 'react-native-openanything'
import { StyleSheet } from 'react-native'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'

export default class PaxList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      comment: null,
      booking: false
    }
  }

  _toPaxDetails = pax => {
    const { navigation } = this.props
    return () => {
      navigation.navigate('PaxDetails', { pax })
    }
  }

  _renderPhone = number => <IconButton name='phone' color='green' onPress={() => Call(number)} />

  _renderSMS = number => <IconButton name='sms' color='blue' onPress={() => Sms(number)} />

  _renderComment = id => {
    const { comment } = this.state
    const name = comment === id ? 'up' : 'information'
    return (
      <IconButton
        name={name} color='black'
        onPress={() => this.setState({ comment: comment === id ? null : id })}
      />
    )
  }

  _renderPerson = ({ item, index }) => {
    if (item.get('first')) {
      return (
        <ListItem itemDivider>
          <Text>{item.get('initial')}</Text>
        </ListItem>
      )
    }
    const paxComment = item.get('comment')
    const phone = item.get('phone')
    const id = item.get('id')
    const name = `${item.get('firstName')} ${item.get('lastName')}`
    const { comment } = this.state
    return (
      <ListItem onPress={this._toPaxDetails(item)}>
        <Body>
          <Text>{name}</Text>
          <Text note>{item.get('booking').get('id')}</Text>
          {comment === id && <Text note>{paxComment}</Text>}
        </Body>
        <Right style={ss.itemRight}>
          {!!paxComment && this._renderComment(id)}
          {!!phone && this._renderPhone(phone)}
          {!!phone && this._renderSMS(phone)}
        </Right>
      </ListItem>
    )
  }

  _renderList = trip => {
    const sortedPax = getSortedPax(trip)
    const paxList = preparePaxData(sortedPax)
    return (
      <ImmutableVirtualizedList
        immutableData={paxList}
        renderItem={this._renderPerson}
        keyExtractor={(item, index) => String(index)}
      />
    )
  }

  render () {
    const { trip } = this.props
    const bookings = trip.get('bookings')
    return (
      <View>
        {!!bookings && this._renderList(trip)}
      </View>
    )
  }
}

const ss = StyleSheet.create({
  itemRight: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  }
})
