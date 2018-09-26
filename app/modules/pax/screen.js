import React, { Component } from 'react'
import {
  Container, View
} from 'native-base'
import { StyleSheet } from 'react-native'
import Header from '../../components/header'
import { IonIcon, Colors } from '../../theme'
import { connect } from 'react-redux'
import Translator from '../../utils/translator'
import { getTrips } from '../../selectors'
import PaxList from '../../components/paxList'
import BookingList from '../../components/bookingList'
import Switch from '../../components/switch'
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
      search: false,
      text: ''
    }
  }

  shouldComponentUpdate (nextProps, nexState) {
    const propsChanged = !nextProps.trips.equals(this.props.trips)
    const stateChanged = nexState !== this.state
    return propsChanged || stateChanged
  }

  _renderRight = () => {
    const { booking } = this.state
    const iconColor = Colors.silver
    const switchColor = Colors.headerBg
    const iconSize = 16
    return (
      <View style={ss.headerRight}>
        <IonIcon name='people' color={iconColor} size={iconSize} style={{ paddingRight: 5 }} />
        <Switch
          isOn={booking}
          onColor={switchColor}
          offColor={switchColor}
          onToggle={v => this.setState({ booking: v })}
        />
        <IonIcon name='booking' color={iconColor} size={iconSize} style={{ paddingLeft: 5 }} />
      </View>
    )
  }

  _searchToggle = toggle => this.setState({ search: toggle })

  _onSearch = text => this.setState({ text })

  render () {
    const { navigation, trips } = this.props
    const { booking, text } = this.state
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
            : <PaxList trip={trip} navigation={navigation} searchText={text} />
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
