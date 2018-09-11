import React, { Component } from 'react'
import {
  Container, Content, Switch, View
} from 'native-base'
import { StyleSheet } from 'react-native'
import Header from '../../components/header'
import { IonIcon, Colors } from '../../theme'
import { connect } from 'react-redux'
import Translator from '../../utils/translator'
import { getCurrentTrip } from '../../selectors'
import PaxList from '../../components/paxList'
const _T = Translator('PassengersScreen')

class PassengersScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='people' size={25} color={tintColor} />
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      booking: false
    }
  }

  _renderRight = () => {
    const { booking } = this.state
    const color = Colors.silver
    const iconSize = 16
    return (
      <View style={ss.headerRight}>
        <IonIcon name='people' color={color} size={iconSize} style={{ paddingRight: 5 }} />
        <Switch
          value={booking}
          tintColor={color}
          onValueChange={v => this.setState({ booking: v })}
          thumbTintColor={color}
          onTintColor={color}
        />
        <IonIcon name='booking' color={color} size={iconSize} style={{ paddingLeft: 5 }} />
      </View>
    )
  }

  render () {
    const { navigation, currentTrip } = this.props
    const { booking } = this.state
    return (
      <Container>
        <Header left='menu' title={_T('title')} navigation={navigation} right={this._renderRight} />
        <Content>
          <PaxList
            trip={currentTrip.get('data')}
            navigation={navigation}
            booking={booking}
          />
        </Content>
      </Container>
    )
  }
}

const stateToProps = state => ({
  currentTrip: getCurrentTrip(state)
})

export default connect(stateToProps, dispatch => ({ dispatch }))(PassengersScreen)

const ss = StyleSheet.create({
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 5
  }
})
