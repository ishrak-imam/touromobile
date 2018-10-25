import React, { Component } from 'react'
import {
  StyleSheet, TouchableOpacity,
  ActivityIndicator as Spinner
} from 'react-native'
import { View, Text, CheckBox } from 'native-base'
import { IonIcon, Colors } from '../theme'
import ImageCache from './imageCache'
import { LinearGradient } from 'expo'
import { format } from 'date-fns'
import FooterButtons from './footerButtons'
import { getPax, getStatsData, getTotalPercentage } from '../selectors'
import { networkActionDispatcher } from '../utils/actionDispatcher'
import { uploadStatsReq } from '../modules/reports/action'
import { getMap } from '../utils/immutable'

const DATE_FORMAT = 'DD/MM'

export default class TripCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      language: ''
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const modifiedDataChanged = nextProps.modifiedTripData
      ? !nextProps.modifiedTripData.equals(this.props.modifiedTripData)
      : false
    const tripChanged = !nextProps.trip.equals(this.props.trip)
    const stateChanged = this.state !== nextState
    return tripChanged || modifiedDataChanged || stateChanged
  }

  _renderGradient = () => {
    return (
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={ss.gradient}
      />
    )
  }

  get tripData () {
    const { trip, modifiedTripData } = this.props
    const departureId = String(trip.get('departureId'))
    const excursions = trip.get('excursions')
    const participants = modifiedTripData
      ? modifiedTripData.get('participants') ? modifiedTripData.get('participants') : getMap({})
      : getMap({})
    const statsUploadedAt = modifiedTripData ? modifiedTripData.get('statsUploadedAt') : null

    return {
      trip,
      departureId,
      excursions,
      participants,
      statsUploadedAt
    }
  }

  _uploadStats = () => {
    const { trip, departureId, excursions, participants } = this.tripData
    const statsData = getStatsData(excursions, participants, trip)

    networkActionDispatcher(uploadStatsReq({
      isNeedJwt: true,
      departureId,
      statsData,
      showToast: true,
      sucsMsg: 'Reports uploaded successfully',
      failMsg: 'Reports upload failed'
    }))
  }

  _renderUploadButton = () => {
    const { modifiedTripData } = this.props
    const isLoading = modifiedTripData ? modifiedTripData.get('isLoading') : false
    return (
      <View style={{ paddingTop: 10 }}>
        {
          isLoading
            ? <Spinner color={Colors.blue} size='small' style={{ paddingVertical: 10 }} />
            : <TouchableOpacity style={ss.uploadButton} onPress={this._uploadStats}>
              <Text style={ss.uploadButtonText}>Upload report</Text>
            </TouchableOpacity>
        }
      </View>
    )
  }

  _forPastTrips = () => {
    const { trip, excursions, participants, statsUploadedAt } = this.tripData
    const share = getTotalPercentage(excursions, participants, trip)

    return (
      <View style={ss.pastTripCardTop}>
        <Text style={{ fontWeight: 'bold' }}>Participant share: {share}%</Text>
        {
          statsUploadedAt &&
          <Text style={{ fontWeight: 'bold', paddingVertical: 15 }}>Report uploaded: {format(statsUploadedAt, DATE_FORMAT)}</Text>
        }
        {!statsUploadedAt && this._renderUploadButton()}
      </View>
    )
  }

  _forFutureTrips = () => {
    return (
      <View style={{ flex: 1, marginHorizontal: 5 }}>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <CheckBox
            checked
            onPress={() => console.log('accept check')}
          />
          <Text style={{ marginLeft: 25 }}>Accept assignment</Text>
        </View>
        <View style={{ flex: 5, flexDirection: 'row', borderWidth: 2, borderColor: Colors.charcoal }}>

          <View style={{ flex: 1, paddingHorizontal: 5, borderRightWidth: 1, borderColor: Colors.charcoal }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Out</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 13, lineHeight: 40 }}>Accomodation:</Text>
              <View style={{ height: 25, width: 90, borderWidth: 1, borderColor: 'black' }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 13, lineHeight: 40 }}>Bag pickup:</Text>
              <View style={{ height: 25, width: 90, borderWidth: 1, borderColor: 'black' }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 13, lineHeight: 40 }}>Transfer:</Text>
              <View style={{ height: 25, width: 90, borderWidth: 1, borderColor: 'black' }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 13, lineHeight: 40 }}>Transfer city:</Text>
              <View style={{ height: 25, width: 90, borderWidth: 1, borderColor: 'black' }} />
            </View>

          </View>

          <View style={{ flex: 1, paddingHorizontal: 5, borderLeftWidth: 1, borderColor: Colors.charcoal }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 5 }}>Home</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 13, lineHeight: 40 }}>Accomodation:</Text>
              <View style={{ height: 25, width: 90, borderWidth: 1, borderColor: 'black' }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 13, lineHeight: 40 }}>Bag drop:</Text>
              <View style={{ height: 25, width: 90, borderWidth: 1, borderColor: 'black' }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 13, lineHeight: 40 }}>Transfer:</Text>
              <View style={{ height: 25, width: 90, borderWidth: 1, borderColor: 'black' }} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 13, lineHeight: 40 }}>Transfer city:</Text>
              <View style={{ height: 25, width: 90, borderWidth: 1, borderColor: 'black' }} />
            </View>

          </View>
        </View>
      </View>
    )
  }

  _renderCardTop = type => {
    switch (type) {
      case 'future':
        return this._forFutureTrips()
      case 'past':
        return this._forPastTrips()
    }
  }

  render () {
    const { trip, type } = this.props

    const brand = trip.get('brand')
    const name = trip.get('name')
    const outDate = format(trip.get('outDate'), DATE_FORMAT)
    const homeDate = format(trip.get('homeDate'), DATE_FORMAT)
    const transport = trip.get('transport')
    const image = trip.get('image')
    const pax = getPax(trip)

    const cardHeight = type === 'future' ? 350 : 250
    const imageHeight = type === 'future' ? 300 : 200

    return (
      <View style={[ss.card, { height: cardHeight }]}>

        <View style={[ss.cardHeader, { backgroundColor: Colors[`${brand}Brand`] }]}>
          <Text style={ss.brandText}>{brand}</Text>
          <Text>{`${name}    ${outDate} - ${homeDate}`}</Text>
          <IonIcon name={transport.get('type')} />
        </View>

        <View style={[ss.imageContainer, { height: imageHeight }]}>
          <ImageCache uri={image} style={ss.cardImage} />
          {/* {this._renderGradient()} */}
          <View style={ss.cardBody}>
            <View style={ss.cardTop}>
              {this._renderCardTop(type)}
            </View>
            <View style={ss.cardBottom}>
              <View style={ss.bottomLeft}>
                <IonIcon name='people' color={Colors.black} size={30} />
                <Text style={[ss.brandText, { color: Colors.black, marginLeft: 10 }]}>{pax.size}</Text>
              </View>
              <View style={ss.bottomRight}>
                {
                  type === 'future' &&
                  <FooterButtons
                    disabled={false}
                    onCancel={() => console.log('cancel')}
                    onSave={() => console.log('save')}
                  />
                }
              </View>
            </View>
          </View>
        </View>

      </View>
    )
  }
}

const ss = StyleSheet.create({
  card: {
    // height: 250,
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
    // height: 200,
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
    opacity: 0.2,
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
    flex: 5
    // backgroundColor: 'red'
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
  bottomRight: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 10
  },
  brandText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  uploadButton: {
    width: 150,
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
    backgroundColor: Colors.blue
  },
  uploadButtonText: {
    color: Colors.silver,
    fontWeight: 'bold'
  },
  pastTripCardTop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
