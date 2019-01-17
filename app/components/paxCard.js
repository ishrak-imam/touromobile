import React, { Component } from 'react'
import {
  CardItem, Left, Body,
  Text, Right, View
} from 'native-base'
import { IonIcon, Colors } from '../theme'
import { TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { call, sms } from '../utils/comms'
import Translator from '../utils/translator'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import isIOS from '../utils/isIOS'
import { actionDispatcher } from '../utils/actionDispatcher'
import { modifyPaxData } from '../modules/modifiedData/action'
import { connect } from 'react-redux'
import { getModifiedPax } from '../selectors'
import { mergeMapShallow } from '../utils/immutable'
import FooterButtons from '../components/footerButtons'
import PaxOrder from './paxOrder'
const _T = Translator('PaxDetailsScreen')

class PaxCard extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editMode: false,
      phone: this.paxData.get('phone'),
      comment: this.paxData.get('comment')
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
      comment: this.paxData.get('comment')
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

  _renderPhone = phone => {
    const phnOnPress = phone ? () => call(phone) : () => {}
    const smsOnPress = phone ? () => sms(phone) : () => {}
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

  _renderBooking = booking => {
    return (
      <CardItem>
        <Body>
          <Text style={ss.label}>{_T('booking')}</Text>
          <TouchableOpacity onPress={() => {}} style={ss.booking}>
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

  _onCancel = () => {
    this.setState({
      editMode: false,
      phone: this.paxData.get('phone'),
      comment: this.paxData.get('comment')
    })
  }

  _onSave = () => {
    const { pax, departureId } = this.props
    const { phone, comment } = this.state

    // if (!phone && !comment) return
    // const update = {}
    // if (phone) update.phone = phone
    // if (comment) update.comment = comment

    actionDispatcher(modifyPaxData({
      departureId,
      paxId: String(pax.get('id')),
      pax: { phone, comment }
    }))

    this.setState({
      editMode: false,
      phone,
      comment
    })
  }

  _onChangeText = field => text => {
    this.setState({ [field]: text })
  }

  _renderPaxOrder = (bookingId, departureId, pax) => {
    return (
      <View style={ss.paxOrder}>
        <PaxOrder bookingId={bookingId} departureId={departureId} pax={pax} />
      </View>
    )
  }

  render () {
    const { editMode, phone, comment } = this.state
    // const { departureId, pax, isFlight } = this.props
    const booking = this.paxData.get('booking')
    // const bookingId = String(booking.get('id'))
    const excursion = this.paxData.get('excursionPack')
    const coPax = this.paxData.get('booking').get('pax')
    return (
      <KeyboardAwareScrollView
        extraScrollHeight={isIOS ? 0 : 200}
        enableOnAndroid
        keyboardShouldPersistTaps='always'
      >
        {this._renderPxName(this.paxData)}
        {this._renderPhone(phone)}
        {this._renderBooking(booking)}
        {!!excursion && this._renderExcursion()}
        {!!coPax.size && this._renderCoPax(coPax, this.paxData)}
        {this._renderComment(comment)}
        {editMode && <FooterButtons style={ss.footerButton} onCancel={this._onCancel} onSave={this._onSave} />}
        {/* {!isFlight && this._renderPaxOrder(bookingId, departureId, pax)} */}
      </KeyboardAwareScrollView>
    )
  }
}

const stateToProps = (state, props) => {
  const { departureId } = props
  return {
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
    // marginHorizontal: 5
  }
})
