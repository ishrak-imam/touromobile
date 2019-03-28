import React, { Component } from 'react'
import {
  StyleSheet,
  View, TouchableOpacity
} from 'react-native'
import { Text, CheckBox } from 'native-base'
import { IonIcon, Colors } from '../theme'
import ImageCache from './imageCache'
import { LinearGradient } from 'expo'
import { format } from 'date-fns'
import FooterButtons from './footerButtons'
import { connect } from 'react-redux'
import OutHomeTab, { TABS } from './outHomeTab'
import { getPax, getAaccept, getUser, getConnections } from '../selectors'
import { actionDispatcher, networkActionDispatcher } from '../utils/actionDispatcher'
import { getMap } from '../utils/immutable'
import { showModal } from '../modal/action'
import { tripNameFormatter } from '../utils/stringHelpers'
import {
  setAcceptTrip,
  setAcceptTripCombos,
  setDefaultCombos,
  acceptTripReq,
  prepareCancelData,
  cancelComboValues
} from '../modules/modifiedData/action'

import {
  getKeyNames,
  getLocations,
  getAccommodations,
  getBagLocations,
  getTransfers,
  getTransferCities,
  getDefaultValues,
  shouldLockTrip
} from '../utils/futureTrip'

import _T from '../utils/translator'
import OverlaySpinner from './overlaySpinner'

const KEY_NAMES = getKeyNames()

const DATE_FORMAT = 'DD/MM'

class FutureTripCard extends Component {
  constructor (props) {
    super(props)

    const { accept, trip } = props
    const departureId = String(trip.get('departureId'))
    const transport = trip.get('transport')

    if (transport && !accept.get('out') && !accept.get('home')) {
      actionDispatcher(setDefaultCombos({
        departureId,
        ...getDefaultValues(accept, transport.get('type'))
      }))
    }

    this.state = {
      tab: 'out'
    }
  }

  componentDidMount () {
    const { trip } = this.props
    const transport = trip.get('transport')
    if (transport) {
      setTimeout(() => {
        const { accept } = this.props
        actionDispatcher(prepareCancelData({
          departureId: this.departureId,
          accept
        }))
      }, 0)
    }
  }

  get acceptData () {
    const { accept } = this.props
    return {
      isLoading: accept.get('isLoading'),
      isAccepted: accept.get('isAccepted'),
      dirty: accept.get('dirty'),
      acceptedAt: accept.get('acceptedAt'),
      out: accept.get('out') || getMap({}),
      home: accept.get('home') || getMap({})
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
    const { selected, disabled } = options

    const translatedOptions = Object.assign({}, options)
    if (!disabled) {
      const config = Object.assign({}, options.config)
      config.label = _T(config.label)
      translatedOptions.config = config
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
        <Text style={ss.comboLabel}>{_T(label)}:</Text>
      </View>
    )
  }

  _renderOutCombos = transportType => {
    const { out, home } = this.acceptData
    const { connections } = this.props
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
            selected: out.get(KEY_NAMES.TRANSFER),
            locked: this.shouldLockTrip
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('transferCity')}
          {this._renderSelector(getTransferCities({
            direction: 'out',
            connections,
            transportType,
            transfer: out.get(KEY_NAMES.TRANSFER),
            selected: out.get(KEY_NAMES.TRANSFER_CITY),
            locked: this.shouldLockTrip
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('accommodation')}
          {this._renderSelector(getAccommodations({
            direction: 'out',
            transportType,
            selected: out.get(KEY_NAMES.ACCOMMODATION),
            locked: this.shouldLockTrip
          }))}
        </View>

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
      </View>
    )
  }

  _renderHomeCombos = transportType => {
    const { out, home } = this.acceptData
    const { connections } = this.props
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
            selected: home.get(KEY_NAMES.TRANSFER),
            locked: this.shouldLockTrip
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('transferCity')}
          {this._renderSelector(getTransferCities({
            direction: 'home',
            connections,
            transportType,
            transfer: home.get(KEY_NAMES.TRANSFER),
            selected: home.get(KEY_NAMES.TRANSFER_CITY),
            locked: this.shouldLockTrip
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('accommodation')}
          {this._renderSelector(getAccommodations({
            direction: 'home',
            transportType,
            selected: home.get(KEY_NAMES.ACCOMMODATION),
            locked: this.shouldLockTrip
          }))}
        </View>

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
    const { isAccepted, acceptedAt, dirty } = this.acceptData

    const acceptText = isAccepted && acceptedAt && !dirty
      ? `${_T('acceptedAt')} ${format(acceptedAt, DATE_FORMAT)}`
      : `${_T('accept')}`

    return (
      <View style={ss.futureTtip}>
        <TouchableOpacity
          style={ss.futureTripCheck}
          disabled={this.shouldLockTrip}
          onPress={this._setAcceptTrip}
        >
          <CheckBox
            disabled
            checked={isAccepted}
          />
          <Text style={ss.checkText}>{acceptText}</Text>
        </TouchableOpacity>
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
    const { user } = this.props
    const { isAccepted, out, home } = this.acceptData
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
        out: {
          location: out.get('location').get('key'),
          transfer: out.get('transfer').get('key'),
          transferCity: out.get('transferCity').get('key'),
          accommodation: out.get('accommodation').get('key'),
          bag: out.get('bag').get('key')
        },
        home: {
          location: home.get('location').get('key'),
          transfer: home.get('transfer').get('key'),
          transferCity: home.get('transferCity').get('key'),
          accommodation: home.get('accommodation').get('key'),
          bag: home.get('bag').get('key')
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

  render () {
    const { trip } = this.props
    const { dirty, isLoading } = this.acceptData
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
    const cardHeight = isDisabled ? 470 : 430
    const imageConHeight = isDisabled ? 410 : 370

    return (
      <View style={[ss.card, { height: cardHeight }]}>
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
              <View style={ss.bottomLeft}>
                <IonIcon name='people' color={Colors.black} size={30} />
                <Text style={[ss.brandText, { marginLeft: 10 }]}>{pax.size}</Text>
              </View>
              <View style={ss.bottomRight}>
                <FooterButtons
                  style={ss.footerButtons}
                  disabled={!dirty || this.shouldLockTrip}
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
    accept: getAaccept(state, departureId),
    user: getUser(state),
    connections: getConnections(state)
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
  selectorText: {
    fontSize: 14
  },
  dropDown: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3
  },
  selector: {
    flex: 1.5,
    height: 30,
    flexDirection: 'row',
    backgroundColor: Colors.silver,
    borderRadius: 3
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
    flex: 5
  },
  outHomeTabs: {
    marginBottom: 10
  }
})
