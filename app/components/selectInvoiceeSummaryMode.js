
import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native'
import { IonIcon, Colors } from '../theme'
import { connect } from 'react-redux'
import { getInvoiceeSummaryMode } from '../selectors'
import { actionDispatcher } from '../utils/actionDispatcher'
import { showModal } from '../modal/action'
import { selectInvoiceeSummaryMode } from '../modules/modifiedData/action'
import Translator from '../utils/translator'
import { getMap } from '../utils/immutable'

const _T = Translator('OrdersScreen')

class SelectInvoiceeSummaryMode extends Component {
  componentDidMount () {
    const { booking } = this.props
    this._prefillInvoicee(booking.get('pax'))
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
    const { departureId, bookingId } = this.props
    actionDispatcher(selectInvoiceeSummaryMode({
      departureId,
      bookingId,
      invoicee
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

  render () {
    const { invoicee, pax } = this.props
    const paxName = invoicee ? invoicee.get('value') : _T('selectInvoicee')
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
}

const stateToProps = (state, props) => {
  const { departureId, bookingId } = props

  return {
    invoicee: getInvoiceeSummaryMode(state, departureId, bookingId)
  }
}

export default connect(stateToProps, null)(SelectInvoiceeSummaryMode)

const ss = StyleSheet.create({
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
  }
})
