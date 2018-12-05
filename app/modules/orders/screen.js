
import React, { Component } from 'react'
import {
  Container, ListItem, Left, Right,
  Text
} from 'native-base'
import { StyleSheet } from 'react-native'
import Header from '../../components/header'
import Translator from '../../utils/translator'
import OrderItem from '../../components/orderItem'
import isIphoneX from '../../utils/isIphoneX'
import OutHomeTab, { TABS } from '../../components/outHomeTab'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { Colors } from '../../theme'

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

  _renderItem = bookingId => {
    const { tab } = this.state
    return ({ item }) => (
      <OrderItem
        bookingId={bookingId}
        pax={item}
        direction={tab}
      />
    )
  }

  render () {
    const { navigation } = this.props
    const { tab } = this.state
    const booking = navigation.getParam('booking')
    const brand = navigation.getParam('brand')
    const bookingId = String(booking.get('id'))
    const pax = booking.get('pax')
    const title = `${_T('title')} - ${bookingId}`
    return (
      <Container>
        <Header left='back' title={title} navigation={navigation} brand={brand} />

        <ListItem style={ss.header}>
          <Left style={ss.headerLeft}>
            <Text style={ss.headerText}>Lunch orders</Text>
          </Left>
          <Right style={ss.headerRight}>
            <OutHomeTab selected={tab} onPress={this._onTabSwitch} />
          </Right>
        </ListItem>

        <ImmutableVirtualizedList
          contentContainerStyle={ss.scroll}
          immutableData={pax}
          renderItem={this._renderItem(bookingId)}
          keyExtractor={item => String(item.get('id'))}
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
    borderBottomColor: Colors.black,
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
  }
})
