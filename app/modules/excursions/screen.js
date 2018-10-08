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
    return !nextProps.currentTrip.equals(this.props.currentTrip)
  }

  render () {
    const { currentTrip, navigation } = this.props
    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} />
        <Excursions
          trip={currentTrip.get('trip')}
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
