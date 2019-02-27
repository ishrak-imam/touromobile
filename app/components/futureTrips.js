
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'native-base'
import NoData from '../components/noData'
import FutureTripCard from './futureTripCard'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import OverlaySpinner from './overlaySpinner'

export default class FutureTrips extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.futureTrips.equals(this.props.futureTrips) ||
            nextProps.refreshing !== this.props.refreshing
  }

  _renderTripCard = ({ item }) => {
    return <FutureTripCard trip={item} />
  }

  _renderFutureTrips = () => {
    const { futureTrips, onRefresh } = this.props
    return (
      futureTrips.get('has')
        ? <ImmutableVirtualizedList
          onRefresh={onRefresh}
          refreshing={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10, paddingBottom: 15 }}
          immutableData={futureTrips.get('trips')}
          renderItem={this._renderTripCard}
          keyExtractor={item => String(item.get('departureId'))}
        />
        : <NoData text='noFutureTrips' textStyle={{ marginTop: 30 }} />
    )
  }

  render () {
    const { refreshing } = this.props
    return (
      <View style={ss.container}>
        {refreshing && <OverlaySpinner />}
        {this._renderFutureTrips()}
      </View>
    )
  }
}

const ss = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20
  }
})
