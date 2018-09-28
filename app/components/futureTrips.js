
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'native-base'
import { connect } from 'react-redux'
import { getTrips } from '../selectors'
import NoData from '../components/noData'
import TripCard from './tripCard'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'

class FutureTrips extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.trips.equals(this.props.trips)
  }

  _renderTripCard = ({ item }) => {
    return <TripCard trip={item} />
  }

  _renderFutureTrips = future => {
    return (
      future.get('has')
        ? <ImmutableVirtualizedList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10, paddingBottom: 15 }}
          immutableData={future.get('trips')}
          renderItem={this._renderTripCard}
          keyExtractor={item => String(item.get('departureId'))}
        />
        : <NoData text='No more future trips' textStyle={{ marginTop: 30 }} />
    )
  }

  render () {
    const { trips } = this.props
    const future = trips.get('future')
    return (
      <View style={ss.container}>
        {this._renderFutureTrips(future)}
      </View>
    )
  }
}

const stateToProps = state => ({
  trips: getTrips(state)
})

export default connect(stateToProps, null)(FutureTrips)

const ss = StyleSheet.create({
  container: {
    flex: 1
  }
})
