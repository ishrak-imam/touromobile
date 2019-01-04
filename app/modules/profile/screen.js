
import React, { Component } from 'react'
import { Container, View } from 'native-base'
import { StyleSheet } from 'react-native'
import Header from '../../components/header'
import { userDetailsReq, updateProfileReq } from './action'
import {
  actionDispatcher,
  networkActionDispatcher
} from '../../utils/actionDispatcher'
import { getProfile, getUser } from '../../selectors'
import { connect } from 'react-redux'
import Profile from '../../components/profile'
import Settings from '../../components/settings'
import NoData from '../../components/noData'

class ProfileScreen extends Component {
  componentDidMount () {
    const { user, profile } = this.props
    if (!profile.get('user').size) {
      networkActionDispatcher(userDetailsReq({
        isNeedJwt: true, guideId: user.get('guideId')
      }))
    }
  }

  _updateProfile = data => {
    const { user } = this.props
    actionDispatcher(updateProfileReq({
      isNeedJwt: true,
      guideId: user.get('guideId'),
      ...data
    }))
  }

  _renderLoader () {
    return (
      <View style={ss.profile}>
        <NoData text='fetchingData' textStyle={{ marginTop: 30 }} />
      </View>
    )
  }

  render () {
    const { navigation, profile, user } = this.props
    const fullName = `${user.get('firstName')} ${user.get('lastName')}`
    const userDetails = profile.get('user')
    return (
      <Container>
        <Header left='back' title={fullName} navigation={navigation} />
        {
          !userDetails.size
            ? this._renderLoader()
            : <Profile style={ss.profile} userDetails={userDetails} onUpdate={this._updateProfile} />
        }
        <Settings />
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
  }
})
