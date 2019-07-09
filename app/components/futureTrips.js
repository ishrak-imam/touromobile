
import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { View, Text } from 'native-base'
import FutureTripCard from './futureTripCard'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import OverlaySpinner from './overlaySpinner'
import _T from '../utils/translator'
import { Colors } from '../theme'
import { mapToList, concatList } from '../utils/immutable'

const { width } = Dimensions.get('window')

export default class FutureTrips extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.futureTrips.equals(this.props.futureTrips) ||
            !nextProps.manualTrips.equals(this.props.manualTrips) ||
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
        <Text style={ss.gkText}>{_T('manualTripText')}</Text>
        <TouchableOpacity style={ss.button} onPress={this._toAddNewTrip}>
          <Text style={ss.buttonText}>{_T('addNewTrip')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderFutureTrips = () => {
    const { manualTrips, futureTrips, onRefresh } = this.props
    return (
      <ImmutableVirtualizedList
        onRefresh={onRefresh}
        refreshing={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 10, paddingBottom: 15 }}
        immutableData={concatList(futureTrips.get('trips'), mapToList(manualTrips))}
        renderItem={this._renderTripCard}
        keyExtractor={item => String(item.get('departureId'))}
        renderEmptyInList={_T('noFutureTrips')}
        ListFooterComponent={this._renderGkTrips()}
      />
    )
  }

  // _renderMaualTrips = () => {
  //   const { manualTrips } = this.props
  //   return (
  //     <ImmutableVirtualizedList
  //       showsVerticalScrollIndicator={false}
  //       contentContainerStyle={{ padding: 10, paddingBottom: 15 }}
  //       immutableData={mapToList(manualTrips)}
  //       renderItem={this._renderTripCard('manual')}
  //       renderEmpty={_T('noManualTrips')}
  //       keyExtractor={item => String(item.get('departureId'))}
  //     />
  //   )
  // }

  render () {
    const { refreshing } = this.props
    return (
      <View style={ss.container}>
        {refreshing && <OverlaySpinner />}
        {this._renderFutureTrips()}
        {/* {this._renderMaualTrips()} */}
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
    marginBottom: 10,
    alignItems: 'center'
  },
  gkText: {
    marginTop: 5,
    textAlign: 'center'
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
    fontSize: 18,
    // fontWeight: 'bold',
    color: Colors.white
  }
})
