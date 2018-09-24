import React, { Component } from 'react'
import {
  Container, Switch, View
} from 'native-base'
import { StyleSheet } from 'react-native'
import Header from '../../components/header'
import { IonIcon, Colors } from '../../theme'
import { connect } from 'react-redux'
import Translator from '../../utils/translator'
import { getTrips } from '../../selectors'
import PaxList from '../../components/paxList'
import BookingList from '../../components/bookingList'
const _T = Translator('PassengersScreen')

class PaxScreen extends Component {
  static navigationOptions = {
    tabBarIcon: ({ focused, tintColor }) => {
      return <IonIcon name='people' size={25} color={tintColor} />
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      booking: false,
      search: false
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

  _searchToggle = toggle => this.setState({ search: toggle })

  _onSearch = text => {
    console.log(text)
  }

  render () {
    const { navigation, trips } = this.props
    const { booking } = this.state
    const trip = trips.getIn(['current', 'trip'])
    const searchConfig = {
      toggle: this._searchToggle,
      placeHolder: _T('paxSearch'),
      icon: 'people',
      onSearch: this._onSearch
    }

    return (
      <Container>
        <Header
          left='menu'
          title={booking ? _T('bookingTitle') : _T('paxTitle')}
          navigation={navigation}
          right={this._renderRight}
          search={this.state.search}
          searchConfig={booking ? null : searchConfig}
        />
        {
          booking
            ? <BookingList trip={trip} navigation={navigation} />
            : <PaxList trip={trip} navigation={navigation} />
        }
      </Container>
    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state)
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
