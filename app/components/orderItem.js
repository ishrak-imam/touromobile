
import React, { Component } from 'react'
import {
  View, ListItem, Left, Text,
  Right
} from 'native-base'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import OutHomeTab, { TABS } from './outHomeTab'
import RadioButton from './radioButton'
import { getLunches } from '../selectors'

class OrderItem extends Component {
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
    const { lunches, pax } = this.props
    const paxName = `${pax.get('firstName')} ${pax.get('lastName')}`
    const meals = lunches.get(tab).get('meals')
    return (
      <View style={ss.orderItem}>

        <ListItem style={ss.header}>
          <Left style={ss.headerLeft}>
            <Text style={{ fontWeight: 'bold' }}>{paxName}</Text>
          </Left>
          <Right style={ss.headerRight}>
            <OutHomeTab selected={tab} onPress={this._onTabSwitch} />
          </Right>
        </ListItem>

        <RadioButton items={meals} label='Meals' direction={tab} />

      </View>
    )
  }
}

const stateToProps = state => ({
  lunches: getLunches(state)
})

export default connect(stateToProps, null)(OrderItem)

const ss = StyleSheet.create({
  orderItem: {
    paddingLeft: 20,
    marginBottom: 20
  },
  header: {
    borderBottomWidth: 0,
    marginLeft: 0
  },
  headerLeft: {
    flex: 3
  },
  headerRight: {
    flex: 2
  }
})
