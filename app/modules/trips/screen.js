import React, { Component } from 'react'
import {
  Container
} from 'native-base'
import Header from '../../components/header'
import { IonIcon, Colors } from '../../theme/'
import { connect } from 'react-redux'
import Translator from '../../utils/translator'
import { StyleSheet, TouchableOpacity } from 'react-native'
import {
  tripsReq,
  getCurrentTrip,
  getFutureTrips,
  getPastTrips,
  getPendingStatsUpload
} from './action'
import {
  networkActionDispatcher, actionDispatcher
} from '../../utils/actionDispatcher'
import Trip from '../../components/trip'
import { getTrips, getUser } from '../../selectors'
import NoData from '../../components/noData'

const _T = Translator('CurrentTripScreen')

class TripScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='home' color={tintColor} />
    }
  }

  shouldComponentUpdate (nextProps) {
    return !nextProps.trips.equals(this.props.trips)
  }

  _pendingModalOk = () => {
    this.props.navigation.navigate('PastTrips')
  }

  componentDidMount () {
    const { trips } = this.props
    const hasLocalData = trips.get('data').size > 0
    if (!hasLocalData) {
      this._requestTrips()
    } else {
      actionDispatcher(getCurrentTrip())
      actionDispatcher(getFutureTrips())
      actionDispatcher(getPastTrips())
      actionDispatcher(getPendingStatsUpload({
        showWarning: false,
        msg: 'pending stats upload',
        onOk: this._pendingModalOk
      }))
    }
  }

  _requestTrips = () => {
    const { user } = this.props
    networkActionDispatcher(tripsReq({
      isNeedJwt: true, guideId: user.get('id')
    }))
  }

  _onRefresh = () => {
    this._requestTrips()
  }

  _renderRight = () => {
    const iconColor = Colors.silver
    const iconSize = 30
    return (
      <TouchableOpacity style={ss.headerRight} onPress={this._onRefresh}>
        <IonIcon
          name='refresh'
          color={iconColor}
          size={iconSize}
          style={{ paddingRight: 5 }}
        />
      </TouchableOpacity>
    )
  }

  render () {
    const { navigation, trips } = this.props
    const isLoading = trips.get('isLoading')
    const current = trips.get('current')
    const brand = current.get('trip').get('brand')

    return (
      <Container>
        <Header
          left='menu'
          title={_T('title')}
          navigation={navigation}
          brand={brand}
          right={this._renderRight()}
        />
        {
          isLoading
            ? <NoData text='fetchingData' textStyle={{ marginTop: 30 }} />
            : current.get('has')
              ? current.get('has') && <Trip trip={current.get('trip')} navigation={navigation} />
              : <NoData text='noCurrentTrip' textStyle={{ marginTop: 30 }} />
        }
      </Container>

    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state),
  user: getUser(state)
})

export default connect(stateToProps, null)(TripScreen)

const ss = StyleSheet.create({
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 5
  }
})
