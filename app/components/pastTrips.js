
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'native-base'
import NoData from '../components/noData'
import TripCard from './tripCard'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'

export default class FutureTrips extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.futureTrips.equals(this.props.futureTrips)
  }

  _renderTripCard = ({ item }) => {
    return <TripCard trip={item} />
  }

  _renderFutureTrips = pastTrips => {
    return (
      pastTrips.get('has')
        ? <ImmutableVirtualizedList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10, paddingBottom: 15 }}
          immutableData={pastTrips.get('trips')}
          renderItem={this._renderTripCard}
          keyExtractor={item => String(item.get('departureId'))}
        />
        : <NoData text='No more future trips' textStyle={{ marginTop: 30 }} />
    )
  }

  render () {
    const { pastTrips } = this.props
    return (
      <View style={ss.container}>
        {this._renderFutureTrips(pastTrips)}
      </View>
    )
  }
}

const ss = StyleSheet.create({
  container: {
    flex: 1
  }
})
