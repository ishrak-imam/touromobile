
import React, { Component } from 'react'
import {
  View, Text, Left,
  Body, Right
} from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet, TextInput } from 'react-native'
import { Colors } from '../theme'
import FooterButtons from './footerButtons'
import IconButton from './iconButton'

export default class Profile extends Component {
  constructor (props) {
    super(props)
    this.state = {
      editMode: false
    }
  }

  _onCancel = () => {
    this.setState({
      editMode: false
    })
  }

  _onSave = () => {
    console.log('onSave')
  }

  _toggleEditMode = () => {
    this.setState({
      editMode: !this.state.editMode
    })
  }

  _renderHeader = () => {
    return (
      <View style={ss.cardItem}>
        <Left>
          <Text style={ss.boldText}>Details</Text>
        </Left>
        <Right>
          <IconButton name='edit' onPress={this._toggleEditMode} />
        </Right>
      </View>
    )
  }

  _renderName = () => {
    const { editMode } = this.state
    return (
      <View style={ss.item}>
        <View style={ss.cardItem}>
          <Left style={ss.left}>
            <Text>First name:</Text>
          </Left>
          <Body style={ss.body}>
            {
              editMode
                ? <TextInput
                  underlineColorAndroid='transparent'
                  placeholder='First name'
                  // value={''}
                  style={ss.input}
                  onChangeText={() => {}}
                />
                : <Text style={ss.text}>Ishrak Ibne</Text>
            }
          </Body>
        </View>
        <View style={ss.cardItem}>
          <Left style={ss.left}>
            <Text>Last name:</Text>
          </Left>
          <Body style={ss.body}>
            {
              editMode
                ? <TextInput
                  underlineColorAndroid='transparent'
                  placeholder='Last name'
                  // value={''}
                  style={ss.input}
                  onChangeText={() => {}}
                />
                : <Text style={ss.text}>Imam</Text>
            }
          </Body>
        </View>
      </View>
    )
  }

  _renderAddress = () => {
    const { editMode } = this.state
    return (
      <View style={ss.item}>
        <View style={ss.cardItem}>
          <Left style={ss.left}>
            <Text>Address:</Text>
          </Left>
          <Body style={ss.body}>
            {
              editMode
                ? <TextInput
                  underlineColorAndroid='transparent'
                  placeholder='Address'
                  // value={''}
                  style={ss.input}
                  onChangeText={() => {}}
                />
                : <Text style={ss.text}>Address</Text>
            }
          </Body>
        </View>
        <View style={ss.cardItem}>
          <Left style={ss.left}>
            <Text>City:</Text>
          </Left>
          <Body style={ss.body}>
            {
              editMode
                ? <TextInput
                  underlineColorAndroid='transparent'
                  placeholder='City'
                  // value={''}
                  style={ss.input}
                  onChangeText={() => {}}
                />
                : <Text style={ss.text}>City</Text>
            }
          </Body>
        </View>
        <View style={ss.cardItem}>
          <Left style={ss.left}>
            <Text>Zip:</Text>
          </Left>
          <Body style={ss.body}>
            {
              editMode
                ? <TextInput
                  underlineColorAndroid='transparent'
                  placeholder='Zip'
                  // value={''}
                  style={ss.input}
                  onChangeText={() => {}}
                />
                : <Text style={ss.text}>Zip</Text>
            }
          </Body>
        </View>
      </View>
    )
  }

  _renderContact = () => {
    const { editMode } = this.state
    return (
      <View style={ss.item}>
        <View style={ss.cardItem}>
          <Left style={ss.left}>
            <Text>Work phone:</Text>
          </Left>
          <Body style={ss.body}>
            {
              editMode
                ? <TextInput
                  underlineColorAndroid='transparent'
                  placeholder='Work phone'
                  // value={''}
                  style={ss.input}
                  onChangeText={() => {}}
                />
                : <Text style={ss.text}>work phone</Text>
            }
          </Body>
        </View>
        <View style={ss.cardItem}>
          <Left style={ss.left}>
            <Text>Private phone:</Text>
          </Left>
          <Body style={ss.body}>
            {
              editMode
                ? <TextInput
                  underlineColorAndroid='transparent'
                  placeholder='Private phone'
                  // value={''}
                  style={ss.input}
                  onChangeText={() => {}}
                />
                : <Text style={ss.text}>Private phone</Text>
            }
          </Body>
        </View>
        <View style={ss.cardItem}>
          <Left style={ss.left}>
            <Text>Email:</Text>
          </Left>
          <Body style={ss.body}>
            {
              editMode
                ? <TextInput
                  underlineColorAndroid='transparent'
                  placeholder='Email'
                  // value={''}
                  style={ss.input}
                  onChangeText={() => {}}
                />
                : <Text style={ss.text}>email</Text>
            }
          </Body>
        </View>
      </View>
    )
  }

  _renderAccount = () => {
    const { editMode } = this.state
    return (
      <View style={ss.item}>
        <View style={ss.cardItem}>
          <Left style={ss.left}>
            <Text>Bank acc no.:</Text>
          </Left>
          <Body style={ss.body}>
            {
              editMode
                ? <TextInput
                  underlineColorAndroid='transparent'
                  placeholder='Bank acc no.'
                  // value={''}
                  style={ss.input}
                  onChangeText={() => {}}
                />
                : <Text style={ss.text}>Bank acc no.</Text>
            }
          </Body>
        </View>
      </View>
    )
  }

  render () {
    const { style } = this.props
    const { editMode } = this.state
    return (
      <View style={style}>
        {this._renderHeader()}
        <KeyboardAwareScrollView
          enableOnAndroid
          keyboardShouldPersistTaps='always'
        >
          {this._renderName()}
          {this._renderAddress()}
          {this._renderContact()}
          {this._renderAccount()}
          {editMode && <FooterButtons onCancel={this._onCancel} onSave={this._onSave} />}
        </KeyboardAwareScrollView>
      </View>
    )
  }
}

const ss = StyleSheet.create({
  boldText: {
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
  item: {
    marginBottom: 20
  },
  cardItem: {
    flexDirection: 'row',
    paddingHorizontal: 15
  },
  left: {
    flex: 2
  },
  body: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  text: {
    lineHeight: 35,
    marginLeft: 20
  }
})
