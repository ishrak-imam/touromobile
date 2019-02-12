import React, { Component } from 'react'
import {
  StyleSheet, TouchableOpacity,
  ActivityIndicator as Spinner
} from 'react-native'
import { View, Text } from 'native-base'
import { IonIcon, Colors } from '../theme'
import ImageCache from './imageCache'
import { LinearGradient } from 'expo'
import { format } from 'date-fns'
import {
  getPax, getStatsData, getAllOrders, getOrderMode, getUser,
  getTotalParticipantsCount, getOrderStats, checkIfFlightTrip,
  getModifiedPax
} from '../selectors'
import { networkActionDispatcher } from '../utils/actionDispatcher'
import { uploadStatsReq } from '../modules/reports/action'
import { getMap } from '../utils/immutable'
import { percentage } from '../utils/mathHelpers'
import { connect } from 'react-redux'
import Translator from '../utils/translator'
import { tripNameFormatter } from '../utils/stringHelpers'

const _T = Translator('ReportsScreen')
const _TPast = Translator('PastTripsScreen')
const DATE_FORMAT = 'DD/MM'

class PastTripCard extends Component {
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

  get tripData () {
    const { trip, modifiedTripData } = this.props
    const departureId = String(trip.get('departureId'))
    const transportId = String(trip.get('transportId'))
    const excursions = trip.get('excursions')
    const participants = modifiedTripData
      ? modifiedTripData.get('participants') ? modifiedTripData.get('participants') : getMap({})
      : getMap({})
    const statsUploadedAt = modifiedTripData ? modifiedTripData.get('statsUploadedAt') : null

    return {
      trip,
      departureId,
      transportId,
      excursions,
      participants,
      statsUploadedAt
    }
  }

  _uploadStats = () => {
    const { trip, departureId, transportId, excursions, participants } = this.tripData
    const { orders, user, modifiedPax, orderMode } = this.props
    const guideId = user.get('guideId')
    const statsData = getStatsData(excursions, modifiedPax, participants, trip)
    const orderStats = getOrderStats(orders, transportId, orderMode)
    const isFlight = checkIfFlightTrip(trip)
    networkActionDispatcher(uploadStatsReq({
      isNeedJwt: true,
      guideId,
      departureId,
      isFlight,
      statsData,
      orderStats,
      showToast: true,
      sucsMsg: _T('statsSucs'),
      failMsg: _T('statsFail')
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
              <IonIcon name='upload' color={Colors.white} style={ss.uploadIcon} />
              <Text style={ss.uploadButtonText}>{_TPast('uploadReport')}</Text>
            </TouchableOpacity>
        }
      </View>
    )
  }

  _renderCardTop = () => {
    const { trip, excursions, participants, statsUploadedAt } = this.tripData
    const pax = getPax(trip)
    const totalParticipants = getTotalParticipantsCount(excursions, participants, trip)
    let share = 0
    if (excursions.size) {
      share = percentage(totalParticipants, pax.size * excursions.size)
    }

    return (
      <View style={ss.pastTripCardTop}>
        <Text style={{ fontWeight: 'bold' }}>{`${_TPast('participantShare')}: ${share}%`}</Text>
        {
          statsUploadedAt &&
          <Text style={{ fontWeight: 'bold', paddingVertical: 15 }}>{`${_TPast('uploadedAt')}: ${format(statsUploadedAt, DATE_FORMAT)}`}</Text>
        }
        {!statsUploadedAt && this._renderUploadButton()}
      </View>
    )
  }

  render () {
    const { trip } = this.props
    let brand = trip.get('brand')
    if (brand === 'OL') brand = 'OH'
    const name = trip.get('name')
    const { title, subtitle } = tripNameFormatter(name, 15)
    const outDate = format(trip.get('outDate'), DATE_FORMAT)
    const homeDate = format(trip.get('homeDate'), DATE_FORMAT)
    const transport = trip.get('transport')
    const image = trip.get('image')
    const pax = getPax(trip)
    const paddingBottom = subtitle ? 0 : 7
    const transportType = transport ? transport.get('type') : ''

    return (
      <View style={ss.card}>

        <View>
          <View style={[ss.cardHeader, { backgroundColor: Colors[`${brand}Brand`], paddingBottom }]}>
            <Text style={ss.brandText}>{`${brand}  ${title}`}</Text>
            <Text>{`${outDate} - ${homeDate}`}</Text>
            {transportType && <IonIcon name={transportType} />}
          </View>
          {
            !!subtitle &&
            <View style={[ss.subtitleContainer, { backgroundColor: Colors[`${brand}Brand`] }]}>
              <Text numberOfLines={1} style={ss.subtitle}>{subtitle}</Text>
            </View>
          }
        </View>

        <View style={ss.imageContainer}>
          <ImageCache uri={image} style={ss.cardImage} transportType={transportType} />
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

const stateToProps = (state, props) => {
  const { trip } = props
  const departureId = String(trip.get('departureId'))
  const orderMode = getOrderMode(state)
  return {
    orders: getAllOrders(state, departureId, orderMode),
    user: getUser(state),
    modifiedPax: getModifiedPax(state, departureId),
    orderMode
  }
}

export default connect(stateToProps, null)(PastTripCard)

const ss = StyleSheet.create({
  card: {
    height: 270,
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
  subtitleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingBottom: 7
  },
  subtitle: {
    fontSize: 13
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
  bottomRight: {
    flex: 1,
    flexDirection: 'row'
  },
  brandText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  uploadButton: {
    width: 200,
    paddingVertical: 10,
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'center',
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
  },
  uploadIcon: {
    marginRight: 10
  }
})
