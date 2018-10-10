import React, { Component } from 'react'
import {
  View, Form, Item, Label,
  Text, Spinner, Input
} from 'native-base'
import {
  ImageBackground, Animated, TouchableOpacity,
  Keyboard, KeyboardAvoidingView, StyleSheet
} from 'react-native'
import { checkEmail } from '../../utils/stringHelpers'
import { Colors, Images } from '../../theme'
import { getLogin } from '../../selectors'
import { connect } from 'react-redux'
import { networkActionDispatcher } from '../../utils/actionDispatcher'
import { loginReq, forgotPassReq } from './action'
import Translator from '../../utils/translator'
import Button from '../../components/button'

const _T = Translator('LoginScreen')

class Login extends Component {
  constructor (props) {
    super(props)
    this.logoDim = new Animated.Value(100)
    this.radius = new Animated.Value(50)
    this.kbrdShow = Keyboard.addListener('keyboardDidShow', this._onKbrdShow)
    this.kbrdHide = Keyboard.addListener('keyboardDidHide', this._onKbrdHide)

    this.state = {
      user: '',
      password: '',
      isValidEmail: '',
      passTyped: ''
    }
  }

  componentWillUnmount () {
    this.kbrdShow.remove()
    this.kbrdHide.remove()
  }

  _logoResize = isKbrdOpen => {
    Animated.timing(
      this.logoDim,
      {
        toValue: isKbrdOpen ? 50 : 100,
        duration: 300
      }
    ).start()
    Animated.timing(
      this.radius,
      {
        toValue: isKbrdOpen ? 25 : 50,
        duration: 300
      }
    ).start()
  }

  _onKbrdShow = () => {
    this._logoResize(true)
  }

  _onKbrdHide = () => {
    this._logoResize(false)
  }

  _handleChange = field => text => {
    this.setState({ [field]: text }, this._checkIsReady)
  }

  _checkIsReady = () => {
    const { user, password } = this.state
    this.setState({
      isValidEmail: checkEmail(user),
      passTyped: !!password
    })
  }

  _login = () => {
    Keyboard.dismiss()
    const { user, password } = this.state
    networkActionDispatcher(loginReq({
      user,
      password
    }))
  }

  _forgotPass = () => {
    Keyboard.dismiss()
    const { user } = this.state
    networkActionDispatcher(forgotPassReq({
      user
    }))
  }

  _renderMessage = () => {
    const { login } = this.props
    const forgotPass = login.get('forgotPass')
    const error = login.get('error')
    const e = forgotPass || error
    return (
      <Item style={ss.errorItem}>
        <View style={ss.errorContainer}>
          {<Text style={ss.errorText}>{e ? e.get('msg') : ' '}</Text>}
        </View>
      </Item>
    )
  }

  render () {
    const { username, password, isValidEmail, passTyped } = this.state
    const { login } = this.props
    const isLoading = login.get('isLoading')
    const isDisabled = (isLoading || !isValidEmail || !passTyped)
    const forgotDisabled = (isLoading || !isValidEmail)
    return (
      <ImageBackground source={Images.background} style={ss.background}>
        <KeyboardAvoidingView style={ss.container} behavior='padding'>
          <View style={ss.logo}>
            <Animated.Image
              style={{
                alignSelf: 'center',
                height: this.logoDim,
                width: this.logoDim,
                borderRadius: this.radius
              }}
              source={Images.logo}
            />
          </View>
          <View style={ss.formContainer}>
            <Form style={ss.form}>
              <Item stackedLabel style={ss.item}>
                <Label>{_T('username')}</Label>
                <Input
                  ref='username'
                  value={username}
                  editable={!isLoading}
                  keyboardType='email-address'
                  // returnKeyType="next"
                  autoCapitalize='none'
                  autoCorrect={false}
                  onChangeText={this._handleChange('user')}
                  underlineColorAndroid='transparent'
                />
              </Item>
              <Item stackedLabel style={ss.item}>
                <Label>{_T('password')}</Label>
                <Input
                  ref={ref => (this.password = ref)}
                  value={password}
                  editable={!isLoading}
                  keyboardType='default'
                  // returnKeyType="done"
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry
                  onChangeText={this._handleChange('password')}
                  underlineColorAndroid='transparent'
                />
              </Item>

              {this._renderMessage()}

              <View style={ss.submitContainer}>
                <Button full onPress={this._login} disabled={isDisabled}>
                  {isLoading ? <Spinner color={Colors.blue} /> : <Text>{_T('login')}</Text>}
                </Button>
                <TouchableOpacity style={ss.forgotPass} disabled={forgotDisabled} onPress={this._forgotPass}>
                  <Text style={{ color: forgotDisabled ? Colors.steel : Colors.blue }} note>{_T('forgotPass')}</Text>
                </TouchableOpacity>
              </View>
            </Form>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    )
  }
}

const stateToProps = state => ({
  login: getLogin(state)
})

export default connect(stateToProps, null)(Login)

const ss = StyleSheet.create({
  background: {
    flex: 1
  },
  container: {
    flex: 1
  },
  logo: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  formContainer: {
    flex: 2.5,
    justifyContent: 'center',
    borderRadius: 7
    // marginTop: 30
  },
  form: {
    borderRadius: 7,
    backgroundColor: Colors.white,
    marginHorizontal: 20
  },
  item: {
    marginRight: 15
  },
  errorItem: {
    marginTop: 15,
    marginRight: 15,
    borderBottomWidth: 0
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5
    // borderWidth: 1,
    // borderRadius: 3,
    // borderColor: Colors.fire
  },
  errorText: {
    textAlign: 'center',
    color: Colors.fire
  },
  submitContainer: {
    marginHorizontal: 10,
    marginVertical: 15,
    alignItems: 'center'
  },
  forgotPass: {
    marginTop: 10
  }
})
