
import React, { Component } from 'react'
import { Text } from 'native-base'
import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { Colors, IonIcon } from '../theme'
import {
  getPhoneNumbers, getDistributionFlag,
  getInvoicee
} from '../selectors'
import { getMap } from '../utils/immutable'
import IconButton from '../components/iconButton'
import { connect } from 'react-redux'

class BookingItem extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.booking.equals(this.props.booking) ||
           !nextProps.modifiedPax.equals(this.props.modifiedPax) ||
           nextProps.isNeedDistribution !== this.props.isNeedDistribution ||
           !nextProps.invoicee.equals(this.props.invoicee)
  }

  _sms = numbers => {
    return () => {
      const { navigation, brand } = this.props
      navigation.navigate('SMS', { numbers, brand })
    }
  }

  render () {
    const { booking, modifiedPax, onPress, invoicee, isNeedDistribution } = this.props
    const id = String(booking.get('id'))
    const pax = booking.get('pax')
    const sortedPax = pax.sortBy(p => `${p.get('firstName')} ${p.get('lastName')}`)
    const paxNames = sortedPax.map(p => <Text note key={p.get('id')}>{`${p.get('firstName')} ${p.get('lastName')}`}</Text>)
    const phones = getPhoneNumbers(getMap({ pax, modifiedPax }))
    return (
      <TouchableOpacity style={ss.item} onPress={onPress(booking)}>
        <View style={ss.top}>
          <Text style={ss.boldText}>{id}</Text>
          {isNeedDistribution && invoicee.size > 1 &&
          <IonIcon name='clipBoard' size={25} color={Colors.blue} />}
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

const stateToProps = (state, props) => {
  const { booking, departureId } = props
  const bookingId = String(booking.get('id'))
  return {
    isNeedDistribution: getDistributionFlag(state, departureId, bookingId),
    invoicee: getInvoicee(state, departureId, bookingId)
  }
}

export default connect(stateToProps, null)(BookingItem)

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
    height: 30,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  boldText: {
    marginRight: 10,
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
