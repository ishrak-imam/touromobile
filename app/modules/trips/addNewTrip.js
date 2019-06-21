
import React, { Component } from 'react'
import { Container } from 'native-base'
import {
  View, Text, StyleSheet,
  Dimensions, TouchableOpacity
} from 'react-native'
import Header from '../../components/header'
import TextInput from '../../components/textinput'
import { Colors, IonIcon } from '../../theme'
import Switch from '../../components/switch'
import { getList, getMap } from '../../utils/immutable'
import { actionDispatcher } from '../../utils/actionDispatcher'
import { showModal } from '../../modal/action'
import DatePicker from 'react-native-datepicker'
import { format, subYears, addYears } from 'date-fns'
import FooterButtons from '../../components/footerButtons'
import { addManualTrip } from './action'

const { width } = Dimensions.get('window')

const BRANDS = ['GK', 'OH', 'SS', 'SC']
const DATE_FORMAT = 'YYYY-MM-DD'

export default class AddNewTrip extends Component {
  constructor (props) {
    super(props)

    const date = Date.now()
    this.minDate = format(subYears(date, 1), DATE_FORMAT)
    this.maxDate = format(addYears(date, 1), DATE_FORMAT)

    this.state = {
      tripName: '',
      isFlight: false,
      brand: { key: '', value: '' },
      outDate: '',
      homeDate: '',
      departureId: `-${Date.now()}`
    }
  }

  _handleChange = field => {
    return text => {
      this.setState({ [field]: text })
    }
  }

  _onToggle = v => {
    this.setState({ isFlight: !this.state.isFlight }, () => console.log(this.state))
  }

  _renderLabel = label => {
    return (
      <View style={ss.label}>
        <Text style={ss.labelText}>{label}</Text>
      </View>
    )
  }

  _onSelectBrand = brand => {
    this.setState({ brand: brand.value })
  }

  _showSelections = () => {
    actionDispatcher(showModal({
      type: 'selection',
      options: this._getSelectionOptions(),
      onSelect: this._onSelectBrand
    }))
  }

  _getSelectionOptions = () => {
    const { brand } = this.state
    const config = {
      label: 'Select Brand',
      key: 'brand',
      direction: ''
    }
    const items = BRANDS.reduce((list, brand) => {
      list = list.push(getMap({
        key: brand,
        value: brand
      }))
      return list
    }, getList([]))

    return {
      config, items, selected: brand
    }
  }

  _selectDate = direction => date => {
    this.setState({ [direction]: date })
  }

  // _calendarIcon = () => {
  //   return (
  //     <View style={ss.calendarIcon}>
  //       <IonIcon name='calendar' size={35} style={{ marginBottom: 2 }} />
  //     </View>
  //   )
  // }

  _onSave = () => {
    const { departureId, tripName, isFlight, brand, outDate, homeDate } = this.state
    actionDispatcher(addManualTrip({
      departureId,
      trip: {
        departureId,
        transport: {
          type: isFlight ? 'flight' : 'bus'
        },
        name: tripName,
        brand: brand.value,
        outDate,
        homeDate,
        image: ''
      }
    }))
    this.props.navigation.goBack()
  }

  _onCancel = () => {
    this.props.navigation.goBack()
  }

  render () {
    const { navigation } = this.props
    const triBrand = navigation.getParam('brand')
    const { tripName, isFlight, brand, outDate, homeDate } = this.state
    return (
      <Container>
        <Header left='back' title='Add new trip' brand={triBrand} navigation={navigation} />
        <View style={ss.container}>

          <View style={ss.item}>
            {this._renderLabel('Trip Name')}
            <View style={ss.input}>
              <TextInput
                placeholder='Trip Name'
                style={ss.tripName}
                onChange={this._handleChange('tripName')}
                value={tripName}
              />
            </View>
          </View>

          <View style={ss.item}>
            {this._renderLabel('Transport')}
            <View style={ss.input}>
              <View style={ss.transport}>
                <IonIcon name='bus' size={25} style={[ss.icon, { paddingRight: 10 }]} />
                <Switch
                  size='medium'
                  isOn={isFlight}
                  onColor={Colors.blue}
                  offColor={Colors.blue}
                  onToggle={this._onToggle}
                />
                <IonIcon name='flight' size={25} style={[ss.icon, { paddingLeft: 10 }]} />
              </View>
            </View>
          </View>

          <View style={ss.item}>
            {this._renderLabel('Brand')}
            <View style={ss.input}>
              <View style={ss.selector}>
                <View style={ss.selectorBox}>
                  <Text numberOfLines={1} style={ss.selectorText}>{brand.value}</Text>
                </View>
                <TouchableOpacity
                  style={ss.dropDown}
                  onPress={this._showSelections}
                >
                  <IonIcon name='down' color={Colors.silver} size={20} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={ss.item}>
            {this._renderLabel('Out date')}
            <View style={ss.input}>
              <DatePicker
                style={ss.datePicker}
                date={outDate}
                mode='date'
                placeholder='Out date'
                format={DATE_FORMAT}
                minDate={this.minDate}
                maxDate={this.maxDate}
                confirmBtnText='Confirm'
                cancelBtnText='Cancel'
                customStyles={{
                  dateInput: ss.dateInput
                }}
                onDateChange={this._selectDate('outDate')}
                // iconComponent={this._calendarIcon()}
              />
            </View>
          </View>

          <View style={ss.item}>
            {this._renderLabel('Home date')}
            <View style={ss.input}>
              <DatePicker
                style={ss.datePicker}
                date={homeDate}
                mode='date'
                placeholder='Home date'
                format='YYYY-MM-DD'
                minDate={outDate || this.minDate}
                maxDate={this.maxDate}
                confirmBtnText='Confirm'
                cancelBtnText='Cancel'
                customStyles={{
                  dateInput: ss.dateInput
                }}
                onDateChange={this._selectDate('homeDate')}
                // iconComponent={this._calendarIcon()}
              />
            </View>
          </View>

          <View style={ss.footer}>
            <FooterButtons onSave={this._onSave} onCancel={this._onCancel} />
          </View>

        </View>
      </Container>
    )
  }
}

const ss = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5
  },
  item: {
    height: 50,
    width: width - 25,
    flexDirection: 'row',
    marginTop: 5,
    paddingHorizontal: 5
  },
  label: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start'
    // paddingLeft: 5
  },
  labelText: {
    fontSize: 14,
    fontWeight: '500'
  },
  input: {
    flex: 2,
    justifyContent: 'center'
  },
  tripName: {
    height: 35,
    borderWidth: 1,
    borderColor: Colors.charcoal,
    borderRadius: 4,
    padding: 5,
    width: '100%',
    marginTop: 5
  },
  transport: {
    flexDirection: 'row',
    marginLeft: 5
  },
  icon: {
    marginTop: 3
  },
  selector: {
    height: 35,
    flexDirection: 'row',
    borderRadius: 3
  },
  selectorBox: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 5,
    borderWidth: 1,
    borderRightWidth: 0,
    borderTopLeftRadius: 3,
    borderBottomLeftRadius: 3,
    borderColor: Colors.charcoal
  },
  dropDown: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: Colors.blue
  },
  datePicker: {
    width: '100%',
    height: 20,
    borderRadius: 3,
    marginTop: -20,
    paddingRight: 0,
    marginRight: 0
  },
  dateInput: {
    height: 35,
    borderRadius: 3,
    alignItems: 'flex-start',
    paddingLeft: 5,
    borderColor: Colors.black
  },
  calendarIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end'
  },
  footer: {
    height: 30,
    width: width - 25,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 5
  }
})
