
import React, { Component } from 'react'
import {
  View, ListItem, Text, CheckBox, Body
} from 'native-base'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { getOrderMode } from '../selectors'
import { actionDispatcher } from '../utils/actionDispatcher'
import { toggleOrderMode } from '../modules/profile/action'
import DisableContent from '../components/disableContent'

const INDIVIDUAL_MODE = 'INDIVIDUAL'
const SUMMARY_MODE = 'SUMMARY'

class LunchOrderMode extends Component {
  _toggleOrderMode = mode => {
    return () => {
      actionDispatcher(toggleOrderMode({ mode }))
    }
  }

  render () {
    const { orderMode, isAnyOrder } = this.props
    return (
      <View style={ss.container}>

        {isAnyOrder && <DisableContent />}

        <ListItem style={ss.header}>
          <View>
            <Text style={ss.boldText}>Lunch order mode</Text>
            <Text note style={ss.italic}>
              Once at least one order is placed, mode switching will be disabled
            </Text>
          </View>
        </ListItem>

        <View style={ss.options}>
          <ListItem style={ss.item} onPress={this._toggleOrderMode(INDIVIDUAL_MODE)}>
            <CheckBox disabled checked={orderMode === INDIVIDUAL_MODE} />
            <Body style={ss.right}>
              <Text>Individual passengers. Place order for each passengers individually.</Text>
            </Body>
          </ListItem>

          <ListItem style={ss.item} onPress={this._toggleOrderMode(SUMMARY_MODE)}>
            <CheckBox disabled checked={orderMode === SUMMARY_MODE} />
            <Body style={ss.right}>
              <Text>Summary mode. Extra explanatory text for this mode.</Text>
            </Body>
          </ListItem>
        </View>

      </View>
    )
  }
}

const stateToProps = state => ({
  orderMode: getOrderMode(state)
})

export default connect(stateToProps, null)(LunchOrderMode)

const ss = StyleSheet.create({
  container: {
    marginVertical: 10
  },
  boldText: {
    fontWeight: 'bold'
  },
  header: {
    paddingBottom: 10,
    borderBottomWidth: 0
  },
  italic: {
    fontStyle: 'italic'
  },
  item: {
    borderBottomWidth: 0,
    paddingTop: 5,
    paddingBottom: 10
  },
  options: {

  },
  left: {
    flex: 0.5
  },
  right: {
    flex: 4
  }
})
