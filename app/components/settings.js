
import React, { Component } from 'react'
import {
  View, CheckBox,
  Body, Text, ListItem
} from 'native-base'
import { StyleSheet } from 'react-native'
import { toggleTabLabels } from '../modules/profile/action'
import { actionDispatcher } from '../utils/actionDispatcher'
import { getProfile } from '../selectors'
import { connect } from 'react-redux'
import Translator from '../utils/translator'

const _T = Translator('ProfileScreen')

class Settings extends Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.profile.get('showLabel') !== this.props.profile.get('showLabel')
  }

  _toggleLabel = () => {
    actionDispatcher(toggleTabLabels())
  }

  render () {
    const { profile } = this.props
    const showLabel = profile.get('showLabel')
    return (
      <View style={ss.container}>
        <ListItem style={ss.header}>
          <View>
            <Text style={ss.boldText}>{_T('tabLabels')}</Text>
          </View>
        </ListItem>
        <View style={ss.options}>
          <ListItem style={ss.item} onPress={this._toggleLabel}>
            <CheckBox disabled checked={showLabel} />
            <Body style={ss.right}>
              <Text>{_T('showHideTabLabels')}</Text>
            </Body>
          </ListItem>
        </View>
      </View>

    )
  }
}

const stateToProps = state => ({
  profile: getProfile(state)
})

export default connect(stateToProps, null)(Settings)

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
  item: {
    borderBottomWidth: 0,
    paddingTop: 10,
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
