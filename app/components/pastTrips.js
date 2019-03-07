
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View } from 'native-base'
import PastTripCard from './pastTripCard'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { connect } from 'react-redux'
import { getModifiedData } from '../selectors'
import OverlaySpinner from './overlaySpinner'
import Translator from '../utils/translator'

const _T = Translator('PastTripsScreen')

class PastTrips extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.pastTrips.equals(this.props.pastTrips) ||
           !nextProps.modifiedData.equals(this.props.modifiedData) ||
           nextProps.refreshing !== this.props.refreshing
  }

  _renderTripCard = ({ item }) => {
    const { modifiedData, screen, onTripPress } = this.props
    const departureId = String(item.get('departureId'))
    const modifiedTripData = modifiedData.get(departureId)
    return <PastTripCard
      screen={screen}
      trip={item}
      modifiedTripData={modifiedTripData}
      onTripPress={onTripPress}
    />
  }

  _renderPastTrips = () => {
    const { pastTrips, onRefresh } = this.props
    return (
      <ImmutableVirtualizedList
        onRefresh={onRefresh}
        refreshing={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 10, paddingBottom: 15 }}
        immutableData={pastTrips.get('trips')}
        renderItem={this._renderTripCard}
        keyExtractor={item => String(item.get('departureId'))}
        renderEmptyInList={_T('noPastTrips')}
      />
    )
  }

  render () {
    const { refreshing } = this.props
    return (
      <View style={ss.container}>
        {refreshing && <OverlaySpinner />}
        {this._renderPastTrips()}
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
