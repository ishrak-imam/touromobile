import React, { Component } from 'react'
import {
  Container, Content
} from 'native-base'
import Header from '../../components/header'
import { IonIcon } from '../../theme/'
import Translator from '../../utils/translator'
import { connect } from 'react-redux'
import { getCurrentTrip } from '../../selectors'
import Excursions from '../../components/excursions'
const _T = Translator('ExcursionsScreen')

class ExcursionsScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='excursion' size={25} color={tintColor} />
    }
  }

  render () {
    const { currentTrip, navigation } = this.props
    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} />
        <Content>
          <Excursions
            trip={currentTrip.get('data')}
            navigation={navigation}
          />
        </Content>
      </Container>
    )
  }
}

const stateToProps = state => ({
  currentTrip: getCurrentTrip(state)
})

export default connect(stateToProps, dispatch => ({ dispatch }))(ExcursionsScreen)
