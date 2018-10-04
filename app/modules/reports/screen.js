import React, { Component } from 'react'
import {
  Container
} from 'native-base'
import { IonIcon } from '../../theme/'
import Header from '../../components/header'
import Translator from '../../utils/translator'
import { getTrips } from '../../selectors'
import Stats from '../../components/stats'
import { connect } from 'react-redux'
const _T = Translator('ReportsScreen')

class ReportsScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='report' color={tintColor} />
    }
  }

  render () {
    const { trips, navigation } = this.props
    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} />
        <Stats
          trip={trips.getIn(['current', 'trip'])}
          navigation={navigation}
        />
      </Container>
    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state)
})

export default connect(stateToProps, null)(ReportsScreen)
