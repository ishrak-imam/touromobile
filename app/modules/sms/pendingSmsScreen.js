
import React, { Component } from 'react'
import { StyleSheet, TouchableOpacity, Text, TextInput } from 'react-native'
import { Container, View } from 'native-base'
import Header from '../../components/header'
import _T from '../../utils/translator'
import { IonIcon, Colors } from '../../theme'
import { connect } from 'react-redux'
import { getConnection, getPendingSms } from '../../selectors'
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

const DATE_FORMAT = 'YYYY-MM-DD HH:mm'

class SMSItem extends Component {
  constructor (props) {
    super(props)
    const { sms } = props
    this.state = {
      editMode: false,
      subject: sms.get('subject'),
      message: sms.get('message')
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
    const { subject, message } = this.state
    const smsPayload = {
      brand: sms.get('brand'),
      subject,
      message,
      to: sms.get('to').toJS()
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

  render () {
    const { sms, isOnline } = this.props
    const { subject, message, editMode } = this.state
    const time = format(sms.get('createdAt'), DATE_FORMAT)
    const smsId = sms.get('id')
    const isLoading = sms.get('isLoading')
    const brand = sms.get('brand')

    return (
      <View style={ss.item}>
        <View style={ss.container}>
          <View style={[ss.header, { backgroundColor: Colors[`${brand}Brand`] }]}>
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
                    style={[ss.input, { height: 75 }]}
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
    )
  }
}

class PendingSmsScreen extends Component {
  _renderRight = () => {
    const { connection } = this.props
    const color = connection.get('online') ? Colors.white : Colors.charcoal
    return (
      <IonIcon style={ss.right} name='globe' color={color} />
    )
  }

  _renderSms = isOnline => ({ item }) => {
    return <SMSItem sms={item} isOnline={isOnline} />
  }

  render () {
    const { navigation, pendings, connection } = this.props
    const pendingsList = mapToList(pendings)

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
            renderItem={this._renderSms(connection.get('online'))}
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
  pendings: getPendingSms(state)
})

export default connect(stateToProps, null)(PendingSmsScreen)

const ss = StyleSheet.create({
  right: {
    marginRight: 10
  },
  scroll: {
    paddingTop: 20,
    paddingBottom: isIphoneX ? 25 : 10
  },
  item: {
    height: 280,
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
    borderWidth: 1,
    borderBottomWidth: 0,
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
    height: 180,
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
    height: 50,
    width: '100%',
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderBottomLeftRadius: 7,
    borderBottomRightRadius: 7,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 10
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.charcoal,
    borderRadius: 2,
    padding: 5,
    textAlignVertical: 'top'
  }
})
