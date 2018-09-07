import React, { Component } from 'react'
import {
  View, Form, Item, Label, Input,
  Button, Text, Spinner
} from 'native-base'
import {
  ImageBackground, Animated,
  Keyboard, KeyboardAvoidingView, StyleSheet
} from 'react-native'
import { Colors, Images } from '../../theme'
import { getLogin } from './selector'
import { getConnection } from '../../utils/selector'
import { connect } from 'react-redux'
import { networkActionDispatcher } from '../../utils/actionDispatcher'
import { loginReq } from './action'
import Translator from '../../utils/translator'
const _T = Translator('LoginScreen')

class Login extends Component {
  constructor (props) {
    super(props)
    this.logoDim = new Animated.Value(200)
    this.radius = new Animated.Value(100)
    this.kbrdShow = Keyboard.addListener('keyboardDidShow', this._onKbrdShow)
    this.kbrdHide = Keyboard.addListener('keyboardDidHide', this._onKbrdHide)

    this.state = {
      user: '',
      password: ''
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
        toValue: isKbrdOpen ? 100 : 200,
        duration: 300
      }
    ).start()
    Animated.timing(
      this.radius,
      {
        toValue: isKbrdOpen ? 50 : 100,
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
    this.setState({ [field]: text })
  }

  _login = () => {
    Keyboard.dismiss()
    const { user, password } = this.state
    const { dispatch, connection } = this.props
    networkActionDispatcher(
      dispatch,
      loginReq({ user, password }),
      connection
    )
  }

  render () {
    const { username, password } = this.state
    const isLoading = this.props.login.get('isLoading')
    return (
      <ImageBackground source={Images.background} style={{ flex: 1 }}>
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
              <View style={ss.submitContainer}>
                <Button full onPress={this._login} disabled={isLoading}>
                  {isLoading ? <Spinner color={Colors.headerBg} /> : <Text>{_T('login')}</Text>}
                </Button>
              </View>
            </Form>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    )
  }
}

const stateToProps = state => ({
  login: getLogin(state),
  connection: getConnection(state)
})

export default connect(stateToProps, dispatch => ({ dispatch }))(Login)

const ss = StyleSheet.create({
  container: {
    flex: 1
  },
  logo: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  formContainer: {
    flex: 1.5,
    justifyContent: 'flex-start',
    marginTop: 40
  },
  form: {
    backgroundColor: Colors.snow,
    marginHorizontal: 20
  },
  item: {
    marginRight: 15
  },
  submitContainer: {
    marginHorizontal: 10,
    marginVertical: 15
  }
})
