import React, { Component } from 'react'
import {
  Container
} from 'native-base'
import Header from '../../components/header'
import { IonIcon } from '../../theme/'
import Translator from '../../utils/translator'
import { connect } from 'react-redux'
import { currentTripSelector } from '../../selectors'
import Excursions from '../../components/excursions'
const _T = Translator('ExcursionsScreen')

class ExcursionsScreen extends Component {
  static navigationOptions = () => {
    return {
      tabBarIcon: ({ focused, tintColor }) => {
        return <IonIcon name='excursion' color={tintColor} />
      },
      tabBarLabel: _T('title')
    }
  }

  shouldComponentUpdate (nextProps) {
    return !nextProps.currentTrip.equals(this.props.currentTrip)
  }

  render () {
    const { currentTrip, navigation } = this.props
    const trip = currentTrip.get('trip')
    const brand = trip.get('brand')

    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} brand={brand} />
        <Excursions
          trip={trip}
          navigation={navigation}
        />
      </Container>
    )
  }
}

const stateToProps = state => ({
  currentTrip: currentTripSelector(state)
})

export default connect(stateToProps, null)(ExcursionsScreen)
