
import React, { Component } from 'react'
import { Container, View } from 'native-base'
import { StyleSheet, ScrollView } from 'react-native'
import Header from '../../components/header'
import {
  userDetailsReq, updateProfileReq,
  downloadAppDataReq
} from './action'
import {
  actionDispatcher,
  networkActionDispatcher
} from '../../utils/actionDispatcher'
import {
  getProfile, getUser,
  currentTripSelector, getTripsLoading
} from '../../selectors'
import { connect } from 'react-redux'
import Profile from '../../components/profile'
import Settings from '../../components/settings'
import NoData from '../../components/noData'
import isIphoneX from '../../utils/isIphoneX'
import { Colors } from '../../theme'
import AppDataSync from '../../components/appDataSync'
import _T from '../../utils/translator'
import { refresh as refreshData } from '../../utils/autoRefreshTripData'

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

  _onDownloadData = guideId => () => {
    actionDispatcher(downloadAppDataReq({
      guideId,
      isNeedJwt: true,
      showToast: true,
      sucsMsg: _T('dataSyncSucs'),
      failMsg: _T('dataSyncFail')
    }))
  }

  render () {
    const { navigation, profile, user, tripsLoading } = this.props
    const fullName = `${user.get('firstName')} ${user.get('lastName')}`
    const userDetails = profile.get('user')
    const isLoading = profile.get('isLoading')
    const guideId = user.get('guideId')

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
          <AppDataSync
            header={_T('appData')}
            text={_T('dataSyncText')}
            button={_T('syncNow')}
            onSync={this._onDownloadData(guideId)}
            isLoading={isLoading}
          />

          <AppDataSync
            header={_T('tripData')}
            text={_T('dailyTripDataRefresh')}
            button={_T('refreshNow')}
            onSync={refreshData(true)}
            isLoading={tripsLoading}
          />

        </ScrollView>
      </Container>
    )
  }
}

const stateToProps = (state, props) => {
  return {
    profile: getProfile(state),
    user: getUser(state),
    currentTrip: currentTripSelector(state),
    tripsLoading: getTripsLoading(state)
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
