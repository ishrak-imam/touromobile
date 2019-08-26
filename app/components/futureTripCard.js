import React, { Component } from 'react'
import {
  StyleSheet,
  View, TouchableOpacity
} from 'react-native'
import {
  Text
  // CheckBox
} from 'native-base'
import { IonIcon, Colors } from '../theme'
import ImageCache from './imageCache'
import { LinearGradient } from 'expo'
import { format } from 'date-fns'
import FooterButtons from './footerButtons'
import { connect } from 'react-redux'
import OutHomeTab, { TABS } from './outHomeTab'
import {
  getPax, getAccept, getUser,
  getConnections, getReservationsByDepartureId
} from '../selectors'
import { actionDispatcher, networkActionDispatcher } from '../utils/actionDispatcher'
import { getMap } from '../utils/immutable'
import { showModal } from '../modal/action'
import { tripNameFormatter } from '../utils/stringHelpers'
import {
  setAcceptTrip,
  setAcceptTripCombos,
  acceptTripReq,
  // prepareCancelData,
  setDefaultCombos,
  cancelComboValues
} from '../modules/modifiedData/action'
import TextInput from '../components/textinput'

import {
  getKeyNames,
  getLocations,
  getAccommodations,
  getBagLocations,
  getTransfers,
  getTransferCities,
  // getDefaultValues,
  shouldLockTrip,
  getDefaultHotel,
  getAccommodationOptions,
  getLocationValue,
  getTransferValue,
  getTransferCityValue,
  getAccommodationValue,
  getBagValue

  // getTransferOptions
} from '../utils/futureTrip'

import _T from '../utils/translator'
import OverlaySpinner from './overlaySpinner'

const KEY_NAMES = getKeyNames()

const DATE_FORMAT = 'DD/MM'

// const TRANSFER_OPTIONS = getTransferOptions()

class FutureTripCard extends Component {
  constructor (props) {
    super(props)

    // const { accept, trip } = props
    // const departureId = String(trip.get('departureId'))
    // const transport = trip.get('transport')
    // if (transport && !accept.get('out') && !accept.get('home')) {
    //   actionDispatcher(setDefaultCombos({
    //     departureId,
    //     ...getDefaultValues(accept, transport.get('type'))
    //   }))
    // }

    const { trip, reservation } = props
    const departureId = String(trip.get('departureId'))
    if (reservation) {
      actionDispatcher(setDefaultCombos({
        departureId,
        out: this._prepareComboValues(reservation.get('out'), reservation.getIn(['out', 'transfer']), 'out'),
        home: this._prepareComboValues(reservation.get('home'), reservation.getIn(['home', 'transfer']), 'home')
      }))
    }

    this.state = {
      tab: 'out'
    }
  }

  _prepareComboValues = (from, transfer, direction) => {
    const { connections } = this.props
    let data = {
      location: getMap({ key: from.get('location'), value: getLocationValue(from.get('location')) }),
      transfer: getMap({ key: from.get('transfer'), value: getTransferValue(from.get('transfer')) }),
      transferCity: getMap({ key: from.get('transferCity'), value: getTransferCityValue(from.get('transferCity'), connections, transfer) }),
      accommodation: getMap({ key: from.get('accommodation'), value: getAccommodationValue(from.get('accommodation')) }),
      bag: getMap({ key: from.get('bag'), value: getBagValue(from.get('bag')) })
    }

    if (direction === 'out') {
      data.comment = getMap({ key: 'comment', value: from.get('comment') })
    }

    return getMap(data)
  }

  // componentDidMount () {
  //   const { trip } = this.props
  //   const transport = trip.get('transport')
  //   if (transport) {
  //     setTimeout(() => {
  //       const { accept } = this.props
  //       actionDispatcher(prepareCancelData({
  //         departureId: this.departureId,
  //         accept
  //       }))
  //     }, 0)
  //   }
  // }

