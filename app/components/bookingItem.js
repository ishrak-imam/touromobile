
import React, { Component } from 'react'
import { Text } from 'native-base'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors } from '../theme'
import { getPhoneNumbers } from '../selectors'
import { getMap } from '../utils/immutable'
import IconButton from '../components/iconButton'
import { sms } from '../utils/comms'

export default class BookingItem extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.booking.equals(this.props.booking) ||
           !nextProps.modifiedPax.equals(this.props.modifiedPax)
  }

  _sms = phones => {
    return () => {
      sms(phones)
    }
  }

  render () {
    const { booking, modifiedPax, onPress } = this.props
    const id = String(booking.get('id'))
    const pax = booking.get('pax')
    const sortedPax = pax.sortBy(p => `${p.get('firstName')} ${p.get('lastName')}`)
    const paxNames = sortedPax.map(p => <Text note key={p.get('id')}>{`${p.get('firstName')} ${p.get('lastName')}`}</Text>)
    const phones = getPhoneNumbers(getMap({ pax, modifiedPax }))
    return (
      <TouchableOpacity style={ss.item} onPress={onPress(booking)}>
        <View style={ss.top}>
          <Text style={ss.boldText}>{id}</Text>
        </View>
        <View style={ss.body}>
          <View style={ss.pax}>
            {paxNames}
          </View>
          <View style={ss.icon}>
            {!!phones.size && <IconButton name='sms' color={Colors.blue} onPress={this._sms(phones)} />}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

const ss = StyleSheet.create({
  item: {
    width: '100%',
    marginHorizontal: 15,
    marginVertical: 10,
    borderBottomWidth: 0.7,
    borderBottomColor: Colors.steel,
    paddingBottom: 5
  },
  top: {
    height: 25,
    width: '100%',
    justifyContent: 'center'
  },
  boldText: {
    fontWeight: '600'
  },
  body: {
    width: '100%',
    flexDirection: 'row'
  },
  pax: {
    flex: 3
  },
  icon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
