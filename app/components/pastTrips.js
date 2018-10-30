
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'native-base'
import NoData from '../components/noData'
import PastTripCard from './pastTripCard'
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
    return <PastTripCard trip={item} modifiedTripData={modifiedTripData} />
  }

  _renderPastTrips = pastTrips => {
    return (
      pastTrips.get('has')
        ? <ImmutableVirtualizedList
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 10, paddingBottom: 15 }}
          immutableData={pastTrips.get('trips')}
          renderItem={this._renderTripCard}
          keyExtractor={item => String(item.get('departureId'))}
        />
        : <NoData text='noPastTrips' textStyle={{ marginTop: 30 }} />
    )
  }

  render () {
    const { pastTrips } = this.props
    return (
      <View style={ss.container}>
        {this._renderPastTrips(pastTrips)}
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
