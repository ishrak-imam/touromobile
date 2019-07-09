
import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native'
import { Container, View } from 'native-base'
import Header from '../../components/header'
import _T from '../../utils/translator'
import { IonIcon, Colors } from '../../theme'
import { connect } from 'react-redux'
import {
  getConnection, getPendingSms,
  getUser, getDrivers, getDriverPhones
} from '../../selectors'
import { ImmutableVirtualizedList } from 'react-native-immutable-list-view'
import { mapToList } from '../../utils/immutable'
import isIphoneX from '../../utils/isIphoneX'
import { format } from 'date-fns'
import OutLineButton from '../../components/outlineButton'
import { stringShorten } from '../../utils/stringHelpers'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { actionDispatcher } from '../../utils/actionDispatcher'
import { showModal } from '../../modal/action'
import { deletePendingSms, sendPendingSmsReq } from './action'
import CheckBox from '../../components/checkBox'

const DATE_FORMAT = 'YYYY-MM-DD HH:mm'

class SMSItem extends Component {
  constructor (props) {
    super(props)
    const { sms } = props
    this.state = {
      editMode: false,
      subject: sms.get('subject'),
      message: sms.get('message'),
      includeMe: false,
      includeDrivers: false
    }
  }

  _onChangeText = field => text => {
    this.setState({ [field]: text })
  }

  _toggleEditMode = () => {
    this.setState({
      editMode: !this.state.editMode
    })
  }

  _onDelete = smsId => () => {
    actionDispatcher(showModal({
      type: 'warning',
      text: _T('warning'),
      onOk: this._deleteSMS(smsId)
    }))
  }

  _deleteSMS = smsId => () => {
    actionDispatcher(deletePendingSms({
      smsId
    }))
  }

  _onSend = sms => () => {
    const { guidePhone, driverPhones } = this.props
    const { includeMe, includeDrivers } = this.state
    const { subject, message } = this.state
    let to = sms.get('to').toJS()
    if (includeMe) to.push(guidePhone)
    if (includeDrivers) to = to.concat(driverPhones.toJS())
    const smsPayload = {
      brand: sms.get('brand'),
      subject,
      message,
      to
    }
    const smsId = sms.get('id')
    actionDispatcher(sendPendingSmsReq({
      smsPayload,
      isNeedJwt: true,
      showToast: true,
      sucsMsg: _T('sendingSMSsucs'),
      failMsg: _T('sendingSMSfail'),
      smsId
    }))
  }

  _toggleIncludeMe = () => {
    this.setState({ includeMe: !this.state.includeMe })
  }

  _toggleIncludeDrivers = () => {
    this.setState({ includeDrivers: !this.state.includeDrivers })
  }

  render () {
    const { sms, isOnline } = this.props
    const { includeMe, includeDrivers, subject, message, editMode } = this.state
    const time = format(sms.get('createdAt'), DATE_FORMAT)
    const smsId = sms.get('id')
    const isLoading = sms.get('isLoading')
    const brand = sms.get('brand')
    const backgroundColor = brand ? Colors[`${brand}Brand`] : Colors.blue

    return (
      <View style={ss.item}>
        <View style={ss.container}>
          <View style={[ss.header, { backgroundColor }]}>
            <Text style={ss.headerText}>{_T('createdAt')} {time}</Text>
            <TouchableOpacity onPress={this._onDelete(smsId)}>
              <IonIcon name='x' color={Colors.white} size={30} />
            </TouchableOpacity>
          </View>
          <View style={ss.body}>
            <View style={ss.bodyText}>

              <Text style={ss.subHeader}>{_T('subject')}:</Text>
              {
                editMode
                  ? <TextInput
                    underlineColorAndroid='transparent'
                    placeholder={_T('enterSub')}
                    value={subject}
                    style={[ss.input, { height: 35 }]}
                    onChangeText={this._onChangeText('subject')}
                    multiline
                    autoCorrect={false}
                  />
                  : <Text>{stringShorten(subject, 50)}</Text>
              }

              <Text style={[ss.subHeader, { marginTop: 10 }]}>{_T('message')}:</Text>
              {
                editMode
                  ? <TextInput
                    underlineColorAndroid='transparent'
                    placeholder={_T('enterText')}
                    value={message}
                    style={[ss.input, { height: 110 }]}
                    onChangeText={this._onChangeText('message')}
                    multiline
                    autoCorrect={false}
                  />
                  : <Text>{stringShorten(message, 120)}</Text>
              }

            </View>
            <View style={ss.editIcon}>
              <TouchableOpacity style={ss.edit} onPress={this._toggleEditMode}>
                <IonIcon name='edit' color={Colors.black} size={25} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={ss.footer}>
            <View style={ss.left}>
              <TouchableOpacity style={ss.sendMeCopy} onPress={this._toggleIncludeMe}>
                <CheckBox checked={includeMe} />
                <Text style={{ marginLeft: 10 }}>{_T('sendMeCopy')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={ss.sendMeCopy} onPress={this._toggleIncludeDrivers}>
                <CheckBox checked={includeDrivers} />
                <Text style={{ marginLeft: 10 }}>{_T('sendDriversCopy')}</Text>
              </TouchableOpacity>
            </View>
            <View style={ss.right}>
              <OutLineButton
                isLoading={isLoading}
                disabled={!isOnline || isLoading}
                text={_T('send')}
                color={Colors.green}
                onPress={this._onSend(sms)}
              />
            </View>
          </View>

        </View>
      </View>
    )
  }
}

class PendingSmsScreen extends Component {
  _renderRight = () => {
    const { connection } = this.props
    const color = connection.get('online') ? Colors.white : Colors.charcoal
    return (
      <IonIcon style={ss.rightIcon} name='globe' color={color} />
    )
  }

