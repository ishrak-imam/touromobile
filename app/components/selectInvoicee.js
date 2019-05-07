
import React, { Component } from 'react'
import {
  TouchableOpacity, StyleSheet, Keyboard,
  View, Text, TextInput, ActivityIndicator
} from 'react-native'
import { IonIcon, Colors } from '../theme'
import { connect } from 'react-redux'
import { getInvoicee } from '../selectors'
import CheckBox from './checkBox'
import { actionDispatcher, networkActionDispatcher } from '../utils/actionDispatcher'
import {
  selectInvoicee, deleteInvoicee,
  ssnDataReq, ssnDataSucs
} from '../modules/modifiedData/action'
import { getMap } from '../utils/immutable'
import _T from '../utils/translator'
import debounce from '../utils/debounce'
import { checkSSN } from '../utils/stringHelpers'
import FooterButtons from './footerButtons'

class PaxItem extends Component {
  constructor (props) {
    super(props)
    const { customer, invoicee, pax } = props
    let details = {
      ssn: '',
      address: '',
      city: '',
      zip: ''
    }
    if (this._isCustomerIsInvoicee(customer, invoicee)) {
      details = {
        ssn: customer.get('ssn') || pax.get('ssn') || '',
        address: customer.get('address') || '',
        city: customer.get('city') || '',
        zip: customer.get('zip') || ''
      }
    }

    if (invoicee) {
      details = {
        ssn: invoicee.get('ssn') || details.ssn,
        address: invoicee.get('address') || details.address,
        city: invoicee.get('city') || details.city,
        zip: invoicee.get('zip') || details.zip
      }
    }

    this.state = {
      ...details,
      dirty: true,
      isValidSSN: !!details.ssn
    }

    this._checkSSNDebounce = debounce(this._checkSSN, 200)
  }

  componentWillReceiveProps (nextProps) {
    const { invoicee, customer, pax } = nextProps
    let details = {}
    let ssn = customer.get('ssn') || pax.get('ssn')
    if (invoicee && this._isCustomerIsInvoicee(customer, invoicee)) {
      ssn = invoicee.get('ssn') || ssn
      details = {
        ssn,
        address: invoicee.get('address') || customer.get('address'),
        city: invoicee.get('city') || customer.get('city'),
        zip: invoicee.get('zip') || customer.get('zip')
      }
    }

    if (invoicee && !this._isCustomerIsInvoicee(customer, invoicee)) {
      ssn = invoicee.get('ssn') || ssn
      details = {
        ssn,
        address: invoicee.get('address'),
        city: invoicee.get('city'),
        zip: invoicee.get('zip')
      }
    }

    this.setState({ ...details, isValidSSN: !!ssn })
  }

  _checkSSN = () => {
    const { ssn } = this.state
    this.setState({ isValidSSN: checkSSN(ssn) })
  }

  _isCustomerIsInvoicee = (customer, invoicee) => {
    if (!invoicee) return false
    const cusName = `${customer.get('firstName')} ${customer.get('lastName')}`
    const invoiceeName = invoicee.get('name')
    return cusName === invoiceeName
  }

  // shouldComponentUpdate (nextProps) {
  //   return this.props.selected !== nextProps.selected
  // }

  _onChangeText = field => text => {
    this.setState({ [field]: text, dirty: true }, () => {
      if (field === 'ssn') this._checkSSNDebounce()
    })
  }

  _requestSsnData = () => {
    Keyboard.dismiss()
    const { ssn } = this.state
    const { paxId, bookingId, departureId } = this.props
    this.setState({ dirty: false })
    networkActionDispatcher(ssnDataReq({
      ssn,
      bookingId,
      departureId,
      paxId
    }))
  }

  _onCancel = () => {
    const { invoicee } = this.props
    const ssn = invoicee.get('ssn')
    this.setState({
      dirty: false,
      isValidSSN: !!ssn,
      ssn,
      address: invoicee.get('address'),
      zip: invoicee.get('zip'),
      city: invoicee.get('city')
    })
  }

  _onSave = () => {
    Keyboard.dismiss()
    const { ssn, address, city, zip } = this.state
    const { paxId, departureId, bookingId } = this.props
    this.setState({ dirty: false })
    actionDispatcher(ssnDataSucs({
      paxId,
      departureId,
      bookingId,
      invoicee: {
        ssn, address, city, zip
      },
      toast: true,
      message: _T('infoSaveSucs')
    }))
  }