  get acceptData () {
    const { accept } = this.props
    return {
      isLoading: accept.get('isLoading'),
      isAccepted: accept.get('isAccepted'),
      dirty: accept.get('dirty'),
      acceptedAt: accept.get('acceptedAt'),
      out: accept.get('out') || getMap({}),
      home: accept.get('home') || getMap({}),
      saveDisabled: accept.get('saveDisabled')
    }
  }

  get departureId () {
    return String(this.props.trip.get('departureId'))
  }

  get transportId () {
    return String(this.props.trip.get('transportId'))
  }

  get shouldLockTrip () {
    return shouldLockTrip(this.props.trip.get('outDate'))
  }

  shouldComponentUpdate (nextProps, nextState) {
    const acceptChanged = !nextProps.accept.equals(this.props.accept)
    const tripChanged = !nextProps.trip.equals(this.props.trip)
    const stateChanged = this.state !== nextState
    return tripChanged || stateChanged || acceptChanged
  }

  _renderGradient = () => {
    return (
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={ss.gradient}
      />
    )
  }

  _onTabSwitch = tab => {
    return () => {
      this.setState({ tab })
    }
  }

  _onSelect = selection => {
    const { key, value, direction } = selection
    actionDispatcher(setAcceptTripCombos({
      departureId: this.departureId,
      key,
      value,
      direction
    }))
  }

  _onComment = comment => {
    actionDispatcher(setAcceptTripCombos({
      departureId: this.departureId,
      key: 'comment',
      value: { key: 'comment', value: comment },
      direction: 'out'
    }))
  }

  _showSelections = options => {
    return () => {
      actionDispatcher(showModal({
        type: 'selection',
        options,
        onSelect: this._onSelect
      }))
    }
  }

  _renderSelector = options => {
    let { selected, disabled, config, items, direction } = options

    const translatedOptions = Object.assign({}, options)
    if (!disabled) {
      config = Object.assign({}, config)
      config.label = _T(config.label)
      translatedOptions.config = config
    }

    if (items && items.length === 1) {
      disabled = true
      if (!selected) {
        const item = items[0]
        setTimeout(() => {
          this._onSelect({ key: config.key, value: item, direction })
        }, 0)
      }
    }

    const text = selected ? selected.get('value') : ''
    const backgroundColor = disabled ? Colors.steel : Colors.blue
    const iconColor = disabled ? Colors.charcoal : Colors.silver
    return (
      <View style={ss.selector}>
        <View style={ss.selectorBox}>
          <Text numberOfLines={1} style={ss.selectorText}>{text}</Text>
        </View>
        <TouchableOpacity
          style={[ss.dropDown, { backgroundColor }]}
          onPress={this._showSelections(translatedOptions)}
          disabled={disabled}
        >
          <IonIcon name='down' color={iconColor} size={20} />
        </TouchableOpacity>
      </View>
    )
  }

  _renderComboLabel = label => {
    return (
      <View style={ss.comboText}>
        <Text style={ss.comboLabel}>{_T(label)}</Text>
      </View>
    )
  }

  _renderComboText = text => {
    return (
      <View style={ss.text}>
        <View style={ss.textBox}>
          <Text numberOfLines={1} style={ss.selectorText}>{text}</Text>
        </View>
      </View>
    )
  }

  _getHotelName = (direction, transportType, transfer, accommodation) => {
    const { reservation } = this.props
    const hotelName = reservation ? reservation.getIn([direction, 'hotel']) : getDefaultHotel(transportType)
    const accOptions = getAccommodationOptions()

    return {
      showHotelName: accommodation ? accommodation.get('key') !== accOptions.NA.key : false,
      hotelName
    }
  }

