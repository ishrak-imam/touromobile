
import React, { Component } from 'react'
import {
  Container
} from 'native-base'
// import { StyleSheet, TouchableOpacity } from 'react-native'
import Header from '../../components/header'
// import { IonIcon, Colors } from '../../theme'
import FutureTrips from '../../components/futureTrips'
import { connect } from 'react-redux'
import { getUser, getTrips } from '../../selectors/index'
import Translator from '../../utils/translator'
import { networkActionDispatcher } from '../../utils/actionDispatcher'
import { tripsReq } from './action'
// import NoData from '../../components/noData'

const _T = Translator('FutureTripsScreen')

class FutureTripsScreen extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.trips.equals(this.props.trips)
  }

  _onRefresh = () => {
    const { user } = this.props
    networkActionDispatcher(tripsReq({
      isNeedJwt: true, guideId: user.get('guideId')
    }))
  }

  // _renderRight = () => {
  //   const iconColor = Colors.silver
  //   const iconSize = 30
  //   return (
  //     <TouchableOpacity style={ss.headerRight} onPress={this._onRefresh}>
  //       <IonIcon
  //         name='refresh'
  //         color={iconColor}
  //         size={iconSize}
  //         style={{ paddingRight: 5 }}
  //       />
  //     </TouchableOpacity>
  //   )
  // }

  render () {
    const { navigation, trips } = this.props
    const futureTrips = trips.get('future')
    const isLoading = trips.get('isLoading')

    return (
      <Container>
        <Header
          left='back'
          title={_T('title')}
          navigation={navigation}
          // right={this._renderRight()}
        />
        {/* {
          isLoading
            ? <NoData text='fetchingData' textStyle={{ marginTop: 30 }} />
            : <FutureTrips futureTrips={futureTrips} refreshing={isLoading} />
        } */}
        <FutureTrips
          futureTrips={futureTrips}
          refreshing={isLoading}
          onRefresh={this._onRefresh}
        />
      </Container>
    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state),
  user: getUser(state)
})

export default connect(stateToProps, null)(FutureTripsScreen)

// const ss = StyleSheet.create({
//   headerRight: {
//     flex: 1,
//     flexDirection: 'row',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     marginRight: 5
//   }
// })
