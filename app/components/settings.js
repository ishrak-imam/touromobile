
import React, { Component } from 'react'
import {
  View, CheckBox,
  Body, Left, Text, ListItem
} from 'native-base'
import { StyleSheet } from 'react-native'
import { toggleTabLabels } from '../modules/profile/action'
import { actionDispatcher } from '../utils/actionDispatcher'
import { getProfile } from '../selectors'
import { connect } from 'react-redux'
import { Colors } from '../theme'
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
    console.log('rendr')
    const { profile } = this.props
    const showLabel = profile.get('showLabel')
    return (
      <View style={ss.container}>
        <ListItem onPress={this._toggleLabel}>
          <Left style={ss.left}>
            <CheckBox
              disabled
              checked={showLabel}
            />
          </Left>
          <Body style={ss.body}>
            <Text>{_T('showTabLabels')}</Text>
          </Body>
        </ListItem>
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
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: Colors.steel,
    paddingVertical: 10
  },
  left: {
    flex: 1
  },
  body: {
    flex: 6,
    justifyContent: 'flex-start'
  }
})
