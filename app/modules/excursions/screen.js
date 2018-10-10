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
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='excursion' color={tintColor} />
    }
  }

  shouldComponentUpdate (nextProps) {
    return !nextProps.trip.equals(this.props.trip)
  }

  render () {
    const { trip, navigation } = this.props
    const brand = trip.get('brand')
    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} brand={brand} />
        <Excursions
          trip={trip}
          navigation={navigation}
          brand={brand}
        />
      </Container>
    )
  }
}

const stateToProps = state => ({
  trip: currentTripSelector(state).get('trip')
})

export default connect(stateToProps, null)(ExcursionsScreen)
