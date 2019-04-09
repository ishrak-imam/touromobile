
import React, { Component } from 'react'
import { Container } from 'native-base'
import Header from '../../components/header'
import AllergySelection from '../../components/allergySelection'

export default class AllergyScreen extends Component {
  render () {
    const { navigation } = this.props
    const meal = navigation.getParam('meal')
    const brand = navigation.getParam('brand')
    const direction = navigation.getParam('direction')
    const bookingId = navigation.getParam('bookingId')
    const departureId = navigation.getParam('departureId')

    return (
      <Container>
        <Header left='back' title={`Allergies: ${meal.get('name')}`} navigation={navigation} brand={brand} />
        <AllergySelection
          navigation={navigation}
          meal={meal}
          direction={direction}
          bookingId={bookingId}
          departureId={departureId}
        />
      </Container>
    )
  }
}
