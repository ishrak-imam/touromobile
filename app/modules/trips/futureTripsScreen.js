
import React, { Component } from 'react'
import {
  Container
} from 'native-base'
import Header from '../../components/header'
// import { IonIcon } from '../../theme/'
import { connect } from 'react-redux'
import { getTrips } from '../../selectors/index'
import Translator from '../../utils/translator'

const _T = Translator('FutureTripsScreen')

class FutureTripsScreen extends Component {
  // static navigationOptions = {
  //   tabBarIcon: ({ focused, tintColor }) => {
  //     return <IonIcon name='futureTrips' color={tintColor} />
  //   }
  // }

  shouldComponentUpdate (nextProps) {
    return !nextProps.trips.equals(this.props.trips)
  }

  render () {
    const { navigation } = this.props
    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} />
      </Container>
    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state)
})

export default connect(stateToProps, null)(FutureTripsScreen)
