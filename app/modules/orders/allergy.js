
import React, { Component } from 'react'
import { Container } from 'native-base'
import Header from '../../components/header'
import AllergySelection from '../../components/allergySelection'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import isIOS from '../../utils/isIOS'

export default class AllergyScreen extends Component {
  render () {
    const { navigation } = this.props
    const meal = navigation.getParam('meal')
    const brand = navigation.getParam('brand')
    const direction = navigation.getParam('direction')
    const totalOrder = navigation.getParam('totalOrder')
    const paxCount = navigation.getParam('paxCount')
    const bookingId = navigation.getParam('bookingId')
    const departureId = navigation.getParam('departureId')

    return (
      <Container>
        <Header left='back' title={`Allergies: ${meal.get('name')}`} navigation={navigation} brand={brand} />

        <KeyboardAwareScrollView
          extraScrollHeight={isIOS ? 50 : 200}
          enableOnAndroid
          keyboardShouldPersistTaps='always'
        >
          <AllergySelection
            navigation={navigation}
            meal={meal}
            direction={direction}
            totalOrder={totalOrder}
            paxCount={paxCount}
            bookingId={bookingId}
            departureId={departureId}
          />
        </KeyboardAwareScrollView>

      </Container>
    )
  }
}
