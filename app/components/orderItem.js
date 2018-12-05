
import React, { Component } from 'react'
import {
  View, ListItem, Left, Text,
  Right, CheckBox
} from 'native-base'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import RadioButton from './radioButton'
import { getLunches } from '../selectors'

class OrderItem extends Component {
  constructor (props) {
    super(props)
    this.state = {
      child: false
    }
  }

  _toggleChild = () => {
    this.setState({ child: !this.state.child })
  }

  render () {
    const { child } = this.state
    const { lunches, pax, bookingId, direction } = this.props
    const paxName = `${pax.get('firstName')} ${pax.get('lastName')}`
    let meals = lunches.get(direction).get('meals')

    meals = child
      ? meals.filter(m => child && !!m.get('child'))
      : meals.filter(m => !!m.get('adult'))

    return (
      <View style={ss.orderItem}>

        <ListItem style={ss.header}>
          <Left style={ss.headerLeft}>
            <Text style={ss.boldText}>{paxName}</Text>
          </Left>
          <Right style={ss.headerRight}>
            <TouchableOpacity style={ss.childCheck} onPress={this._toggleChild}>
              <Text style={ss.boldText}>Child</Text>
              <CheckBox disabled checked={child} />
            </TouchableOpacity>
          </Right>
        </ListItem>

        <RadioButton
          items={meals}
          label='Meals'
          direction={direction}
          isChild={child}
        />

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
    flex: 4,
    alignItems: 'center'
  },
  headerRight: {
    flex: 1
  },
  childCheck: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 15
  },
  boldText: {
    fontWeight: 'bold'
  }
})
