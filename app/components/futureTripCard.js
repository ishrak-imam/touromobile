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
import { getPax, getAaccept } from '../selectors'
import { actionDispatcher } from '../utils/actionDispatcher'
import { getMap } from '../utils/immutable'
import { showModal } from '../modal/action'
import { setAcceptTrip, setAcceptTripCombos } from '../modules/modifiedData/action'

import {
  getKeyNames,
  getLocations,
  getAccomodations,
  getBagLocations,
  getTransfers,
  getTransferCities
} from '../utils/comboValues'

const KEY_NAMES = getKeyNames()

const DATE_FORMAT = 'DD/MM'

const HOME = 'HOME'
const OUT = 'OUT'

class FutureTripCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tab: OUT
    }
  }

  get acceptData () {
    const { accept } = this.props
    return {
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

  _renderTabs = () => {
    const { tab } = this.state
    return (
      <View style={ss.tabContainer}>
        <TouchableOpacity
          style={[ss.tab, { backgroundColor: tab === OUT ? Colors.blue : Colors.steel }]}
          onPress={this._onTabSwitch(OUT)}
        >
          <Text style={{ color: tab === OUT ? Colors.silver : Colors.black }}>Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[ss.tab, { backgroundColor: tab === HOME ? Colors.blue : Colors.steel }]}
          onPress={this._onTabSwitch(HOME)}
        >
          <Text style={{ color: tab === HOME ? Colors.silver : Colors.black }}>Home</Text>
        </TouchableOpacity>
      </View>
    )
  }

  _renderSelector = options => {
    const { selected, disabled } = options
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
          onPress={this._showSelections(options)}
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
        <Text style={ss.comboLabel}>{label}:</Text>
      </View>
    )
  }

  _renderOutCombos = transportType => {
    const { out, home } = this.acceptData
    return (
      <View style={ss.comboCon}>
        <View style={ss.combo}>
          {this._renderComboLabel('Boarding Location')}
          {this._renderSelector(getLocations({
            direction: 'out',
            transportType,
            selected: out.get(KEY_NAMES.LOCATION)
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('Transfer')}
          {this._renderSelector(getTransfers({
            direction: 'out',
            transportType,
            selected: out.get(KEY_NAMES.TRANSFER)
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('Transfer city')}
          {this._renderSelector(getTransferCities({
            direction: 'out',
            transportType,
            transfer: out.get(KEY_NAMES.TRANSFER),
            selected: out.get(KEY_NAMES.TRANSFER_CITY)
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('Accomodation')}
          {this._renderSelector(getAccomodations({
            direction: 'out',
            transportType,
            selected: out.get(KEY_NAMES.ACCOMODATION)
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('Bag pickup')}
          {this._renderSelector(getBagLocations({
            direction: 'out',
            transportType,
            selected: out.get(KEY_NAMES.BAG),
            other: home.get(KEY_NAMES.BAG)
          }))}
        </View>
      </View>
    )
  }

  _renderHomeCombos = transportType => {
    const { out, home } = this.acceptData

    return (
      <View style={ss.comboCon}>
        <View style={ss.combo}>
          {this._renderComboLabel('Alighting Location')}
          {this._renderSelector(getLocations({
            direction: 'home',
            transportType,
            selected: home.get(KEY_NAMES.LOCATION)
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('Transfer')}
          {this._renderSelector(getTransfers({
            direction: 'home',
            transportType,
            selected: home.get(KEY_NAMES.TRANSFER)
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('Transfer city')}
          {this._renderSelector(getTransferCities({
            direction: 'home',
            transportType,
            transfer: home.get(KEY_NAMES.TRANSFER),
            selected: home.get(KEY_NAMES.TRANSFER_CITY)
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('Accomodation')}
          {this._renderSelector(getAccomodations({
            direction: 'home',
            transportType,
            selected: home.get(KEY_NAMES.ACCOMODATION)
          }))}
        </View>

        <View style={ss.combo}>
          {this._renderComboLabel('Bag dropoff')}
          {this._renderSelector(getBagLocations({
            direction: 'home',
            transportType,
            selected: home.get(KEY_NAMES.BAG),
            other: out.get(KEY_NAMES.BAG)
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

  _renderCardTop = (transportType) => {
    const { tab } = this.state
    const { isAccepted } = this.acceptData
    return (
      <View style={ss.futureTtip}>
        <View style={ss.futureTripCheck}>
          <CheckBox
            checked={isAccepted}
            onPress={this._setAcceptTrip}
          />
          <Text style={ss.checkText}>Accept assignment</Text>
        </View>
        <View style={ss.comboTabs}>
          {this._renderTabs()}
          {tab === OUT && this._renderOutCombos(transportType)}
          {tab === HOME && this._renderHomeCombos(transportType)}
        </View>
      </View>
    )
  }

  render () {
    const { trip } = this.props
    const { dirty } = this.acceptData
    const brand = trip.get('brand')
    const name = trip.get('name')
    const outDate = format(trip.get('outDate'), DATE_FORMAT)
    const homeDate = format(trip.get('homeDate'), DATE_FORMAT)
    const transport = trip.get('transport')
    const image = trip.get('image')
    const pax = getPax(trip)
    const transportType = transport.get('type')

    return (
      <View style={ss.card}>

        <View style={[ss.cardHeader, { backgroundColor: Colors[`${brand}Brand`] }]}>
          <Text style={ss.brandText}>{brand}</Text>
          <Text>{`${name}    ${outDate} - ${homeDate}`}</Text>
          <IonIcon name={transportType} />
        </View>

        <View style={ss.imageContainer}>
          <ImageCache uri={image} style={ss.cardImage} />
          {/* {this._renderGradient()} */}
          <View style={ss.cardBody}>
            <View style={ss.cardTop}>
              {this._renderCardTop(transportType)}
            </View>
            <View style={ss.cardBottom}>
              <View style={ss.bottomLeft}>
                <IonIcon name='people' color={Colors.black} size={30} />
                <Text style={[ss.brandText, { marginLeft: 10 }]}>{pax.size}</Text>
              </View>
              <View style={ss.bottomRight}>
                <FooterButtons
                  hideCancel
                  style={ss.footerButtons}
                  disabled={!dirty}
                  onCancel={() => console.log('cancel')}
                  onSave={() => console.log('save')}
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
    accept: getAaccept(state, departureId)
  }
}

export default connect(stateToProps, null)(FutureTripCard)

const ss = StyleSheet.create({
  card: {
    height: 400,
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
  imageContainer: {
    borderWidth: 0,
    height: 350,
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10
  },
  tab: {
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 4,
    borderRadius: 5
  },
  selectorBox: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3
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
  }
})
