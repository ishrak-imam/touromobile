import React, { Component } from 'react'
import {
  Container
} from 'native-base'
import { StyleSheet, View } from 'react-native'
import Header from '../../components/header'
import { IonIcon, Colors } from '../../theme'
import { connect } from 'react-redux'
import Translator from '../../utils/translator'
import { currentTripSelector } from '../../selectors'
import PaxList from '../../components/paxList'
import BookingList from '../../components/bookingList'
import Switch from '../../components/switch'
const _T = Translator('PassengersScreen')

class PaxScreen extends Component {
  static navigationOptions = () => {
    return {
      tabBarIcon: ({ focused, tintColor }) => {
        return <IonIcon name='people' color={tintColor} />
      },
      tabBarLabel: _T('paxTitle')
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      booking: false
    }
  }

  shouldComponentUpdate (nextProps, nexState) {
    const propsChanged = !nextProps.currentTrip.equals(this.props.currentTrip)
    const stateChanged = nexState !== this.state
    return propsChanged || stateChanged
  }

  _renderRight = brand => {
    const { booking } = this.state
    const iconColor = Colors.silver
    const switchColor = Colors[`${brand}Brand`] || Colors.blue
    const iconSize = 16
    return (
      <View style={ss.headerRight}>
        <IonIcon name='people' color={iconColor} size={iconSize} style={{ paddingRight: 5 }} />
        <Switch
          isOn={booking}
          onColor={switchColor}
          offColor={switchColor}
          onToggle={this._onToggle}
        />
        <IonIcon name='booking' color={iconColor} size={iconSize} style={{ paddingLeft: 5 }} />
      </View>
    )
  }

  _onToggle = v => {
    this.setState({ booking: !this.state.booking })
  }

  render () {
    const { navigation, currentTrip } = this.props
    const { booking } = this.state
    const trip = currentTrip.get('trip')

    const brand = trip.get('brand')

    return (
      <Container>
        <Header
          left='menu'
          title={booking ? _T('bookingTitle') : _T('paxTitle')}
          navigation={navigation}
          right={this._renderRight(brand)}
          brand={brand}
        />
        {
          this.state.booking
            ? <BookingList trip={trip} navigation={navigation} />
            : <PaxList trip={trip} navigation={navigation} />
        }
      </Container>
    )
  }
}

const stateToProps = state => ({
  currentTrip: currentTripSelector(state)
})

export default connect(stateToProps, dispatch => ({ dispatch }))(PaxScreen)

const ss = StyleSheet.create({
  headerRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginRight: 5
  }
})
