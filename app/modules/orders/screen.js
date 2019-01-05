
import React, { Component } from 'react'
import {
  Container, ListItem, Left, Right,
  Text, View
} from 'native-base'
import { StyleSheet, TouchableOpacity } from 'react-native'
import Header from '../../components/header'
import Translator from '../../utils/translator'
import OrderItem from '../../components/orderItem'
import isIphoneX from '../../utils/isIphoneX'
import OutHomeTab, { TABS } from '../../components/outHomeTab'
import SummaryOrderItem from '../../components/summaryOrderItem'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { Colors, IonIcon } from '../../theme'
import InvoiceeSelection from '../../components/invoiceeSelection'
import { actionDispatcher } from '../../utils/actionDispatcher'
import { resetAllOrderIndividualMode } from '../modifiedData/action'

const _T = Translator('OrdersScreen')

export default class OrdersScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: 'out'
    }
  }

  _onTabSwitch = tab => {
    return () => {
      this.setState({ tab })
    }
  }

  _renderItem = (bookingId, departureId) => {
    const { tab } = this.state
    return ({ item }) => (

      /**
       * TODO:
       *
       * Bad code.
       * Had to do that to execute the constructor of <OrderItem />
       * again when parent re-render.
       */
      <View>
        {tab === TABS.HOME && <OrderItem bookingId={bookingId} departureId={departureId} pax={item} direction={tab} />}
        {tab === TABS.OUT && <OrderItem bookingId={bookingId} departureId={departureId} pax={item} direction={tab} />}
      </View>
    )
  }

  _resetOrders = (departureId, bookingId) => {
    return () => {
      actionDispatcher(resetAllOrderIndividualMode({
        departureId, bookingId
      }))
    }
  }

  render () {
    const { navigation } = this.props
    const { tab } = this.state
    const booking = navigation.getParam('booking')
    const brand = navigation.getParam('brand')
    const departureId = navigation.getParam('departureId')
    const bookingId = String(booking.get('id'))
    const pax = booking.get('pax')
    const title = `${_T('title')} - ${bookingId}`
    return (
      <Container>
        <Header left='back' title={title} navigation={navigation} brand={brand} />

        <ListItem style={ss.header}>
          <Left style={ss.headerLeft}>
            <Text style={ss.headerText}>{_T('header')}</Text>
            <TouchableOpacity style={ss.reset} onPress={this._resetOrders(departureId, bookingId)}>
              <IonIcon name='undo' size={22} />
            </TouchableOpacity>
          </Left>
          <Right style={ss.headerRight}>
            <OutHomeTab selected={tab} onPress={this._onTabSwitch} />
          </Right>
        </ListItem>

        {/* <ImmutableVirtualizedList
          contentContainerStyle={ss.scroll}
          immutableData={pax}
          renderItem={this._renderItem(bookingId, departureId)}
          keyExtractor={item => String(item.get('id'))}
          ListFooterComponent={
            <View style={ss.invoicee}>
              <InvoiceeSelection
                items={pax}
                label={_T('invoicee')}
                bookingId={bookingId}
                departureId={departureId}
              />
            </View>
          }
        /> */}

        <SummaryOrderItem
          direction={tab}
          booking={booking}
          bookingId={bookingId}
          departureId={departureId}
        />

      </Container>
    )
  }
}

const ss = StyleSheet.create({
  scroll: {
    paddingBottom: isIphoneX ? 20 : 0
  },
  header: {
    marginRight: 15,
    paddingBottom: 5,
    borderBottomColor: Colors.steel,
    borderBottomWidth: 1,
    paddingRight: 0,
    marginLeft: 15,
    marginBottom: 10
  },
  headerLeft: {
    flex: 3
  },
  headerRight: {
    flex: 2
  },
  headerText: {
    fontWeight: 'bold'
  },
  invoicee: {
    margin: 20
  },
  reset: {
    paddingHorizontal: 20
  }
})
