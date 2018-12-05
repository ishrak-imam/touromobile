
import React, { Component } from 'react'
import {
  View, ListItem, Left, Text,
  Right
} from 'native-base'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import RadioButton from './radioButton'
import { getLunches } from '../selectors'

class OrderItem extends Component {
  render () {
    const { lunches, pax, bookingId, direction } = this.props
    const paxName = `${pax.get('firstName')} ${pax.get('lastName')}`
    const meals = lunches.get(direction).get('meals')
    return (
      <View style={ss.orderItem}>

        <ListItem style={ss.header}>
          <Left style={ss.headerLeft}>
            <Text style={{ fontWeight: 'bold' }}>{paxName}</Text>
          </Left>
        </ListItem>

        <RadioButton items={meals} label='Meals' direction={direction} />

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
    paddingLeft: 15,
    marginBottom: 10
  },
  header: {
    paddingBottom: 10,
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
