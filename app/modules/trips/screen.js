import React, { Component } from 'react'
import { Container } from 'native-base'
import Header from '../../components/header'
import { IonIcon } from '../../theme/'
import { connect } from 'react-redux'
import _T from '../../utils/translator'
import {
  tripsReq,
  connectionsReq
} from './action'
import {
  networkActionDispatcher, actionDispatcher
} from '../../utils/actionDispatcher'
import Trip from '../../components/trip'
import { getTrips, getUser } from '../../selectors'
import NoData from '../../components/noData'
import { ScrollView, RefreshControl } from 'react-native'
import OverlaySpinner from '../../components/overlaySpinner'
import { restructureModifiedData } from '../modifiedData/action'

class TripScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      showContent: false
    }
    this.pendingModal = {
      showWarning: false,
      msg: _T('pendingStats'),
      onOk: this._pendingModalOk
    }
  }

  componentDidMount () {
    actionDispatcher(restructureModifiedData())
    this._showContent()
  }

  _showContent = () => {
    setTimeout(() => this.setState({ showContent: true }), 10)
  }

  static navigationOptions = () => {
    return {
      tabBarIcon: ({ focused, tintColor }) => {
        return <IonIcon name='home' color={tintColor} />
      },
      tabBarLabel: _T('currentTrip')
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    return !nextProps.trips.equals(this.props.trips) ||
            nextState.showContent !== this.state.showContent
  }

  _pendingModalOk = () => {
    this.props.navigation.navigate('PastTrips')
  }

  _requestTrips = isRefreshing => {
    const { user } = this.props
    networkActionDispatcher(tripsReq({
      isNeedJwt: true,
      guideId: user.get('guideId'),
      isRefreshing,
      pendingModal: this.pendingModal
    }))
  }

  _requestConnections = () => {
    networkActionDispatcher(connectionsReq({
      isNeedJwt: true
    }))
  }

  _onRefresh = () => {
    this._requestTrips(true)
    this._requestConnections()
  }

  render () {
    const { showContent } = this.state
    const { navigation, trips } = this.props
    const isLoading = trips.get('isLoading')
    const isRefreshing = trips.get('isRefreshing')
    const current = trips.get('current')
    const brand = current.get('trip').get('brand')
    const left = navigation.getParam('left')

    return (
      <Container>
        <Header
          left={left}
          title={_T('currentTrip')}
          navigation={navigation}
          brand={brand}
        />
        {isRefreshing && <OverlaySpinner />}
        {
          showContent &&
          <ScrollView
            contentContainerStyle={{ justifyContent: 'center' }}
            refreshControl={<RefreshControl refreshing={false} onRefresh={this._onRefresh} />}
          >
            {
              isLoading
                ? <NoData text='fetchingData' textStyle={{ marginTop: 30 }} />
                : current.get('has')
                  ? <Trip trip={current.get('trip')} navigation={navigation} />
                  : <NoData text='noCurrentTrip' textStyle={{ marginTop: 30 }} />
            }
          </ScrollView>
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