  _renderSms = (isOnline, driverPhones) => ({ item }) => {
    const { user } = this.props
    return <SMSItem
      sms={item}
      isOnline={isOnline}
      guidePhone={user.get('phone')}
      driverPhones={driverPhones}
    />
  }

  render () {
    const { navigation, pendings, connection, drivers } = this.props
    const pendingsList = mapToList(pendings)

    const isOnline = connection.get('online')
    const driverPhones = getDriverPhones(drivers)

    return (
      <Container>
        <Header
          left='back'
          title={_T('pendingSMS')}
          navigation={navigation}
          right={this._renderRight()}
        />

        <KeyboardAwareScrollView
          style={{ marginBottom: 10 }}
          enableOnAndroid
          keyboardShouldPersistTaps='always'
        >
          <ImmutableVirtualizedList
            keyboardShouldPersistTaps='always'
            contentContainerStyle={ss.scroll}
            showsVerticalScrollIndicator={false}
            immutableData={pendingsList}
            renderItem={this._renderSms(isOnline, driverPhones)}
            keyExtractor={item => String(item.get('id'))}
            renderEmpty={_T('noMoreSms')}
          />
        </KeyboardAwareScrollView>
      </Container>
    )
  }
}

const stateToProps = state => ({
  connection: getConnection(state),
  pendings: getPendingSms(state),
  user: getUser(state),
  drivers: getDrivers(state)
})

export default connect(stateToProps, null)(PendingSmsScreen)

const ss = StyleSheet.create({
  rightIcon: {
    marginRight: 10
  },
  scroll: {
    paddingTop: 20,
    paddingBottom: isIphoneX ? 25 : 10
  },
  item: {
    height: 320,
    width: '100%',
    marginBottom: 20
  },
  container: {
    marginHorizontal: 20,
    overflow: 'hidden'
  },
  header: {
    height: 40,
    width: '100%',
    // borderWidth: 1,
    // borderBottomWidth: 0,
    borderTopLeftRadius: 7,
    borderTopRightRadius: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 15
  },
  subHeader: {
    marginBottom: 5,
    fontWeight: 'bold'
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  body: {
    height: 220,
    width: '100%',
    borderLeftWidth: 1,
    borderRightWidth: 1,
    paddingHorizontal: 10,
    flexDirection: 'row',
    paddingTop: 15
  },
  bodyText: {
    flex: 3,
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  editIcon: {
    flex: 0.5,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  edit: {
    paddingHorizontal: 5
  },
  footer: {
    height: 60,
    width: '100%',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  left: {
    flex: 2,
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.charcoal,
    borderRadius: 2,
    padding: 5,
    textAlignVertical: 'top'
  },
  sendMeCopy: {
    width: 150,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
})
