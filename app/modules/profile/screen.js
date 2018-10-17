
import React, { Component } from 'react'
import {
  Container, View, CheckBox
} from 'native-base'
import Header from '../../components/header'
import { toggleTabLabels } from './action'
import { actionDispatcher } from '../../utils/actionDispatcher'
import { getProfile } from '../../selectors'
import { connect } from 'react-redux'

class ProfileScreen extends Component {
  _toggleLabel = () => {
    actionDispatcher(toggleTabLabels())
  }

  render () {
    const { navigation, profile } = this.props
    const labelVisible = profile.get('labelVisible')
    return (
      <Container>
        <Header left='back' title='Profile' navigation={navigation} />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <CheckBox
            checked={labelVisible}
            onPress={this._toggleLabel}
          />
        </View>
      </Container>
    )
  }
}

const stateToProps = state => ({
  profile: getProfile(state)
})

export default connect(stateToProps, null)(ProfileScreen)
