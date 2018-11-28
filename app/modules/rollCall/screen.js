
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { Container, View } from 'native-base'
import Header from '../../components/header'
import { connect } from 'react-redux'
import Translator from '../../utils/translator'
import { getTrips } from '../../selectors'
import SearchBar from '../../components/searchBar'
import ContextMenu from '../../components/contextMenu'

const _T = Translator('RollCallScreen')

const CONTEXT_OPTIONS = {
  name: { text: 'name', key: 'NAME', icon: 'person' },
  hotel: { text: 'hotel', key: 'HOTEL', icon: 'home' },
  airport: { text: 'airport', key: 'AIRPORT', icon: 'flight' }
}

class RollCallScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      searchText: '',
      groupBy: CONTEXT_OPTIONS.name.key
    }
  }

  _onSelect = option => {
    this.setState({ groupBy: option.key })
  }

  _renderRight = () => {
    const { trips } = this.props
    const trip = trips.get('current').get('trip')

    let options = [CONTEXT_OPTIONS.name]

    const hotels = trip.get('hotels')
    const transport = trip.get('transport')

    const isHotels = hotels && hotels.size
    const isFlight = transport ? transport.get('type') === 'flight' : false

    if (isHotels) options.push(CONTEXT_OPTIONS.hotel)
    if (isFlight) options.push(CONTEXT_OPTIONS.airport)

    return (
      <ContextMenu
        icon='sort'
        label='sortOrder'
        onSelect={this._onSelect}
        options={options}
      />
    )
  }

  _onSearch = searchText => {
    this.setState({ searchText })
  }

  render () {
    const { navigation, trips } = this.props
    const current = trips.get('current')
    const brand = current.get('trip').get('brand')
    return (
      <Container>
        <Header
          left='back'
          title={_T('title')}
          navigation={navigation}
          brand={brand}
        />
        <View style={ss.container}>
          <SearchBar
            onSearch={this._onSearch}
            icon='people'
            placeholder={_T('paxSearch')}
            right={this._renderRight()}
          />
        </View>
      </Container>
    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state)
})

export default connect(stateToProps, null)(RollCallScreen)

const ss = StyleSheet.create({
  container: {
    flex: 1
  }
})
