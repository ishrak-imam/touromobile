
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

  _renderFutureTrips = futureTrips => {
    return (
      futureTrips.size
        ? <ImmutableVirtualizedList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10 }}
          immutableData={futureTrips}
          renderItem={this._renderTripCard}
          keyExtractor={item => String(item.get('departureId'))}
        />
        : <NoData text='No more future trips' textStyle={{ marginTop: 30 }} />
    )
  }

  render () {
    const { trips } = this.props
    const futureTrips = trips.getIn(['future', 'trips'])
    return (
      <View style={ss.container}>
        {this._renderFutureTrips(futureTrips)}
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
