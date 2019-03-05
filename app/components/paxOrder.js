
import React, { Component } from 'react'
import {
  ListItem, Left, Right,
  Text, View
} from 'native-base'
import { StyleSheet } from 'react-native'
import { Colors } from '../theme'
import OutHomeTab, { TABS } from './outHomeTab'
import OrderItem from './orderItem'
// import SummaryOrderItem from '../components/summaryOrderItem'
import Translator from '../utils/translator'
import isIphoneX from '../utils/isIphoneX'
import { connect } from 'react-redux'
import { getOrderMode } from '../selectors'
// import { getList } from '../utils/immutable'
import ExcursionOrderIndividualMode from './excursionOrderIndividualMode'

const _T = Translator('OrdersScreen')

const INDIVIDUAL_MODE = 'INDIVIDUAL'
// const SUMMARY_MODE = 'SUMMARY'

class PaxOrder extends Component {
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

  render () {
    const { tab } = this.state
    const { bookingId, departureId, pax, orderMode } = this.props
    return (
      <View style={ss.container}>

        {
          orderMode === INDIVIDUAL_MODE &&
          <ListItem style={ss.header}>
            <Left style={ss.headerLeft}>
              <Text style={ss.headerText}>{_T('lunchOrders')}</Text>
            </Left>
            <Right style={ss.headerRight}>
              <OutHomeTab selected={tab} onPress={this._onTabSwitch} />
            </Right>
          </ListItem>
        }

        {
          orderMode === INDIVIDUAL_MODE &&
          <View>
            {tab === TABS.HOME && <OrderItem bookingId={bookingId} departureId={departureId} pax={pax} direction={tab} />}
            {tab === TABS.OUT && <OrderItem bookingId={bookingId} departureId={departureId} pax={pax} direction={tab} />}
          </View>
        }

        {
          orderMode === INDIVIDUAL_MODE &&
          <ExcursionOrderIndividualMode
            bookingId={bookingId}
            departureId={departureId}
            pax={pax}
          />
        }

        {/* {
          orderMode === SUMMARY_MODE &&
          <SummaryOrderItem
            direction={tab}
            pax={getList([pax])}
            bookingId={bookingId}
            departureId={departureId}
            screen='pax'
          />
        } */}

      </View>
    )
  }
}

const stateToProps = state => ({
  orderMode: getOrderMode(state)
})

export default connect(stateToProps, null)(PaxOrder)

const ss = StyleSheet.create({
  container: {
    marginBottom: isIphoneX ? 30 : 20
  },
  header: {
    marginLeft: 15,
    marginRight: 15,
    paddingBottom: 5,
    borderBottomColor: Colors.steel,
    borderBottomWidth: 1,
    paddingRight: 0,
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