  _renderSSNForm = () => {
    const { ssn, address, city, zip, dirty, isValidSSN } = this.state
    const { invoicee } = this.props
    const color = isValidSSN ? Colors.blue : Colors.charcoal
    const isLoading = invoicee.get('isLoading')

    return (
      <View style={ss.ssnForm}>

        <View style={ss.inputItem}>
          <View style={ss.inputLeft}>
            <Text style={ss.label}>{_T('ssn')}:</Text>
          </View>
          <View style={ss.inputRight}>
            <TextInput
              underlineColorAndroid='transparent'
              placeholder={_T('ssn')}
              value={ssn}
              style={[ss.input, { width: '90%' }]}
              onChangeText={this._onChangeText('ssn')}
              autoCorrect={false}
              placeholderTextColor={Colors.charcoal}
              editable
              keyboardType='numeric'
            />
            <TouchableOpacity style={ss.inputIcon} onPress={this._requestSsnData} disabled={isLoading || !isValidSSN}>
              {
                isLoading
                  ? <ActivityIndicator size='small' color={Colors.blue} />
                  : <IonIcon name='download' color={color} size={30} />
              }
            </TouchableOpacity>
          </View>
        </View>

        <View style={ss.inputItem}>
          <View style={ss.inputLeft}>
            <Text style={ss.label}>{_T('address')}:</Text>
          </View>
          <View style={ss.inputRight}>
            <TextInput
              underlineColorAndroid='transparent'
              placeholder={_T('address')}
              value={address}
              style={ss.input}
              onChangeText={this._onChangeText('address')}
              autoCorrect={false}
              placeholderTextColor={Colors.charcoal}
              editable
            />
          </View>
        </View>

        <View style={ss.inputItem}>
          <View style={ss.inputLeft}>
            <Text style={ss.label}>{_T('zip')}:</Text>
          </View>
          <View style={ss.inputRight}>
            <TextInput
              underlineColorAndroid='transparent'
              placeholder={_T('zip')}
              value={zip}
              style={ss.input}
              onChangeText={this._onChangeText('zip')}
              autoCorrect={false}
              placeholderTextColor={Colors.charcoal}
              editable
              keyboardType='numeric'
            />
          </View>
        </View>

        <View style={ss.inputItem}>
          <View style={ss.inputLeft}>
            <Text style={ss.label}>{_T('city')}:</Text>
          </View>
          <View style={ss.inputRight}>
            <TextInput
              underlineColorAndroid='transparent'
              placeholder={_T('city')}
              value={city}
              style={ss.input}
              onChangeText={this._onChangeText('city')}
              autoCorrect={false}
              placeholderTextColor={Colors.charcoal}
              editable
            />
          </View>
        </View>
        <View style={ss.footer}>
          <FooterButtons disabled={!dirty} onSave={this._onSave} onCancel={this._onCancel} />
        </View>
      </View>
    )
  }

  render () {
    const { pax, onPress, selected } = this.props
    const paxName = `${pax.get('firstName')} ${pax.get('lastName')}`
    return (
      <View>
        <TouchableOpacity style={ss.paxItem} onPress={onPress}>
          <CheckBox checked={selected} />
          <Text style={ss.paxName}>{paxName}</Text>
        </TouchableOpacity>

        {selected && this._renderSSNForm()}

      </View>
    )
  }
}

class SelectInvoicee extends Component {
  _onPressPaxItem = (paxId, pax, selected) => () => {
    const { bookingId, departureId } = this.props
    const action = selected ? deleteInvoicee : selectInvoicee
    const invoicee = getMap({
      id: paxId,
      name: `${pax.get('firstName')} ${pax.get('lastName')}`,
      address: '',
      city: '',
      zip: '',
      ssn: '',
      isLoading: false
    })
    actionDispatcher(action({
      departureId,
      bookingId,
      paxId,
      invoicee
    }))
  }

  _renderPaxList = () => {
    const { pax, invoicee, booking, bookingId, departureId } = this.props
    const customer = booking.get('customer')

    return (
      <View style={ss.paxList}>
        {pax.toArray().map(p => {
          const paxId = String(p.get('id'))
          const invoiceePax = invoicee.get(paxId)
          return (
            <PaxItem
              key={paxId}
              paxId={paxId}
              pax={p}
              onPress={this._onPressPaxItem(paxId, p, !!invoiceePax)}
              selected={!!invoiceePax}
              customer={customer}
              invoicee={invoiceePax}
              bookingId={bookingId}
              departureId={departureId}
            />
          )
        })}
      </View>
    )
  }

  render () {
    return (
      <View style={ss.container}>
        {this._renderPaxList()}
      </View>
    )
  }
}

const stateToProps = (state, props) => {
  const { departureId, bookingId } = props
  return {
    invoicee: getInvoicee(state, departureId, bookingId)
  }
}

export default connect(stateToProps, null)(SelectInvoicee)

const ss = StyleSheet.create({
  container: {
    marginBottom: 10
  },
  paxItem: {
    height: 40,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10
  },
  paxList: {
    marginHorizontal: 10
  },
  paxName: {
    fontSize: 15,
    marginLeft: 10
  },
  ssnForm: {
    marginBottom: 5,
    marginHorizontal: 5
  },
  inputItem: {
    width: '100%',
    height: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 5
  },
  inputLeft: {
    flex: 2
  },
  label: {
    fontWeight: 'bold'
  },
  inputRight: {
    flex: 4.5,
    borderWidth: 1,
    borderColor: Colors.charcoal,
    borderRadius: 5,
    flexDirection: 'row'
  },
  inputIcon: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    height: 30,
    width: '100%',
    paddingLeft: 5
  },
  footer: {
    height: 25,
    // width: '100%',
    alignItems: 'flex-end'
  }
})
