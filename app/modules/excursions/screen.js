import React, { Component } from 'react'
import {
  Container, Content
} from 'native-base'
import Header from '../../components/header'
import { IonIcon } from '../../theme/'
import Translator from '../../utils/translator'
import { connect } from 'react-redux'
import { getTrips } from '../../selectors'
import Excursions from '../../components/excursions'
const _T = Translator('ExcursionsScreen')

class ExcursionsScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='excursion' size={25} color={tintColor} />
    }
  }

  render () {
    const { trips, navigation } = this.props
    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} />
        <Content>
          <Excursions
            trip={trips.getIn(['current', 'trip'])}
            navigation={navigation}
          />
        </Content>
      </Container>
    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state)
})

export default connect(stateToProps, dispatch => ({ dispatch }))(ExcursionsScreen)
