
import React, { Component } from 'react'
import {
  Container, View, CheckBox,
  Body, Left, CardItem, Text
} from 'native-base'
import { StyleSheet } from 'react-native'
import Header from '../../components/header'
import { toggleTabLabels, userDetailsReq } from './action'
import {
  actionDispatcher,
  networkActionDispatcher
} from '../../utils/actionDispatcher'
import { getProfile, getUser } from '../../selectors'
import { connect } from 'react-redux'
import { Colors } from '../../theme'
import Profile from '../../components/profile'

class Settings extends Component {
  render () {
    const { showLabel, toggleLabel, style } = this.props
    return (
      <View style={style}>
        <CardItem>
          <Left style={ss.left}>
            <CheckBox
              checked={showLabel}
              onPress={toggleLabel}
            />
          </Left>
          <Body style={ss.body}>
            <Text>Show tab labels</Text>
          </Body>
        </CardItem>
      </View>
    )
  }
}

class ProfileScreen extends Component {
  componentDidMount () {
    const { user } = this.props
    networkActionDispatcher(userDetailsReq({
      isNeedJwt: true, guideId: user.get('id')
    }))
  }

  _toggleLabel = () => {
    actionDispatcher(toggleTabLabels())
  }

  render () {
    const { navigation, profile, user } = this.props
    const fullName = `${user.get('firstName')} ${user.get('lastName')}`
    const showLabel = profile.get('showLabel')
    return (
      <Container>
        <Header left='back' title={fullName} navigation={navigation} />
        <Profile style={ss.profile} />
        <Settings style={ss.settings} showLabel={showLabel} toggleLabel={this._toggleLabel} />
      </Container>
    )
  }
}

const stateToProps = state => ({
  profile: getProfile(state),
  user: getUser(state)
})

export default connect(stateToProps, null)(ProfileScreen)

const ss = StyleSheet.create({
  profile: {
    flex: 5
  },
  settings: {
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
