import React, { Component } from 'react'
import {
  CardItem, Left, Body,
  Text, Right
} from 'native-base'
import { IonIcon, Colors } from '../theme'
import IconButton from '../components/iconButton'
import { TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { call, sms } from '../utils/comms'
import Translator from '../utils/translator'
const _T = Translator('PaxDetailsScreen')

export default class PaxCard extends Component {
  _renderPxName = pax => {
    const name = `${pax.get('firstName')} ${pax.get('lastName')}`
    const ssn = pax.get('ssn')
    return (
      <CardItem>
        <Left>
          <IonIcon name='person' />
          <Body>
            <Text>{name}</Text>
            <Text note>{ssn}</Text>
          </Body>
        </Left>
        <Right>
          <IconButton name='edit' />
        </Right>
      </CardItem>
    )
  }

  _renderPhone = phone => {
    return (
      <CardItem>
        <Body>
          <Text>{_T('phone')}</Text>
          <Text note>{phone}</Text>
        </Body>
      </CardItem>
    )
  }

  _renderBooking = booking => {
    return (
      <CardItem>
        <Body>
          <Text>{_T('booking')}</Text>
          <TouchableOpacity onPress={() => {}} style={ss.booking}>
            <Text style={ss.bookingText}>{booking.get('id')}</Text>
          </TouchableOpacity>
        </Body>
      </CardItem>
    )
  }

  _renderExcursion = () => {
    return (
      <CardItem>
        <Body>
          <Text>{_T('excursionPack')}</Text>
          <IonIcon name='check' color='green' />
        </Body>
      </CardItem>
    )
  }

  _renderCoPax = (coPax, pax) => {
    return (
      <CardItem>
        <Body>
          <Text>{_T('travelsWith')}</Text>
          {coPax.filter(p => p.get('id') !== pax.get('id')).map(p => {
            const name = `${p.get('firstName')} ${p.get('lastName')}`
            return (<Text key={p.get('id')} note>{name}</Text>)
          })}
        </Body>
      </CardItem>
    )
  }

  _renderComment = comment => {
    return (
      <CardItem>
        <Body>
          <Text>{_T('comment')}</Text>
          <Text note>{comment}</Text>
        </Body>
      </CardItem>
    )
  }

  _renderComms = phone => {
    return (
      <CardItem>
        <Body style={ss.commsBody}>
          <IconButton name='phone' color='green' onPress={() => call(phone)} />
          <IconButton name='sms' color='blue' onPress={() => sms(phone)} />
        </Body>
      </CardItem>
    )
  }

  render () {
    const { pax } = this.props
    const phone = pax.get('phone')
    const booking = pax.get('booking')
    const excursion = pax.get('excursionPack')
    const coPax = pax.get('booking').get('pax')
    const comment = pax.get('comment')
    return (
      <ScrollView>
        {this._renderPxName(pax)}
        {!!phone && this._renderPhone(phone)}
        {this._renderBooking(booking)}
        {!!excursion && this._renderExcursion()}
        {!!coPax.size && this._renderCoPax(coPax, pax)}
        {!!comment && this._renderComment(comment)}
        {!!phone && this._renderComms(phone)}
      </ScrollView>
    )
  }
}

const ss = StyleSheet.create({
  commsBody: {
    flexDirection: 'row'
  },
  booking: {
    paddingVertical: 5
  },
  bookingText: {
    color: Colors.headerBg
  }
})
