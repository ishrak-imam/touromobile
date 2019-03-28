
import React, { Component } from 'react'
import { StyleSheet, TextInput, Keyboard } from 'react-native'
import { Container, View, Text } from 'native-base'
import { Colors } from '../../theme'
import Header from '../../components/header'
import OutLineButton from '../../components/outlineButton'
import { actionDispatcher } from '../../utils/actionDispatcher'
import { sendSmsReq, storePendingSms } from './action'
import { getSmsLoading, getConnection } from '../../selectors'
import { connect } from 'react-redux'
import OverlaySpinner from '../../components/overlaySpinner'
import _T from '../../utils/translator'
import { showModal } from '../../modal/action'
import uuid from 'react-native-uuid'
import { getMap } from '../../utils/immutable'

class SMSScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: '',
      subject: ''
    }
    this._messageId = uuid.v1()
  }

  _onChangeText = field => text => {
    this.setState({ [field]: text })
  }

  _onSend = (numbers, brand) => {
    const { connection } = this.props
    return () => {
      Keyboard.dismiss()
      const { subject, message } = this.state
      if (connection.get('online')) {
        actionDispatcher(sendSmsReq({
          smsPayload: {
            brand,
            subject,
            message,
            recipients: numbers.toJS()
          },
          isNeedJwt: true,
          showToast: true,
          sucsMsg: _T('sendingSMSsucs'),
          failMsg: _T('sendingSMSfail')
        }))
      } else {
        actionDispatcher(showModal({
          type: 'info',
          header: _T('header'),
          body: _T('body'),
          onOk: () => {}
        }))
        actionDispatcher(storePendingSms({
          key: this._messageId,
          smsPayload: getMap({
            id: this._messageId,
            isLoading: false,
            sent: false,
            subject,
            brand,
            message,
            to: numbers,
            createdAt: new Date().toISOString()
          })
        }))
      }
    }
  }

  render () {
    const { subject, message } = this.state
    const { navigation, smsLoading } = this.props
    const numbers = navigation.getParam('numbers')
    const brand = navigation.getParam('brand')
    return (
      <Container>
        <Header
          left='back'
          title={_T('sms')}
          navigation={navigation}
          brand={brand}
        />
        <View style={ss.messageContainer}>

          <Text style={ss.headerText}>{_T('subject')}:</Text>
          <TextInput
            underlineColorAndroid='transparent'
            placeholder={_T('enterSub')}
            value={subject}
            style={[ss.input, { height: 50 }]}
            onChangeText={this._onChangeText('subject')}
            multiline
            autoCorrect={false}
          />

          <Text style={ss.headerText}>{_T('message')}:</Text>
          <TextInput
            underlineColorAndroid='transparent'
            placeholder={_T('enterText')}
            value={message}
            style={[ss.input, { height: 200 }]}
            onChangeText={this._onChangeText('message')}
            multiline
            autoCorrect={false}
          />

          <View style={ss.footer}>
            <OutLineButton
              disabled={!message || !subject}
              text={_T('send')}
              color={Colors.green}
              onPress={this._onSend(numbers, brand)}
            />
          </View>
        </View>
        {smsLoading && <OverlaySpinner />}
      </Container>
    )
  }
}

const stateToProps = state => ({
  smsLoading: getSmsLoading(state),
  connection: getConnection(state)
})

export default connect(stateToProps, null)(SMSScreen)

const ss = StyleSheet.create({
  messageContainer: {
    marginHorizontal: 15
    // marginTop: 20
  },
  headerText: {
    fontWeight: 'bold',
    marginTop: 20
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.charcoal,
    borderRadius: 2,
    padding: 5,
    marginTop: 10,
    textAlignVertical: 'top'
  },
  footer: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})
