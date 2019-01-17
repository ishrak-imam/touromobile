
import React, { Component } from 'react'
import {
  ListItem, Body, Text,
  CheckBox, View
} from 'native-base'
import { StyleSheet } from 'react-native'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { actionDispatcher } from '../utils/actionDispatcher'
import { selectInvoiceeIndividualMode } from '../modules/modifiedData/action'
import { connect } from 'react-redux'
import { getInvoicee } from '../selectors'

class InvoiceeSelection extends Component {
  _onSelect = paxId => {
    const { bookingId, departureId } = this.props
    return () => {
      actionDispatcher(selectInvoiceeIndividualMode({
        paxId, departureId, bookingId
      }))
    }
  }

  _renderItem = ({ item }) => {
    const { invoicee } = this.props
    const paxId = String(item.get('id'))
    const isSelected = invoicee === paxId
    const name = `${item.get('firstName')} ${item.get('lastName')}`

    return (
      <ListItem style={ss.item} onPress={this._onSelect(paxId)}>
        <CheckBox disabled checked={isSelected} />
        <Body style={ss.right}>
          <Text>{name}</Text>
        </Body>
      </ListItem>
    )
  }

  render () {
    const { items, label } = this.props
    return (
      <View>
        <Text style={ss.label}>{label}</Text>
        <ImmutableVirtualizedList
          immutableData={items}
          renderItem={this._renderItem}
          keyExtractor={item => String(item.get('id'))}
        />
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

export default connect(stateToProps, null)(InvoiceeSelection)

const ss = StyleSheet.create({
  item: {
    borderBottomWidth: 0,
    marginLeft: 0,
    paddingTop: 10,
    paddingBottom: 10
  },
  left: {
    flex: 0.5
  },
  right: {
    flex: 4
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 10
  }
})
