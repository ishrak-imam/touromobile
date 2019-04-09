
import React, { Component } from 'react'
import {
  StyleSheet, TextInput
  // TouchableOpacity
} from 'react-native'
import { View, ListItem, Text } from 'native-base'
import {
  getSet
  // getMap
} from '../utils/immutable'
import CheckBox from './checkBox'
import FooterButtons from './footerButtons'
// import uuid from 'react-native-uuid'
import {
  Colors
  // IonIcon
} from '../theme'

import { setAllergyOrders } from '../modules/modifiedData/action'
import { actionDispatcher } from '../utils/actionDispatcher'

// import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import isIOS from '../utils/isIOS'

const ALLERGIES = [
  'Vegan', 'Nuts', 'Potatoes', 'Lactose', 'Gluten'
]

export default class AllergySelection extends Component {
  constructor (props) {
    super(props)

    // const id = uuid.v1()
    // let extraAllergies = getMap({
    //   [id]: getMap({ id })
    // })

    this.state = {
      disabled: true,
      allergies: getSet([]),
      extraAllergies: ''
    }
  }

  _toggleDisable = () => {
    const { allergies, extraAllergies } = this.state
    this.setState({
      disabled: !allergies.size && !extraAllergies
    })
  }

  _checkAllergy = allergy => {
    return () => {
      const { allergies } = this.state
      this.setState({
        allergies: allergies.has(allergy) ? allergies.delete(allergy) : allergies.add(allergy)
      }, this._toggleDisable)
    }
  }

  // _onAddItem = () => {
  //   const { extraAllergies } = this.state
  //   const id = uuid.v1()
  //   this.setState({
  //     extraAllergies: extraAllergies.set(id, getMap({ id }))
  //   })
  // }

  // _onChangeText = key => value => {
  //   const { extraAllergies } = this.state
  //   this.setState({
  //     extraOrders: extraAllergies.setIn([key, 'text'], value)
  //   })
  // }

  _onChangeText = text => this.setState({ extraAllergies: text }, this._toggleDisable)

  // _onDelete = key => {
  //   const { extraAllergies } = this.state
  //   if (extraAllergies.size === 1) return null
  //   return () => {
  //     this.setState({
  //       extraAllergies: extraAllergies.delete(key)
  //     })
  //   }
  // }

  _onCancel = () => {
    this.props.navigation.goBack()
  }

  _onSave = () => {
    let { meal, direction, departureId, bookingId } = this.props
    const { allergies, extraAllergies } = this.state
    const allergyText = `${allergies.join(', ')}, ${extraAllergies}`.replace(/,\s*$/, '')
    const mealName = `${meal.get('name')} (${allergyText})`
    meal = meal.set('name', mealName).set('type', 'allergy')
    actionDispatcher(setAllergyOrders({
      meal, direction, departureId, bookingId
    }))
    this._onCancel()
  }

  render () {
    const { allergies, extraAllergies, disabled } = this.state
    return (
      <View
        // showsVerticalScrollIndicator={false}
        style={ss.container}
        // extraScrollHeight={isIOS ? 40 : 200}
        // enableOnAndroid
        // keyboardShouldPersistTaps='always'
      >
        <View style={ss.allergyList}>
          {
            ALLERGIES.map((allergy, index) => {
              return (
                <ListItem style={ss.listItem} key={index} onPress={this._checkAllergy(allergy)}>
                  <View style={ss.check}>
                    <CheckBox checked={allergies.has(allergy)} />
                  </View>
                  <View style={ss.text}>
                    <Text style={ss.textStyle}>{allergy}</Text>
                  </View>
                </ListItem>
              )
            })
          }
        </View>
        <View style={ss.allergyList}>
          {/* {
            Object.keys(extraAllergies.toJS()).map(key => {
              const allergy = extraAllergies.get(key)
              return (
                <ListItem style={ss.listItem} key={key}>
                  <TextInput
                    underlineColorAndroid='transparent'
                    placeholder='Some other allergy'
                    value={allergy.get('text')}
                    style={ss.input}
                    onChangeText={this._onChangeText(key)}
                  />
                  <TouchableOpacity style={ss.delete} onPress={this._onDelete(key)}>
                    <IonIcon name='delete' size={27} color={Colors.cancel} />
                  </TouchableOpacity>
                </ListItem>
              )
            })
          } */}
          <TextInput
            underlineColorAndroid='transparent'
            placeholder='Some other allergy'
            value={extraAllergies}
            style={ss.input}
            onChangeText={this._onChangeText}
          />
          {/* <TouchableOpacity style={ss.plus} onPress={this._onAddItem}>
            <Text style={ss.sign}>+</Text>
          </TouchableOpacity> */}
        </View>
        <View style={ss.footer}>
          <FooterButtons disabled={disabled} onSave={this._onSave} onCancel={this._onCancel} />
        </View>
      </View>
    )
  }
}

const ss = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginBottom: 40
  },
  allergyList: {
    marginTop: 10
  },
  listItem: {
    borderBottomWidth: 0,
    marginLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
    paddingBottom: 0,
    marginBottom: 5,
    marginTop: 5,
    justifyContent: 'space-between'
  },
  check: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  text: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'flex-start'
  },
  textStyle: {
    fontSize: 16,
    marginBottom: 4
  },
  footer: {
    height: 30,
    marginTop: 10 // 40
  },
  input: {
    height: 35,
    width: '100%', // '85%',
    borderWidth: 1,
    borderColor: Colors.charcoal,
    borderRadius: 2,
    padding: 5
  }
  // plus: {
  //   height: 30,
  //   width: 35,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: Colors.green,
  //   borderRadius: 3
  // },
  // sign: {
  //   fontWeight: 'bold',
  //   color: Colors.white
  // },
  // delete: {
  //   height: 35,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   width: '10%'
  // }
})
