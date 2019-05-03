
import React, { Component } from 'react'
import { StyleSheet, TextInput } from 'react-native'
import { View, ListItem, Text } from 'native-base'
import { getSet, getMap } from '../utils/immutable'
import CheckBox from './checkBox'
import FooterButtons from './footerButtons'
import uuid from 'react-native-uuid'
import { Colors } from '../theme'
import { setAllergyOrders } from '../modules/modifiedData/action'
import { actionDispatcher } from '../utils/actionDispatcher'
import _T from '../utils/translator'

const ALLERGIES = [
  'gluten', 'lactose', 'nuts', 'vegetarian', 'vegan', 'seafood', 'egg', 'celery'
]

export default class AllergySelection extends Component {
  constructor (props) {
    super(props)
    this.state = {
      disabled: true,
      allergies: getSet([]),
      extraAllergies: '',
      allergyId: uuid.v1()
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

  _onChangeText = text => {
    this.setState({ extraAllergies: text }, this._toggleDisable)
  }

  _onCancel = () => {
    this.props.navigation.goBack()
  }

  _onSave = () => {
    let { meal, direction, totalOrder, paxCount, departureId, bookingId } = this.props
    const mealId = String(meal.get('id'))
    const { allergyId, allergies, extraAllergies } = this.state

    let allergyText = allergies.toArray().reduce((str, allergy, index) => {
      str = index === 0 ? `${_T(allergy)}` : `${str}, ${_T(allergy)}`
      return str
    }, '')

    if (extraAllergies) {
      allergyText = allergies.size ? `${allergyText}, ${extraAllergies}` : extraAllergies
    }

    const isMaxOrderPlaced = totalOrder === paxCount

    const allergyOrder = getMap({
      allergyId,
      allergyText,
      adultCount: isMaxOrderPlaced ? 0 : +!!meal.get('adult'),
      childCount: isMaxOrderPlaced ? 0 : +!!meal.get('child'),
      adult: meal.get('adult'),
      child: meal.get('child'),
      mealId
    })

    actionDispatcher(setAllergyOrders({
      departureId, bookingId, direction, mealId, allergyId, allergyOrder
    }))

    this._onCancel()
  }

  render () {
    const { allergies, extraAllergies, disabled } = this.state
    return (
      <View style={ss.container}>
        <View style={ss.allergyList}>
          {
            ALLERGIES.map((allergy, index) => {
              return (
                <ListItem style={ss.listItem} key={index} onPress={this._checkAllergy(allergy)}>
                  <View style={ss.check}>
                    <CheckBox checked={allergies.has(allergy)} />
                  </View>
                  <View style={ss.text}>
                    <Text style={ss.textStyle}>{_T(allergy)}</Text>
                  </View>
                </ListItem>
              )
            })
          }
        </View>
        <View style={ss.allergyList}>
          <TextInput
            underlineColorAndroid='transparent'
            placeholder={_T('otherAllergy')}
            value={extraAllergies}
            style={ss.input}
            onChangeText={this._onChangeText}
          />
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
    marginTop: 10
  },
  input: {
    height: 35,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.charcoal,
    borderRadius: 2,
    padding: 5
  }
})
