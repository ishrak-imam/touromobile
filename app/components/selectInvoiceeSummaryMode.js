
import React, { Component } from 'react'
import {
  TouchableOpacity, StyleSheet, Keyboard,
  View, Text, TextInput, ActivityIndicator
} from 'react-native'
import { IonIcon, Colors } from '../theme'
import { connect } from 'react-redux'
import { getInvoiceeSummaryMode } from '../selectors'
import { actionDispatcher, networkActionDispatcher } from '../utils/actionDispatcher'
import { showModal } from '../modal/action'
import { selectInvoiceeSummaryMode, ssnDataReq, ssnDataSucs } from '../modules/modifiedData/action'
import _T from '../utils/translator'
import { getMap } from '../utils/immutable'
import { } from 'react-native-gesture-handler'
import FooterButtons from './footerButtons'
import debounce from '../utils/debounce'
import { checkSSN } from '../utils/stringHelpers'

class SelectInvoiceeSummaryMode extends Component {
  constructor (props) {
    super(props)

    const { invoicee } = props
    const ssn = invoicee.get('ssn')
    const address = invoicee.get('address')
    const city = invoicee.get('city')
    const zip = invoicee.get('zip')
    this.state = {
      dirty: false,
      isValidSSN: !!ssn,
      ssn,
      address,
      city,
      zip
    }
    // actionDispatcher(ssnDataSucs({
    //   departureId,
    //   bookingId,
    //   invoicee: {
    //     ssn, address, city, zip
    //   }
    // }))

    this._checkSSNDebounce = debounce(this._checkSSN, 200)
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

  componentDidMount () {
    const { booking } = this.props
    this._prefillInvoicee(booking.get('pax'))
  }

  componentWillReceiveProps (nextProps) {
    const { invoicee, bookingId, departureId } = nextProps
    const prevInvoicee = this.props.invoicee
    const customer = this.props.booking.get('customer')
    const customerName = `${customer.get('firstName')} ${customer.get('lastName')}`
    let addressDetails = null
    if (customerName === invoicee.get('name') && invoicee.get('id') !== prevInvoicee.get('id')) {
      const ssn = customer.get('ssn')
      const address = customer.get('address')
      const city = customer.get('city')
      const zip = customer.get('zip')
      addressDetails = {
        ssn,
        zip,
        city,
        address,
        isValidSSN: !!customer.get('ssn')
      }
      actionDispatcher(ssnDataSucs({
        departureId,
        bookingId,
        invoicee: {
          ssn, address, city, zip
        }
      }))
    } else {
      addressDetails = {
        ssn: invoicee.get('ssn'),
        address: invoicee.get('address'),
        city: invoicee.get('city'),
        zip: invoicee.get('zip')
      }
    }

    this.setState({
      ...addressDetails
    })
  }

  _prefillInvoicee = pax => {
    if (pax.size === 1) {
      const selection = {
        key: String(pax.get(0).get('id')),
        value: `${pax.get(0).get('firstName')} ${pax.get(0).get('lastName')}`
      }
      this._selectInvoicee(selection)
    }
  }

  _onSelectInvoicee = selection => {
    this._selectInvoicee(selection.value)
  }

  _selectInvoicee = invoicee => {
    const { key, value } = invoicee
    const { departureId, bookingId } = this.props
    actionDispatcher(selectInvoiceeSummaryMode({
      departureId,
      bookingId,
      invoicee: {
        isLoading: false,
        key,
        value,
        id: key,
        name: value
      }
    }))
  }

  _showSelections = options => {
    return () => {
      actionDispatcher(showModal({
        type: 'selection',
        options,
        onSelect: this._onSelectInvoicee
      }))
    }
  }

  _getInvoiceeOptions = (pax, direction, selected) => {
    const config = {
      label: _T('invoiceeSelection'),
      key: 'invoicee',
      direction
    }
    const items = pax.map(p => (getMap({
      key: String(p.get('id')),
      value: `${p.get('firstName')} ${p.get('lastName')}`
    })))

    return {
      config, items, selected
    }
  }

  _renderSelection = () => {
    const { invoicee, pax } = this.props
    const paxName = invoicee.size ? invoicee.get('value') : _T('selectInvoicee')
    const options = this._getInvoiceeOptions(pax, '', invoicee)
    return (
      <View style={ss.combo}>
        <View style={ss.comboText}>
          <Text style={ss.comboLabel}>{_T('invoicee')}:</Text>
        </View>
        <View style={ss.selector}>
          <View style={ss.selectorBox}>
            <Text numberOfLines={1} style={ss.selectorText}>{paxName}</Text>
          </View>
          <TouchableOpacity style={ss.dropDown} onPress={this._showSelections(options)} >
            <IonIcon name='down' color={Colors.silver} size={20} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  _onChangeText = field => text => {
    this.setState({ [field]: text, dirty: true }, () => {
      if (field === 'ssn') this._checkSSNDebounce()
    })
  }

  _requestSsnData = () => {
    Keyboard.dismiss()
    const { ssn } = this.state
    const { bookingId, departureId } = this.props
    this.setState({ dirty: false })
    networkActionDispatcher(ssnDataReq({
      ssn,
      bookingId,
      departureId
    }))
  }

  _checkSSN = () => {
    const { ssn } = this.state
    this.setState({ isValidSSN: checkSSN(ssn) })
  }

  _onSave = () => {
    Keyboard.dismiss()
    const { ssn, address, city, zip } = this.state
    const { departureId, bookingId } = this.props
    this.setState({ dirty: false })
    actionDispatcher(ssnDataSucs({
      departureId,
      bookingId,
      invoicee: {
        ssn, address, city, zip
      },
      toast: true,
      message: _T('infoSaveSucs')
    }))
  }

  _renderAddressInput = () => {
    const { dirty, isValidSSN, ssn, address, zip, city } = this.state
    const { invoicee } = this.props
    const isLoading = invoicee.get('isLoading')

    const color = isValidSSN ? Colors.blue : Colors.charcoal

    return (
      <View style={ss.addressForm}>

        <View style={ss.header}>
          <Text style={ss.headerText}>{_T('ssnHeader')}</Text>
        </View>

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
    const { invoicee } = this.props

    return (
      <View style={ss.container}>
        {this._renderSelection()}
        {!!invoicee.size && this._renderAddressInput()}
      </View>
    )
  }
}

const stateToProps = (state, props) => {
  const { departureId, bookingId } = props

  return {
    invoicee: getInvoiceeSummaryMode(state, departureId, bookingId)
  }
}

export default connect(stateToProps, null)(SelectInvoiceeSummaryMode)

const ss = StyleSheet.create({
  container: {
    marginTop: 5
  },
  selector: {
    height: 30,
    flex: 1.7,
    flexDirection: 'row',
    backgroundColor: Colors.silver,
    borderRadius: 3
  },
  selectorBox: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRightWidth: 0,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderColor: Colors.charcoal
  },
  selectorText: {
    fontSize: 14
  },
  dropDown: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: Colors.blue
  },
  combo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 10
  },
  comboLabel: {
    fontWeight: 'bold'
  },
  comboText: {
    flex: 1.5,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center'
  },
  addressForm: {
    marginTop: 10
  },
  header: {
    width: '100%',
    marginBottom: 5,
    alignItems: 'center'
  },
  headerText: {
    fontSize: 14,
    color: Colors.cancel,
    fontStyle: 'italic'
  },
  inputItem: {
    width: '100%',
    height: 40,
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
    height: 35,
    width: '100%',
    paddingLeft: 5
  },
  footer: {
    height: 30,
    width: '100%',
    alignItems: 'flex-end'
  }
})
