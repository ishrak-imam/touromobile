
import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { View, Text } from 'native-base'
import FutureTripCard from './futureTripCard'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import OverlaySpinner from './overlaySpinner'
import _T from '../utils/translator'
import { Colors } from '../theme'

const { width } = Dimensions.get('window')

export default class FutureTrips extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.futureTrips.equals(this.props.futureTrips) ||
            nextProps.refreshing !== this.props.refreshing
  }

  _renderTripCard = ({ item }) => {
    return <FutureTripCard trip={item} />
  }

  _toAddNewTrip = () => {
    const { currentTrip } = this.props
    const brand = currentTrip.get('brand')
    this.props.navigation.navigate('AddNewTrip', { brand })
  }

  _renderGkTrips = () => {
    return (
      <View style={ss.gkTripCon}>
        <Text style={ss.gkText}>
          Add future trip manually. This is primarily intended for G&K trips which currently are not visible to Touro.
        </Text>
        <TouchableOpacity style={ss.button} onPress={this._toAddNewTrip}>
          <Text style={ss.buttonText}>Add new trip</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderFutureTrips = () => {
    const { futureTrips, onRefresh } = this.props
    return (
      <ImmutableVirtualizedList
        onRefresh={onRefresh}
        refreshing={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 10, paddingBottom: 15 }}
        immutableData={futureTrips.get('trips')}
        renderItem={this._renderTripCard}
        keyExtractor={item => String(item.get('departureId'))}
        renderEmptyInList={_T('noFutureTrips')}
        ListFooterComponent={this._renderGkTrips()}
      />
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
    paddingBottom: 20
  },
  gkTripCon: {
    borderTopWidth: 1,
    marginBottom: 10
  },
  gkText: {
    marginTop: 5
  },
  button: {
    height: 45,
    borderRadius: 5,
    width: width - 50,
    backgroundColor: Colors.blue,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    // fontSize: 18,
    // fontWeight: 'bold',
    color: Colors.white
  }
})
