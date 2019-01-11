
import React, { Component } from 'react'
import {
  View, ListItem, Text, Body
} from 'native-base'
import { StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { getOrderMode } from '../selectors'
import { actionDispatcher } from '../utils/actionDispatcher'
import { toggleOrderMode } from '../modules/profile/action'
import Translator from '../utils/translator'
import CheckBox from './checkBox'

const _T = Translator('ProfileScreen')

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

        <ListItem style={ss.header}>
          <View>
            <Text style={ss.boldText}>{_T('lunchOrderMode')}</Text>
            <Text note style={ss.italic}>
              {_T('modeText')}
            </Text>
          </View>
        </ListItem>

        <View style={ss.options}>
          <ListItem style={ss.item} disabled={isAnyOrder} onPress={this._toggleOrderMode(INDIVIDUAL_MODE)}>
            <CheckBox disabled={isAnyOrder} checked={orderMode === INDIVIDUAL_MODE} />
            <Body style={ss.right}>
              <Text>{_T('individualMode')}</Text>
            </Body>
          </ListItem>

          <ListItem style={ss.item} disabled={isAnyOrder} onPress={this._toggleOrderMode(SUMMARY_MODE)}>
            <CheckBox disabled={isAnyOrder} checked={orderMode === SUMMARY_MODE} />
            <Body style={ss.right}>
              <Text>{_T('summaryMode')}</Text>
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
