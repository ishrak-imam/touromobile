
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'native-base'
import NoData from '../components/noData'
import TripCard from './tripCard'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { connect } from 'react-redux'
import { getModifiedData } from '../selectors'

class PastTrips extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.pastTrips.equals(this.props.pastTrips) ||
           !nextProps.modifiedData.equals(this.props.modifiedData)
  }

  _renderTripCard = ({ item }) => {
    const { modifiedData } = this.props
    const departureId = String(item.get('departureId'))
    const modifiedTripData = modifiedData.get(departureId)
    return <TripCard trip={item} type='past' modifiedTripData={modifiedTripData} />
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

const stateToProps = state => ({
  modifiedData: getModifiedData(state)
})

export default connect(stateToProps, null)(PastTrips)

const ss = StyleSheet.create({
  container: {
    flex: 1
  }
})
