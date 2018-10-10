import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, ActivityIndicator as Spinner } from 'react-native'
import { View, Text } from 'native-base'
import { IonIcon, Colors } from '../theme'
import ImageCache from './imageCache'
import { LinearGradient } from 'expo'
import { format } from 'date-fns'
import { getPax, getStatsData, getTotalPercentage } from '../selectors'

import { networkActionDispatcher } from '../utils/actionDispatcher'
import { uploadStatsReq } from '../modules/reports/action'

import { getMap } from '../utils/immutable'

const DATE_FORMAT = 'YY-MM-DD'

export default class TripCard extends Component {
  shouldComponentUpdate (nextProps) {
    const modifiedDataChanged = nextProps.modifiedTripData
      ? !nextProps.modifiedTripData.equals(this.props.modifiedTripData)
      : false
    const tripChanged = !nextProps.trip.equals(this.props.trip)
    return tripChanged || modifiedDataChanged
  }

  _renderGradient = () => {
    return (
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={ss.gradient}
      />
    )
  }

  _uploadStats = () => {
    const { trip, modifiedTripData } = this.props
    const departureId = String(trip.get('departureId'))
    const excursions = trip.get('excursions')
    const participants = modifiedTripData ? modifiedTripData.get('participants') : getMap({})
    const statsData = getStatsData(excursions, participants, trip)
    networkActionDispatcher(uploadStatsReq({
      isNeedJwt: true,
      departureId,
      statsData
    }))
  }

  _renderUploadButton = () => {
    const { modifiedTripData, brand } = this.props
    const isLoading = modifiedTripData ? modifiedTripData.get('isLoading') : false
    const backgroundColor = Colors[`${brand}Brand`] || Colors.blue
    const button = [ss.uploadButton, { backgroundColor }]
    return (
      <View style={{ paddingTop: 10 }}>
        {
          isLoading
            ? <Spinner color={Colors.blue} size='small' style={{ paddingVertical: 10 }} />
            : <TouchableOpacity style={button} onPress={this._uploadStats}>
              <Text style={ss.uploadButtonText}>Upload report</Text>
            </TouchableOpacity>
        }
      </View>
    )
  }

  _forPastTrips = () => {
    const { modifiedTripData, trip } = this.props

    const excursions = trip.get('excursions')
    const participants = modifiedTripData
      ? modifiedTripData.get('participants') ? modifiedTripData.get('participants') : getMap({})
      : getMap({})
    const share = getTotalPercentage(excursions, participants, trip)

    const statsUploadedAt = modifiedTripData ? modifiedTripData.get('statsUploadedAt') : null
    return (
      <View style={ss.pastTripCardTop}>
        <Text style={{ fontWeight: 'bold' }}>Participant share: {share}%</Text>
        {statsUploadedAt && <Text style={{ fontWeight: 'bold', paddingVertical: 15 }}>Report uploaded: {format(statsUploadedAt, DATE_FORMAT)}</Text>}
        {!statsUploadedAt && this._renderUploadButton()}
      </View>
    )
  }

  _renderCardTop = () => {
    const { type } = this.props
    if (type === 'future') {
      return null
    }

    return this._forPastTrips()
  }

  render () {
    const { trip } = this.props

    const brand = trip.get('brand')
    const name = trip.get('name')
    const outDate = format(trip.get('outDate'), DATE_FORMAT)
    const homeDate = format(trip.get('homeDate'), DATE_FORMAT)
    const transport = trip.get('transport')
    const image = trip.get('image')
    const pax = getPax(trip)

    const backgroundColor = Colors[`${brand}Brand`] || Colors.blue

    return (
      <View style={ss.card}>

        <View style={[ss.cardHeader, { backgroundColor }]}>
          <Text style={ss.brandText}>{brand}</Text>
          <Text>{`${name} ${outDate} - ${homeDate}`}</Text>
          <IonIcon name={transport.get('type')} />
        </View>

        <View style={ss.imageContainer}>
          <ImageCache uri={image} style={ss.cardImage} />
          {/* {this._renderGradient()} */}
          <View style={ss.cardBody}>
            <View style={ss.cardTop}>
              {this._renderCardTop()}
            </View>
            <View style={ss.cardBottom}>
              <View style={ss.bottomLeft}>
                <IonIcon name='people' color={Colors.black} size={30} />
                <Text style={[ss.brandText, { color: Colors.black, marginLeft: 10 }]}>{pax.size}</Text>
              </View>
              <View style={ss.bottomRight} />
            </View>
          </View>
        </View>

      </View>
    )
  }
}

const ss = StyleSheet.create({
  card: {
    height: 250,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  cardHeader: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 0,
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardContent: {
    flex: 1
  },
  imageContainer: {
    borderWidth: 0,
    height: 200,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden'// needed for iOS
  },
  cardImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.3,
    borderBottomLeftRadius: 10, // needed for Android
    borderBottomRightRadius: 10, // needed for Android
    width: null,
    height: null
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  },
  cardBody: {
    flex: 1
  },
  cardTop: {
    flex: 3
  },
  cardBottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10
  },
  brandText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  bottomRight: {
    flex: 1,
    flexDirection: 'row'
  },
  uploadButton: {
    width: 150,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: Colors.blue
  },
  uploadButtonText: {
    color: Colors.black,
    fontWeight: 'bold'
  },
  pastTripCardTop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
