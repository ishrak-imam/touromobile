
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
import Translator from '../../utils/translator'
import { showModal } from '../../modal/action'
import uuid from 'react-native-uuid'

const _T = Translator('SMSScreen')

class SMSScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: ''
    }
    this._messageId = uuid.v1()
  }

  _onChangeText = message => {
    this.setState({ message })
  }

  _onSend = numbers => {
    const { connection } = this.props
    return () => {
      Keyboard.dismiss()
      const { message } = this.state
      if (connection.get('online')) {
        actionDispatcher(sendSmsReq({
          smsPayload: {
            message,
            recipients: numbers.toJS()
          },
          isNeedJwt: true,
          showToast: true,
          sucsMsg: 'Sending message successful.',
          failMsg: 'Sending message failed.'
        }))
      } else {
        actionDispatcher(showModal({
          type: 'info',
          header: 'Internet connection is not available.',
          body: 'The group SMS could not be sent. The SMS message is stored under "Pending SMS". When the internet connection is back you can go to the "Pending SMS" view and send any stored message.',
          onOk: () => {}
        }))
        actionDispatcher(storePendingSms({
          key: this._messageId,
          smsPayload: {
            message,
            recipients: numbers
          }
        }))
      }
    }
  }

  render () {
    const { message } = this.state
    const { navigation, smsLoading } = this.props
    const numbers = navigation.getParam('numbers')
    const brand = navigation.getParam('brand')
    return (
      <Container>
        <Header
          left='back'
          title={_T('title')}
          navigation={navigation}
          brand={brand}
        />
        <View style={ss.messageContainer}>
          <Text style={ss.headerText}>{_T('message')}</Text>
          <TextInput
            underlineColorAndroid='transparent'
            placeholder={_T('enterText')}
            value={message}
            style={ss.input}
            onChangeText={this._onChangeText}
            multiline
          />
          <View style={ss.footer}>
            <OutLineButton
              disabled={!message}
              text={_T('send')}
              color={Colors.green}
              onPress={this._onSend(numbers)}
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
    margin: 15,
    marginTop: 20
  },
  headerText: {
    fontWeight: 'bold'
  },
  input: {
    height: 200,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.charcoal,
    borderRadius: 2,
    padding: 5,
    marginTop: 20
  },
  footer: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
})
