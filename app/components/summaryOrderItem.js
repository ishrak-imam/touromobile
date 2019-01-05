
import React, { Component } from 'react'
import {
  View, Text, ListItem, Right, Left
} from 'native-base'
import { TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import { IonIcon, Colors } from '../theme'
import { connect } from 'react-redux'
import { getLunches, getInvoiceeSummaryMode } from '../selectors'
import isIphoneX from '../utils/isIphoneX'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { actionDispatcher } from '../utils/actionDispatcher'
import { showModal } from '../modal/action'
import { getMap } from '../utils/immutable'
import { selectInvoiceeSummaryMode } from '../modules/modifiedData/action'
import Translator from '../utils/translator'

const _T = Translator('OrdersScreen')

class SummaryOrderItem extends Component {
  _onSelectInvoicee = () => {
    const { departureId, bookingId } = this.props
    return selection => {
      actionDispatcher(selectInvoiceeSummaryMode({
        departureId,
        bookingId,
        invoicee: selection.value
      }))
    }
  }

  _showSelections = options => {
    return () => {
      actionDispatcher(showModal({
        type: 'selection',
        options,
        onSelect: this._onSelectInvoicee()
      }))
    }
  }

  _renderInvoiceeSelection = (options, selected) => {
    const paxName = selected ? selected.get('value') : _T('selectInvoicee')
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

  _renderMealItem = ({ item }) => {
    return (
      <ListItem style={ss.item}>
        <Left style={ss.itemLeft}>
          <Text>{item.get('name')}</Text>
        </Left>
        <Right style={ss.itemRight}>
          <TouchableOpacity style={ss.minus}>
            <Text style={ss.sign}>-</Text>
          </TouchableOpacity>
          <View style={ss.counter}>
            <Text style={ss.count}>3</Text>
          </View>
          <TouchableOpacity style={ss.plus}>
            <Text style={ss.sign}>+</Text>
          </TouchableOpacity>
        </Right>
      </ListItem>
    )
  }

  _renderBeverageItem = ({ item }) => {
    return (
      <ListItem style={ss.item}>
        <Left style={ss.itemLeft}>
          <Text>{item.get('name')}</Text>
        </Left>
        <Right style={ss.itemRight}>
          <TouchableOpacity style={ss.minus}>
            <Text style={ss.sign}>-</Text>
          </TouchableOpacity>
          <View style={ss.counter}>
            <Text style={ss.count}>3</Text>
          </View>
          <TouchableOpacity style={ss.plus}>
            <Text style={ss.sign}>+</Text>
          </TouchableOpacity>
        </Right>
      </ListItem>
    )
  }

  _renderMeals = meals => {
    return (
      <View style={ss.section}>
        <ListItem style={ss.header}>
          <View>
            <Text style={ss.boldText}>Meals</Text>
          </View>
        </ListItem>
        <ImmutableVirtualizedList
          immutableData={meals}
          renderItem={this._renderMealItem}
          keyExtractor={item => String(item.get('id'))}
        />
      </View>
    )
  }

  _renderBeverages = beverages => {
    return (
      <View style={ss.section}>
        <ListItem style={ss.header}>
          <View>
            <Text style={ss.boldText}>Beverages</Text>
          </View>
        </ListItem>
        <ImmutableVirtualizedList
          immutableData={beverages}
          renderItem={this._renderBeverageItem}
          keyExtractor={item => String(item.get('id'))}
        />
      </View>
    )
  }

  _getInvoiceeOptions = (pax, direction, selected) => {
    const config = {
      label: 'Invoicee selection',
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
    const { booking, lunches, direction, invoicee } = this.props
    const meals = lunches.get(direction).get('meals')
    const beverages = lunches.get(direction).get('beverages')
    const invoiceeOptions = this._getInvoiceeOptions(booking.get('pax'), direction, invoicee)
    return (
      <View style={ss.container}>
        {this._renderInvoiceeSelection(invoiceeOptions, invoicee)}
        <ScrollView style={ss.scroll} showsVerticalScrollIndicator={false}>
          {this._renderMeals(meals)}
          {this._renderBeverages(beverages)}
        </ScrollView>
      </View>
    )
  }
}

const stateToProps = (state, props) => {
  const { departureId, bookingId } = props
  return {
    invoicee: getInvoiceeSummaryMode(state, departureId, bookingId),
    lunches: getLunches(state)
  }
}

export default connect(stateToProps, null)(SummaryOrderItem)

const ss = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    marginHorizontal: 15
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
  boldText: {
    fontWeight: 'bold'
  },
  section: {
    marginBottom: 20
  },
  header: {
    paddingBottom: 5,
    marginLeft: 0
  },
  item: {
    paddingBottom: 5,
    paddingRight: 0,
    marginLeft: 0,
    borderBottomWidth: 0
  },
  itemLeft: {
    flex: 1.5
  },
  itemRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  plus: {
    height: 30,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.green,
    borderRadius: 3
  },
  minus: {
    height: 30,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.cancel,
    borderRadius: 3
  },
  counter: {
    height: 30,
    width: 35,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sign: {
    fontWeight: 'bold',
    color: Colors.white
  },
  count: {
    fontWeight: 'bold'
  },
  scroll: {
    marginBottom: isIphoneX ? 20 : 10
  }
})
