import React, { Component } from 'react'
import {
  CardItem, Left, Body,
  Text, Right, View
} from 'native-base'
import { IonIcon, Colors } from '../theme'
import { TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { call, sms } from '../utils/comms'
import _T from '../utils/translator'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import isIOS from '../utils/isIOS'
import { actionDispatcher } from '../utils/actionDispatcher'
import { modifyPaxData } from '../modules/modifiedData/action'
import { connect } from 'react-redux'
import {
  getModifiedPax,
  getHideMyPhone,
  getConnectionLines,
  formatConnectionLines,
  getConnectionLineHotels,
  formatConnectionLineHotels
} from '../selectors'
import { mergeMapShallow, getMap, getSet } from '../utils/immutable'
import FooterButtons from './footerButtons'
import CheckBox from './checkBox'
import { navigate } from '../navigation/service'
import { format } from 'date-fns'
import { sorter } from '../utils/stringHelpers'

const ETA_FORMAT = 'HH:mm'

class PaxCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editMode: false,
      phone: this.paxData.get('phone'),
      comment: this.paxData.get('comment'),
      adult: this.paxData.get('adult')
    }
  }

  get paxData () {
    const { pax, modifiedPax } = this.props
    const paxId = String(pax.get('id'))
    const modifiedData = modifiedPax.get(paxId)
    /**
     * merge reference data with modified pax data
     * for UI consistency.
     */
    return mergeMapShallow(pax, modifiedData)
  }

  _toggleEditMode = () => {
    this.setState({
      editMode: !this.state.editMode,
      phone: this.paxData.get('phone'),
      comment: this.paxData.get('comment'),
      adult: this.paxData.get('adult')
    })
  }

  _renderPxName = pax => {
    const name = `${pax.get('firstName')} ${pax.get('lastName')}`
    const ssn = pax.get('ssn')
    return (
      <CardItem>
        <Left style={ss.nameLeft}>
          <IonIcon name='person' />
          <Body>
            <Text style={ss.label}>{name}</Text>
            <Text note>{ssn}</Text>
          </Body>
        </Left>
        <TouchableOpacity style={ss.nameRight} onPress={this._toggleEditMode}>
          <IonIcon name='edit' />
        </TouchableOpacity>
      </CardItem>
    )
  }

  _renderPhoneInput = phone => {
    const { editMode } = this.state
    return editMode
      ? <TextInput
        underlineColorAndroid='transparent'
        placeholder='Phone'
        value={phone}
        keyboardType='numeric'
        style={ss.input}
        onChangeText={this._onChangeText('phone')}
      />
      : <Text note>{phone}</Text>
  }

  _sms = phone => {
    const { brand, hideMyPhone } = this.props
    hideMyPhone
      ? navigate('SMS', { numbers: getSet([phone]), brand })
      : sms(phone)
  }

  _renderPhone = phone => {
    const phnOnPress = phone ? () => call(phone) : () => {}
    const smsOnPress = phone ? () => this._sms(phone) : () => {}
    const phnColor = phone ? Colors.green : Colors.charcoal
    const smsColor = phone ? Colors.blue : Colors.charcoal

    return (
      <CardItem>
        <Body style={ss.phoneLeft}>
          <Text style={ss.label}>{_T('phone')}</Text>
          {this._renderPhoneInput(phone)}
        </Body>
        <Right style={ss.comms}>
          <IonIcon name='phone' color={phnColor} onPress={phnOnPress} />
          <IonIcon name='sms' color={smsColor} onPress={smsOnPress} />
        </Right>
      </CardItem>
    )
  }

  _toOrdersScreen = booking => {
    const { brand, isFlight } = this.props
    if (isFlight) return () => {}

    const { departureId } = this.props
    return () => {
      navigate('Orders', { brand, booking, departureId })
    }
  }

  _renderBooking = booking => {
    return (
      <CardItem>
        <Body>
          <Text style={ss.label}>{_T('booking')}</Text>
          <TouchableOpacity onPress={this._toOrdersScreen(booking)} style={ss.booking}>
            <Text style={ss.bookingText}>{booking.get('id')}</Text>
          </TouchableOpacity>
        </Body>
      </CardItem>
    )
  }

  _renderExcursion = () => {
    return (
      <CardItem>
        <Body>
          <Text>{_T('excursionPack')}</Text>
          <IonIcon name='check' color={Colors.green} />
        </Body>
      </CardItem>
    )
  }

  _renderCoPax = (coPax, pax) => {
    return (
      <CardItem>
        <Body>
          <Text style={ss.label}>{_T('travelsWith')}</Text>
          {coPax.filter(p => p.get('id') !== pax.get('id')).map(p => {
            const name = `${p.get('firstName')} ${p.get('lastName')}`
            return (<Text key={p.get('id')} note>{name}</Text>)
          })}
        </Body>
      </CardItem>
    )
  }

  _renderCommentInput = comment => {
    const { editMode } = this.state
    return editMode
      ? <TextInput
        underlineColorAndroid='transparent'
        placeholder='Comment'
        value={comment}
        multiline
        numberOfLines={5}
        autoCorrect={false}
        style={ss.multiLineInput}
        onChangeText={this._onChangeText('comment')}
      />
      : <Text note>{comment}</Text>
  }

  _renderComment = comment => {
    return (
      <CardItem>
        <Body>
          <Text style={ss.label}>{_T('comment')}</Text>
          {this._renderCommentInput(comment)}
        </Body>
      </CardItem>
    )
  }

  _renderAdult = () => {
    const { editMode, adult } = this.state
    return (
      <CardItem>
        <View style={ss.adultCon}>
          <Text style={ss.label}>{_T('adult')}</Text>
          <TouchableOpacity style={ss.adultCheck} disabled={!editMode} onPress={this._onAdultToggle}>
            <CheckBox checked={adult} />
          </TouchableOpacity>
        </View>
      </CardItem>
    )
  }

  _onCancel = () => {
    this.setState({
      editMode: false,
      phone: this.paxData.get('phone'),
      comment: this.paxData.get('comment'),
      adult: this.paxData.get('adult')
    })
  }

  _onSave = () => {
    const { pax, departureId } = this.props
    const { phone, comment, adult } = this.state

    // if (!phone && !comment) return
    // const update = {}
    // if (phone) update.phone = phone
    // if (comment) update.comment = comment

    actionDispatcher(modifyPaxData({
      departureId,
      paxId: String(pax.get('id')),
      pax: { phone, comment, adult }
    }))

    this.setState({
      editMode: false,
      phone,
      comment,
      adult
    })
  }

  _onChangeText = field => text => {
    this.setState({ [field]: text })
  }

  _onAdultToggle = () => {
    this.setState({ adult: !this.state.adult })
  }

  _findLocationInfoByPaxId = (line, paxId) => {
    const locations = line.get('locations')
    const location = locations.find(loc => {
      const passengers = loc.get('passengers')
      return passengers.find(pax => String(pax.get('id')) === paxId)
    })
    return {
      destination: location.get('name'),
      eta: location.get('eta')
    }
  }

  _findLocationInfoByLineName = (line, lineName) => {
    const locations = line.get('locations')
    const location = locations.find(loc => {
      const connectTo = loc.get('connectTo')
      return connectTo.get(lineName)
    })
    return {
      destination: location.get('name'),
      eta: location.get('eta')
    }
  }

  _findLineInfo = (line, lines, connection, paxId, childLine) => {
    const name = line.get('name')
    const type = line.get('type')

    let lineInfo = { destination: '', eta: '' }

    const connectFrom = line.get('connectFrom')
    if (connectFrom) {
      if (paxId) {
        lineInfo = this._findLocationInfoByPaxId(line, paxId)
      } else {
        lineInfo = this._findLocationInfoByLineName(line, childLine)
      }
      let switches = connection.get('switches') || getMap({})
      let switchConnection = switches.get(name) || getMap({})
      switchConnection = switchConnection.set('name', name)
      switchConnection = switchConnection.set('destination', lineInfo.destination)
      switchConnection = switchConnection.set('type', type)
      switchConnection = switchConnection.set('eta', lineInfo.eta)
      switches = switches.set(name, switchConnection)
      connection = connection.set('switches', switches)

      const connectFromLine = lines.get(connectFrom)
      connection = this._findLineInfo(connectFromLine, lines, connection, undefined, name)
    } else {
      if (paxId) {
        lineInfo = this._findLocationInfoByPaxId(line, paxId)
      } else {
        lineInfo = this._findLocationInfoByLineName(line, childLine)
      }

      connection = connection.set('name', name)
      connection = connection.set('destination', lineInfo.destination)
      connection = connection.set('type', type)
      connection = connection.set('eta', lineInfo.eta)
    }

    return connection
  }

  _findConnection = () => {
    const { lines, hotels } = this.props
    const paxId = String(this.paxData.get('id'))
    let passenger = null

    const line = lines.find(line => {
      const locations = line.get('locations')
      return locations.find(loc => {
        const passengers = loc.get('passengers')
        return passengers.find(pax => {
          if (String(pax.get('id')) === paxId) {
            passenger = pax
            return true
          }
          return false
        })
      })
    })

    let connection = getMap({})

    if (line) {
      connection = this._findLineInfo(line, lines, connection, paxId)
      const hotelId = String(passenger.get('hotel'))
      if (hotelId && line.get('overnight')) {
        connection = connection.set('hotel', hotels.get(hotelId))
      }
    }

    return connection
  }

  _renderConnection = () => {
    const connection = this._findConnection()

    if (!connection.size) return null

    const destination = connection.get('destination')
    const eta = connection.get('eta')
    const name = connection.get('name')
    const hotel = connection.get('hotel')
    let switches = connection.get('switches')
    switches = switches.sort(sorter('name', 'DESC'))

    return (
      <CardItem>
        <Body>
          <Text style={ss.label}>Connection</Text>
          {!!hotel && <Text style={{ marginBottom: 20 }}>Overnight hotel: {hotel.get('name')}</Text>}
          <Text>Line {name} to {destination}. ETA {format(eta, ETA_FORMAT)}</Text>
          {!!switches && !!switches.size &&
            <View>
              {switches.valueSeq().map(sw => {
                const destination = sw.get('destination')
                const eta = sw.get('eta')
                const name = sw.get('name')
                return <Text key={name}>Switching to line {name} to {destination}. ETA {format(eta, ETA_FORMAT)}</Text>
              })}
            </View>}
        </Body>
      </CardItem>
    )
  }

  render () {
    const { editMode, phone, comment } = this.state
    const booking = this.paxData.get('booking')
    const excursion = this.paxData.get('excursionPack')
    const coPax = this.paxData.get('booking').get('pax')
    return (
      <KeyboardAwareScrollView
        extraScrollHeight={isIOS ? 50 : 200}
        enableOnAndroid
        keyboardShouldPersistTaps='always'
      >
        {this._renderPxName(this.paxData)}
        {this._renderPhone(phone)}
        {this._renderBooking(booking)}
        {!!excursion && this._renderExcursion()}
        {!!coPax.size && this._renderCoPax(coPax, this.paxData)}
        {this._renderComment(comment)}
        {this._renderAdult()}
        {editMode && <FooterButtons style={ss.footerButton} onCancel={this._onCancel} onSave={this._onSave} />}
        {this._renderConnection()}
      </KeyboardAwareScrollView>
    )
  }
}