  _renderOutCombos = transportType => {
    const { out, home } = this.acceptData
    const { connections } = this.props
    const transfer = out.get(KEY_NAMES.TRANSFER)
    const accommodation = out.get(KEY_NAMES.ACCOMMODATION)
    const { showHotelName, hotelName } = this._getHotelName('out', transportType, transfer, accommodation)
    return (
      <View style={ss.comboCon}>
        <View style={ss.combo}>
          {this._renderComboLabel('boardingLoc')}
          {this._renderSelector(getLocations({
            direction: 'out',
            transportType,
            selected: out.get(KEY_NAMES.LOCATION),
            locked: this.shouldLockTrip
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('transfer')}
          {this._renderSelector(getTransfers({
            direction: 'out',
            transportType,
            selected: transfer,
            locked: this.shouldLockTrip
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('transferCity')}
          {this._renderSelector(getTransferCities({
            direction: 'out',
            connections,
            transportType,
            transfer,
            selected: out.get(KEY_NAMES.TRANSFER_CITY),
            locked: this.shouldLockTrip
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('accommodation')}
          {this._renderSelector(getAccommodations({
            direction: 'out',
            transportType,
            // transfer,
            selected: out.get(KEY_NAMES.ACCOMMODATION),
            locked: this.shouldLockTrip
          }))}
        </View>

        {
          showHotelName &&
          <View style={ss.combo}>
            {this._renderComboLabel('hotel')}
            {this._renderComboText(hotelName)}
          </View>
        }

        <View style={ss.combo}>
          {this._renderComboLabel('bagPick')}
          {this._renderSelector(getBagLocations({
            direction: 'out',
            transportType,
            selected: out.get(KEY_NAMES.BAG),
            other: home.get(KEY_NAMES.BAG),
            locked: this.shouldLockTrip
          }))}
        </View>

        {
          transportType === 'flight' &&
          <View style={ss.combo}>
            {this._renderComboLabel('comment')}
            <View style={ss.commentBox}>
              <TextInput
                multiline
                placeholder={_T('comment')}
                style={ss.commentInput}
                onChange={this._onComment}
                value={out.getIn(['comment', 'value'])}
              />
            </View>
          </View>
        }
      </View>
    )
  }

  _renderHomeCombos = transportType => {
    const { out, home } = this.acceptData
    const { connections } = this.props
    const transfer = home.get(KEY_NAMES.TRANSFER)
    const accommodation = home.get(KEY_NAMES.ACCOMMODATION)
    const { showHotelName, hotelName } = this._getHotelName('home', transportType, transfer, accommodation)
    return (
      <View style={ss.comboCon}>
        <View style={ss.combo}>
          {this._renderComboLabel('alightingLoc')}
          {this._renderSelector(getLocations({
            direction: 'home',
            transportType,
            selected: home.get(KEY_NAMES.LOCATION),
            locked: this.shouldLockTrip
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('transfer')}
          {this._renderSelector(getTransfers({
            direction: 'home',
            transportType,
            selected: transfer,
            locked: this.shouldLockTrip
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('transferCity')}
          {this._renderSelector(getTransferCities({
            direction: 'home',
            connections,
            transportType,
            transfer,
            selected: home.get(KEY_NAMES.TRANSFER_CITY),
            locked: this.shouldLockTrip
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('accommodation')}
          {this._renderSelector(getAccommodations({
            direction: 'home',
            transportType,
            // transfer,
            selected: home.get(KEY_NAMES.ACCOMMODATION),
            locked: this.shouldLockTrip
          }))}
        </View>

        {
          showHotelName &&
          <View style={ss.combo}>
            {this._renderComboLabel('hotel')}
            {this._renderComboText(hotelName)}
          </View>
        }

        <View style={ss.combo}>
          {this._renderComboLabel('bagDrop')}
          {this._renderSelector(getBagLocations({
            direction: 'home',
            transportType,
            selected: home.get(KEY_NAMES.BAG),
            other: out.get(KEY_NAMES.BAG),
            locked: this.shouldLockTrip
          }))}
        </View>
      </View>
    )
  }

  _setAcceptTrip = () => {
    const { isAccepted } = this.acceptData
    actionDispatcher(setAcceptTrip({
      isAccepted: !isAccepted,
      departureId: this.departureId
    }))
  }

  _renderCardTop = transportType => {
    const { tab } = this.state
    // const { isAccepted, acceptedAt, dirty } = this.acceptData

    // const acceptText = isAccepted && acceptedAt && !dirty
    //   ? `${_T('acceptedAt')} ${format(acceptedAt, DATE_FORMAT)}`
    //   : `${_T('accept')}`

    return (
      <View style={ss.futureTtip}>
        {/* <TouchableOpacity
          style={ss.futureTripCheck}
          disabled={this.shouldLockTrip}
          onPress={this._setAcceptTrip}
        >
          <CheckBox
            disabled
            checked={isAccepted}
          />
          <Text style={ss.checkText}>{acceptText}</Text>
        </TouchableOpacity> */}
        <View style={ss.comboTabs}>
          <View style={ss.outHomeTabs}>
            <OutHomeTab selected={tab} onPress={this._onTabSwitch} />
          </View>
          {tab === TABS.OUT && this._renderOutCombos(transportType)}
          {tab === TABS.HOME && this._renderHomeCombos(transportType)}
        </View>
      </View>
    )
  }

  _acceptTrip = () => {
    const { user, trip } = this.props
    const { isAccepted, out, home } = this.acceptData

    const type = trip.get('tripType')
    let tripInfo = {
      brand: null,
      tripType: null,
      tripName: null,
      outDate: null,
      homeDate: null
    }
    if (type === 'manual') {
      const { trip } = this.props
      tripInfo = {
        brand: trip.get('brand'),
        tripType: trip.getIn(['transport', 'type']),
        tripName: trip.get('name'),
        outDate: trip.get('outDate'),
        homeDate: trip.get('homeDate')
      }
    }

    networkActionDispatcher(acceptTripReq({
      isNeedJwt: true,
      guideId: user.get('guideId'),
      departureId: this.departureId,
      acceptData: {
        transportId: this.transportId,
        accept: isAccepted
      },
      reservationData: {
        transportId: this.transportId,
        ...tripInfo,
        out: {
          location: out.getIn(['location', 'key']) || null,
          transfer: out.getIn(['transfer', 'key']) || null,
          transferCity: out.getIn(['transferCity', 'key']) || null,
          accommodation: out.getIn(['accommodation', 'key']) || null,
          bag: out.getIn(['bag', 'key']) || null,
          comment: out.getIn(['comment', 'value']) || null
        },
        home: {
          location: home.getIn(['location', 'key']) || null,
          transfer: home.getIn(['transfer', 'key']) || null,
          transferCity: home.getIn(['transferCity', 'key']) || null,
          accommodation: home.getIn(['accommodation', 'key']) || null,
          bag: home.getIn(['bag', 'key']) || null
        }
      },
      showToast: true,
      sucsMsg: _T('acceptSucs'),
      failMsg: _T('acceptFail')
    }))
  }

  _cancelSelection = () => {
    actionDispatcher(cancelComboValues({
      departureId: this.departureId
    }))
  }

  _renderPaxCount = pax => {
    return (
      <View style={ss.bottomLeft}>
        <IonIcon name='people' color={Colors.black} size={30} />
        <Text style={[ss.brandText, { marginLeft: 10 }]}>{pax.size}</Text>
      </View>
    )
  }

  render () {
    const { trip } = this.props
    const { dirty, isLoading, saveDisabled } = this.acceptData
    let brand = trip.get('brand')
    if (brand === 'OL') brand = 'OH'
    const name = trip.get('name')
    const { title, subtitle } = tripNameFormatter(name, 15)
    const outDate = format(trip.get('outDate'), DATE_FORMAT)
    const homeDate = format(trip.get('homeDate'), DATE_FORMAT)
    const transport = trip.get('transport')
    const image = trip.get('image')
    const pax = getPax(trip)
    const transportType = transport ? transport.get('type') : ''
    const isDisabled = this.shouldLockTrip

    let cardHeight = isDisabled ? 550 : 510
    let imageConHeight = isDisabled ? 490 : 450

    if (transportType !== 'flight') {
      cardHeight = cardHeight - 80
      imageConHeight = imageConHeight - 80
    }

    let manualTrip = {}
    if (trip.get('tripType') === 'manual') {
      manualTrip = { borderWidth: 2, borderColor: Colors.blue }
    }

    return (
      <View style={[ss.card, { height: cardHeight }, manualTrip]}>
        <View style={[ss.cardHeader, { backgroundColor: Colors[`${brand}Brand`] }]}>
          <View style={ss.headerTop}>
            <Text style={ss.brandText}>{`${brand}  ${title}`}</Text>
            <Text>{`${outDate} - ${homeDate}`}</Text>
            {transportType && <IonIcon name={transportType} />}
          </View>
          {
            !!subtitle &&
            <View>
              <Text numberOfLines={1}>{subtitle}</Text>
            </View>
          }
        </View>

        <View style={[ss.imageContainer, { height: imageConHeight }]}>
          <ImageCache uri={image} style={ss.cardImage} transportType={transportType} />
          {/* {this._renderGradient()} */}
          {isLoading && <OverlaySpinner />}
          <View style={ss.cardBody}>
            <View style={ss.cardTop}>
              {transport && this._renderCardTop(transportType)}
            </View>
            {isDisabled &&
              <View style={ss.cardMiddle}>
                <Text style={ss.disabledText}>{_T('tripDisabled')}</Text>
              </View>
            }
            <View style={ss.cardBottom}>
              {this.shouldLockTrip && this._renderPaxCount(pax)}
              <View style={ss.bottomRight}>
                <FooterButtons
                  style={ss.footerButtons}
                  disabled={!dirty || this.shouldLockTrip || saveDisabled}
                  onCancel={this._cancelSelection}
                  onSave={this._acceptTrip}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    )
  }
}

const stateToProps = (state, props) => {
  const departureId = String(props.trip.get('departureId'))
  return {
    accept: getAccept(state, departureId),
    user: getUser(state),
    connections: getConnections(state),
    reservation: getReservationsByDepartureId(state, departureId)
  }
}

export default connect(stateToProps, null)(FutureTripCard)

const ss = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginBottom: 15
  },
  cardHeader: {
    height: 60,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: 'center',
    paddingHorizontal: 10
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  imageContainer: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden' // needed for iOS
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
  disabledText: {
    fontSize: 13,
    fontStyle: 'italic'
  },
  cardTop: {
    flex: 5
  },
  cardMiddle: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 10
  },
  cardBottom: {
    flex: 0.7,
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
    fontWeight: 'bold',
    color: Colors.black
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
  },
  footerButtons: {
    marginBottom: 5
  },
  selectorBox: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRightWidth: 0,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderColor: Colors.charcoal
  },
  textBox: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 5
    // borderWidth: 1,
    // borderRadius: 3,
    // borderColor: Colors.charcoal
  },
  selectorText: {
    fontSize: 14
  },
  selector: {
    flex: 1.5,
    height: 30,
    flexDirection: 'row',
    backgroundColor: Colors.silver,
    borderRadius: 3
  },
  commentBox: {
    flex: 1.5,
    height: 70,
    backgroundColor: Colors.silver,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: Colors.charcoal
  },
  commentInput: {
    flex: 1,
    height: 70,
    padding: 5
  },
  text: {
    flex: 1.5,
    height: 30,
    flexDirection: 'row',
    // backgroundColor: Colors.silver,
    borderRadius: 3
  },
  dropDown: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3
  },
  comboCon: {
    paddingHorizontal: 10
  },
  combo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5
  },
  comboLabel: {
    fontSize: 14
  },
  comboText: {
    flex: 1,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center'
  },
  futureTtip: {
    flex: 1
  },
  futureTripCheck: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5
  },
  checkText: {
    marginLeft: 25
  },
  comboTabs: {
    marginTop: 10,
    flex: 5
  },
  outHomeTabs: {
    marginBottom: 10
  }
})
