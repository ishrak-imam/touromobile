
import React, { Component } from 'react'
import {
  View, Text, List, ListItem, Body, Right
} from 'native-base'
import { getPax } from '../selectors'
import { head, toLower, toUpper } from 'lodash'
import { List as ImList, Map } from 'immutable'
import RoundIconButton from '../components/roundedIconButton'
import { Call, Text as Sms } from 'react-native-openanything'
import { StyleSheet } from 'react-native'

export default class PaxList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      comment: null,
      booking: false
    }
  }

  _sortByName = (pax) => {
    let initial = null
    return pax.sortBy(p => p.get('firstName')).map(p => {
      const paxInitial = toLower(head(p.get('firstName')))
      if (initial !== paxInitial) {
        initial = paxInitial
        return new ImList([new Map({ first: true, initial: toUpper(paxInitial) }), p])
      }
      return new ImList([p])
    }).flatten(1)
  }

  _renderPerson = (item, index) => {
    const first = item.get('first')
    const paxComment = item.get('comment')
    const phone = item.get('phone')
    const id = item.get('id')

    const renderDivider = () => {
      return (
        <ListItem itemDivider key={index}>
          <Text>{item.get('initial')}</Text>
        </ListItem>
      )
    }

    const renderData = () => {
      const name = `${item.get('firstName')} ${item.get('lastName')}`
      const { comment } = this.state
      const renderPhone = number => <RoundIconButton name='phone' color='green' onPress={() => Call(number)} />
      const renderSMS = number => <RoundIconButton name='sms' color='blue' onPress={() => Sms(number)} />
      const renderComment = () => {
        const name = comment === id ? 'up' : 'information'
        return (
          <RoundIconButton
            name={name} color='black'
            onPress={() => this.setState({ comment: comment === id ? null : id })}
          />
        )
      }

      return (
        <ListItem onPress={() => {}} key={index}>
          <Body>
            <Text>{name}</Text>
            <Text note>{item.get('booking').get('id')}</Text>
            {comment === id && <Text note>{paxComment}</Text>}
          </Body>
          <Right style={ss.itemRight}>
            {!!paxComment && renderComment()}
            {phone && renderPhone(phone)}
            {phone && renderSMS(phone)}
          </Right>
        </ListItem>
      )
    }

    if (first) {
      return renderDivider()
    }

    return renderData()
  }

  _renderBooking = booking => {
    const id = booking.get('id')
    const pax = booking.get('pax')

    const sortedPax = pax.sortBy(p => p.get('firstname'))
    const paxNames = sortedPax.map(p => <Text note key={p.get('id')}>{`${p.get('firstName')} ${p.get('lastName')}`}</Text>)

    const phones = sortedPax
      .filter(p => p.get('phone'))
      .map(p => p.get('phone'))
      .join(',')

    return (
      <ListItem onPress={() => {}} key={id}>
        <Body>
          <Text>{id}</Text>
          {paxNames}
        </Body>
        <Right>
          {phones && <RoundIconButton name='sms' color='blue' onPress={() => Sms(phones)} />}
        </Right>
      </ListItem>
    )
  }

  _renderList = bookings => {
    const { booking } = this.props
    const list = booking
      ? bookings.sortBy(b => b.get('id')) // sort bookings by id
      : this._sortByName(getPax(bookings))
    return (
      <List>
        {list.map((item, index) => {
          return booking
            ? this._renderBooking(item)
            : this._renderPerson(item, index)
        })}
      </List>
    )
  }

  render () {
    const { trip } = this.props
    const bookings = trip.get('bookings')
    return (
      <View>
        {bookings && this._renderList(bookings)}
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
