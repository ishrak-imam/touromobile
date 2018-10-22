
import React, { Component } from 'react'
import {
  View, Text, Left,
  Body, Right
} from 'native-base'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { StyleSheet } from 'react-native'
import { Colors } from '../theme'
import FooterButtons from './footerButtons'
import IconButton from './iconButton'
import TextInput from '../components/textinput'

import { actionDispatcher } from '../utils/actionDispatcher'
import { editProfile, editProfileCancel } from '../modules/profile/action'

export default class Profile extends Component {
  constructor (props) {
    super(props)
    const { userDetails } = props
    this.state = {
      editMode: false,
      oldData: {
        firstName: userDetails.get('firstName'),
        lastName: userDetails.get('lastName'),
        address: userDetails.get('address'),
        city: userDetails.get('city'),
        zip: userDetails.get('zip'),
        phone: userDetails.get('phone'),
        email: userDetails.get('email'),
        account: userDetails.get('account')
      },
      changes: {}
    }
  }

  _handleChange = field => {
    return text => {
      actionDispatcher(editProfile({ [field]: text }))
      this._trackChanges(field, text)
    }
  }

  _trackChanges = (field, text) => {
    this.state.changes[field] = text
  }

  _onCancel = () => {
    actionDispatcher(editProfileCancel(this.state.oldData))
    this.setState({
      editMode: false,
      changes: {}
    })
  }

  _onSave = () => {
    const { userDetails, onUpdate } = this.props
    let { changes } = this.state

    changes = Object.keys(changes).reduce((list, key) => {
      list.push({
        column: key,
        old: '',
        new: changes[key]
      })
      return list
    }, [])

    if (changes.length) {
      onUpdate({ changes, profile: userDetails })
    }

    this._onCancel()
  }

  _toggleEditMode = () => {
    this.setState({
      editMode: !this.state.editMode,
      changes: {}
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
    const { userDetails } = this.props
    const { editMode } = this.state
    const firstName = userDetails.get('firstName')
    const lastName = userDetails.get('lastName')
    return (
      <View style={ss.item}>
        <View style={ss.cardItem}>
          <Left style={ss.left}>
            <Text style={ss.label}>First name:</Text>
          </Left>
          <Body style={ss.body}>
            {
              editMode
                ? <TextInput
                  placeholder='First name'
                  style={ss.input}
                  onChange={this._handleChange('firstName')}
                  value={firstName}
                />
                : <Text style={ss.text}>{firstName}</Text>
            }
          </Body>
        </View>
        <View style={ss.cardItem}>
          <Left style={ss.left}>
            <Text style={ss.label}>Last name:</Text>
          </Left>
          <Body style={ss.body}>
            {
              editMode
                ? <TextInput
                  placeholder='Last name'
                  style={ss.input}
                  onChange={this._handleChange('lastName')}
                  value={lastName}
                />
                : <Text style={ss.text}>{lastName}</Text>
            }
          </Body>
        </View>
      </View>
    )
  }

  _renderAddress = () => {
    const { userDetails } = this.props
    const { editMode } = this.state
    const address = userDetails.get('address')
    const city = userDetails.get('city')
    const zip = userDetails.get('zip')
    return (
      <View style={ss.item}>
        <View style={ss.cardItem}>
          <Left style={ss.left}>
            <Text style={ss.label}>Address:</Text>
          </Left>
          <Body style={ss.body}>
            {
              editMode
                ? <TextInput
                  placeholder='Address'
                  style={ss.input}
                  onChange={this._handleChange('address')}
                  value={address}
                />
                : <Text style={ss.text}>{address}</Text>
            }
          </Body>
        </View>
        <View style={ss.cardItem}>
          <Left style={ss.left}>
            <Text style={ss.label}>City:</Text>
          </Left>
          <Body style={ss.body}>
            {
              editMode
                ? <TextInput
                  placeholder='City'
                  style={ss.input}
                  onChange={this._handleChange('city')}
                  value={city}
                />
                : <Text style={ss.text}>{city}</Text>
            }
          </Body>
        </View>
        <View style={ss.cardItem}>
          <Left style={ss.left}>
            <Text style={ss.label}>Zip:</Text>
          </Left>
          <Body style={ss.body}>
            {
              editMode
                ? <TextInput
                  placeholder='Zip'
                  style={ss.input}
                  onChange={this._handleChange('zip')}
                  value={zip}
                />
                : <Text style={ss.text}>{zip}</Text>
            }
          </Body>
        </View>
      </View>
    )
  }

  _renderContact = () => {
    const { userDetails } = this.props
    const { editMode } = this.state
    const phone = userDetails.get('phone')
    const email = userDetails.get('email')
    return (
      <View style={ss.item}>
        <View style={ss.cardItem}>
          <Left style={ss.left}>
            <Text style={ss.label}>Phone:</Text>
          </Left>
          <Body style={ss.body}>
            {
              editMode
                ? <TextInput
                  placeholder='Phone'
                  style={ss.input}
                  onChange={this._handleChange('phone')}
                  value={phone}
                />
                : <Text style={ss.text}>{phone}</Text>
            }
          </Body>
        </View>

        {/* <View style={ss.cardItem}>
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
        </View> */}

        <View style={ss.cardItem}>
          <Left style={ss.left}>
            <Text style={ss.label}>Email:</Text>
          </Left>
          <Body style={ss.body}>
            {
              editMode
                ? <TextInput
                  placeholder='Email'
                  style={ss.input}
                  onChange={this._handleChange('email')}
                  value={email}
                />
                : <Text style={ss.text}>{email}</Text>
            }
          </Body>
        </View>
      </View>
    )
  }

  _renderAccount = () => {
    const { userDetails } = this.props
    const { editMode } = this.state
    const account = userDetails.get('account')
    return (
      <View style={ss.item}>
        <View style={ss.cardItem}>
          <Left style={ss.left}>
            <Text style={ss.label}>Bank acc no.:</Text>
          </Left>
          <Body style={ss.body}>
            {
              editMode
                ? <TextInput
                  placeholder='Bank acc no.'
                  style={ss.input}
                  onChange={this._handleChange('account')}
                  value={account}
                />
                : <Text style={ss.text}>{account}</Text>
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
  },
  label: {
    lineHeight: 35
  }
})
