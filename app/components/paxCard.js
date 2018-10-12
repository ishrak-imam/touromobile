import React, { Component } from 'react'
import {
  CardItem, Left, Body,
  Text, Right
} from 'native-base'
import { IonIcon, Colors } from '../theme'
import IconButton from '../components/iconButton'
import { TouchableOpacity, StyleSheet, TextInput } from 'react-native'
import { call, sms } from '../utils/comms'
import Translator from '../utils/translator'
import OutLineButton from '../components/outlineButton'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import isIOS from '../utils/isIOS'
import { actionDispatcher } from '../utils/actionDispatcher'
import { modifyPaxData } from '../modules/modifiedData/action'
import { connect } from 'react-redux'
import { getModifiedPax } from '../selectors'
import { mergeMapShallow } from '../utils/immutable'
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
        <Left>
          <IonIcon name='person' />
          <Body>
            <Text>{name}</Text>
            <Text note>{ssn}</Text>
          </Body>
        </Left>
        <Right>
          <IconButton name='edit' onPress={this._toggleEditMode} />
        </Right>
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
    const phnColor = phone ? 'green' : Colors.charcoal
    const smsColor = phone ? 'blue' : Colors.charcoal

    return (
      <CardItem>
        <Body style={{ flex: 3 }}>
          <Text>{_T('phone')}</Text>
          {this._renderPhoneInput(phone)}
        </Body>
        <Right style={ss.comms}>
          <IconButton name='phone' color={phnColor} onPress={phnOnPress} />
          <IconButton name='sms' color={smsColor} onPress={smsOnPress} />
        </Right>
      </CardItem>
    )
  }

  _renderBooking = booking => {
    return (
      <CardItem>
        <Body>
          <Text>{_T('booking')}</Text>
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
          <IonIcon name='check' color='green' />
        </Body>
      </CardItem>
    )
  }

  _renderCoPax = (coPax, pax) => {
    return (
      <CardItem>
        <Body>
          <Text>{_T('travelsWith')}</Text>
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
          <Text>{_T('comment')}</Text>
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

  _renderFooterButtons = () => {
    return (
      <CardItem style={{ justifyContent: 'flex-end' }}>
        <OutLineButton text={_T('cancel')} style={{ backgroundColor: Colors.cancel }} onPress={this._onCancel} />
        <OutLineButton text={_T('save')} style={{ backgroundColor: Colors.green }} onPress={this._onSave} />
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
        {editMode && this._renderFooterButtons()}
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
    flexDirection: 'row'
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
    borderRadius: 4,
    padding: 5,
    width: '100%',
    marginTop: 5
  },
  multiLineInput: {
    height: 80,
    borderWidth: 1,
    borderRadius: 4,
    padding: 5,
    marginTop: 5,
    width: '100%'
  },
  footerButton: {
    marginRight: 10,
    borderRadius: 3
  }
})
