
import React, { Component } from 'react'
import { View, Body, Text, ListItem } from 'native-base'
import { StyleSheet } from 'react-native'
import { toggleTabLabels } from '../modules/profile/action'
import { hideMyNumberToggle } from '../modules/sms/action'
import { actionDispatcher } from '../utils/actionDispatcher'
import { getProfile, getHideMyPhone } from '../selectors'
import { connect } from 'react-redux'
import _T from '../utils/translator'
import CheckBox from './checkBox'

class Settings extends Component {
  shouldComponentUpdate (nextProps) {
    return nextProps.profile.get('showLabel') !== this.props.profile.get('showLabel') ||
          nextProps.hideMyPhone !== this.props.hideMyPhone
  }

  _toggleLabel = () => {
    actionDispatcher(toggleTabLabels())
  }

  _toggleHideMyPhone = () => {
    actionDispatcher(hideMyNumberToggle())
  }

  render () {
    const { profile, hideMyPhone } = this.props
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
            <CheckBox checked={showLabel} />
            <Body style={ss.right}>
              <Text>{_T('showHideTabLabels')}</Text>
            </Body>
          </ListItem>
        </View>

        <ListItem style={ss.header}>
          <View>
            <Text style={ss.boldText}>{_T('hidePrivatePhone')}</Text>
          </View>
        </ListItem>
        <View style={ss.options}>
          <ListItem style={ss.private} onPress={this._toggleHideMyPhone}>
            <CheckBox checked={hideMyPhone} />
            <Body style={ss.right}>
              <Text>{_T('sendSmsWithTouro')}</Text>
              <Text note style={ss.italic}>{_T('useTouroPrivatePhone')}</Text>
            </Body>
          </ListItem>
        </View>
      </View>

    )
  }
}

const stateToProps = state => ({
  profile: getProfile(state),
  hideMyPhone: getHideMyPhone(state)
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
    paddingTop: 5,
    paddingBottom: 10
  },
  private: {
    borderBottomWidth: 0,
    paddingTop: 5,
    paddingBottom: 10,
    alignItems: 'flex-start'
  },
  italic: {
    fontStyle: 'italic',
    marginTop: 10
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
