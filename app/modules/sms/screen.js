
import React, { Component } from 'react'
import { StyleSheet, TextInput, Keyboard } from 'react-native'
import { Container, View, Text } from 'native-base'
import { Colors } from '../../theme'
import Header from '../../components/header'
import OutLineButton from '../../components/outlineButton'
import { networkActionDispatcher } from '../../utils/actionDispatcher'
import { sendSmsReq } from './action'
import { getSms } from '../../selectors'
import { connect } from 'react-redux'
import OverlaySpinner from '../../components/overlaySpinner'

class SMSScreen extends Component {
  constructor (props) {
    super(props)
    this.state = {
      message: ''
    }
  }

  _onChangeText = message => {
    this.setState({ message })
  }

  _onSend = numbers => () => {
    Keyboard.dismiss()
    const { message } = this.state
    const smsPayload = {
      message,
      recipients: numbers.toJS()
    }
    networkActionDispatcher(sendSmsReq({
      smsPayload,
      isNeedJwt: true,
      showToast: true,
      sucsMsg: 'Sending message successful.',
      failMsg: 'Sending message failed.'
    }))
  }

  render () {
    const { message } = this.state
    const { navigation, sms } = this.props
    const numbers = navigation.getParam('numbers')
    const brand = navigation.getParam('brand')
    return (
      <Container>
        <Header
          left='back'
          title='SMS'
          navigation={navigation}
          brand={brand}
        />
        <View style={ss.messageContainer}>
          <Text style={ss.headerText}>Message</Text>
          <TextInput
            underlineColorAndroid='transparent'
            placeholder='Enter text...'
            value={message}
            style={ss.input}
            onChangeText={this._onChangeText}
          />
          <View style={ss.footer}>
            <OutLineButton
              disabled={!message}
              text='Send'
              color={Colors.green}
              onPress={this._onSend(numbers)}
            />
          </View>
        </View>
        {sms.get('isLoading') && <OverlaySpinner />}
      </Container>
    )
  }
}

const stateToProps = state => ({
  sms: getSms(state)
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
