import React, { Component } from 'react'
import {
  CardItem, Left, Body, View,
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
import { modifyPaxData } from '../modules/pax/action'
import { connect } from 'react-redux'
import { getPaxFromStore } from '../selectors'
const _T = Translator('PaxDetailsScreen')

class PaxCard extends Component {
  constructor (props) {
    super(props)
    const { pax } = props
    actionDispatcher(modifyPaxData({
      key: String(pax.get('id')),
      pax
    }))
    this.state = {
      editMode: false,
      phone: '',
      comment: ''
    }
  }

  _toggleEditMode = () => {
    this.setState({
      editMode: !this.state.editMode,
      phone: '',
      comment: ''
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

  _renderPhone = phone => {
    return (
      <CardItem>
        <Body>
          <Text>{_T('phone')}</Text>
          <Text note>{phone}</Text>
        </Body>
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

  _renderComment = comment => {
    return (
      <CardItem>
        <Body>
          <Text>{_T('comment')}</Text>
          <Text note>{comment}</Text>
        </Body>
      </CardItem>
    )
  }

  _renderComms = phone => {
    return (
      <CardItem>
        <Body style={ss.commsBody}>
          <IconButton name='phone' color='green' onPress={() => call(phone)} />
          <IconButton name='sms' color='blue' onPress={() => sms(phone)} />
        </Body>
      </CardItem>
    )
  }

  _onCancel = () => {
    this.setState({
      editMode: false,
      phone: '',
      comment: ''
    })
  }

  _onSave = () => {
    const { pax } = this.props
    const { phone, comment } = this.state
    const update = {}
    if (phone) update.phone = phone
    if (comment) update.comment = comment
    actionDispatcher(modifyPaxData({
      key: String(pax.get('id')),
      pax: update
    }))

    this._onCancel()
  }

  _onChangeText = field => text => {
    this.setState({ [field]: text })
  }

  _renderEditForm = () => {
    return (
      <View style={ss.editForm}>
        <View style={ss.inputItem}>
          <Text style={ss.label}>Cell:</Text>
          <TextInput
            placeholder='Phone'
            value={this.state.phone}
            keyboardType='numeric'
            style={ss.input}
            onChangeText={this._onChangeText('phone')}
          />
        </View>
        <View style={ss.inputItem}>
          <Text style={ss.label}>Comment:</Text>
          <TextInput
            placeholder='Comment'
            value={this.state.comment}
            multiline
            numberOfLines={5}
            autoCorrect={false}
            style={ss.multiLineInput}
            onChangeText={this._onChangeText('comment')}
          />
        </View>
        <View style={ss.formFooter}>
          <OutLineButton text='Cancel' style={ss.footerButton} onPress={this._onCancel} />
          <OutLineButton text='Save' style={ss.footerButton} onPress={this._onSave} />
        </View>
      </View>
    )
  }

  render () {
    const { pax, paxInStore } = this.props
    const id = String(pax.get('id'))
    const modifiedPax = paxInStore.get('modifiedData').get(id) || pax

    const { editMode } = this.state
    const phone = modifiedPax.get('phone')
    const booking = modifiedPax.get('booking')
    const excursion = modifiedPax.get('excursionPack')
    const coPax = modifiedPax.get('booking').get('pax')
    const comment = modifiedPax.get('comment')
    return (
      <KeyboardAwareScrollView
        extraScrollHeight={isIOS ? 0 : 150}
        enableOnAndroid
        keyboardShouldPersistTaps='always'
      >
        {this._renderPxName(modifiedPax)}
        {!!phone && this._renderPhone(phone)}
        {this._renderBooking(booking)}
        {!!excursion && this._renderExcursion()}
        {!!coPax.size && this._renderCoPax(coPax, modifiedPax)}
        {!!comment && this._renderComment(comment)}
        {!!phone && this._renderComms(phone)}
        {editMode && this._renderEditForm()}
      </KeyboardAwareScrollView>
    )
  }
}

const stateToProps = state => ({
  paxInStore: getPaxFromStore(state)
})

export default connect(stateToProps, null)(PaxCard)

const ss = StyleSheet.create({
  commsBody: {
    flexDirection: 'row'
  },
  booking: {
    paddingVertical: 5
  },
  bookingText: {
    color: Colors.headerBg
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
    padding: 5
  },
  multiLineInput: {
    height: 80,
    borderWidth: 1,
    borderRadius: 4,
    padding: 5
  },
  footerButton: {
    marginRight: 10,
    borderRadius: 5
  }
})