const stateToProps = (state, props) => {
  const { departureId } = props
  const lines = getConnectionLines(state)
  const hotels = getConnectionLineHotels(state)
  return {
    hideMyPhone: getHideMyPhone(state),
    lines: formatConnectionLines(lines),
    hotels: formatConnectionLineHotels(getMap({ lines, hotels })),
    modifiedPax: getModifiedPax(state, departureId)
  }
}

export default connect(stateToProps, null)(PaxCard)

const ss = StyleSheet.create({
  comms: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  nameLeft: {
    flex: 5
  },
  nameRight: {
    flex: 1,
    alignItems: 'center'
  },
  phoneLeft: {
    flex: 3
  },
  booking: {
    paddingVertical: 5
  },
  bookingText: {
    color: Colors.blue
  },
  editForm: {
    padding: 20
  },
  inputItem: {
    marginBottom: 20
  },
  formFooter: {
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  adultCon: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  adultCheck: {
    marginLeft: 10,
    paddingHorizontal: 20,
    paddingBottom: 5
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold'
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.steel,
    borderRadius: 4,
    padding: 5,
    width: '100%',
    marginTop: 5
  },
  multiLineInput: {
    height: 80,
    borderWidth: 1,
    borderColor: Colors.steel,
    borderRadius: 4,
    padding: 5,
    marginTop: 5,
    width: '100%'
  },
  footerButton: {
    marginRight: 20
  },
  paxOrder: {
    marginTop: 20
  }
})
