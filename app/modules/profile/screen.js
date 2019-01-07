
import React, { Component } from 'react'
import { Container, View } from 'native-base'
import { StyleSheet, ScrollView } from 'react-native'
import Header from '../../components/header'
import { userDetailsReq, updateProfileReq } from './action'
import {
  actionDispatcher,
  networkActionDispatcher
} from '../../utils/actionDispatcher'
import { getProfile, getUser, checkIfAnyOrderMade } from '../../selectors'
import { connect } from 'react-redux'
import Profile from '../../components/profile'
import Settings from '../../components/settings'
import LunchOrderMode from '../../components/lunchOrderMode'
import NoData from '../../components/noData'
import isIphoneX from '../../utils/isIphoneX'
import { Colors } from '../../theme'

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
        <NoData text='fetchingData' textStyle={ss.noData} />
      </View>
    )
  }

  render () {
    const { navigation, isAnyOrder, profile, user } = this.props
    const fullName = `${user.get('firstName')} ${user.get('lastName')}`
    const userDetails = profile.get('user')
    return (
      <Container>
        <Header left='back' title={fullName} navigation={navigation} />
        <ScrollView contentContainerStyle={ss.scroll}>
          {
            !userDetails.size
              ? this._renderLoader()
              : <Profile style={ss.profile} userDetails={userDetails} onUpdate={this._updateProfile} />
          }

          <Settings />
          <LunchOrderMode isAnyOrder={isAnyOrder} />
        </ScrollView>
      </Container>
    )
  }
}

const stateToProps = (state, props) => {
  const departureId = props.navigation.getParam('departureId')
  return {
    profile: getProfile(state),
    user: getUser(state),
    isAnyOrder: checkIfAnyOrderMade(state, departureId)
  }
}

export default connect(stateToProps, null)(ProfileScreen)

const ss = StyleSheet.create({
  profile: {
    flex: 5,
    borderBottomWidth: 1,
    borderBottomColor: Colors.steel
  },
  scroll: {
    paddingBottom: isIphoneX ? 20 : 10
  },
  noData: {
    marginTop: 30,
    marginBottom: 100
  }
})
