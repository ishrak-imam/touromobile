
import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import {
  View, Text, CheckBox
} from 'native-base'
import { IonIcon, Colors } from '../theme'
import ImageCache from './imageCache'
import { LinearGradient } from 'expo'

export default class FutureTrips extends Component {
  _renderGradient = () => {
    return (
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,1)']}
        style={ss.gradient}
      />
    )
  }

  render () {
    return (
      <View style={ss.container}>

        <View style={ss.card}>
          <View style={[ss.cardHeader, { backgroundColor: Colors.scBrand }]}>
            <Text style={ss.brandText}>SC</Text>
            <Text>Berline Weekend</Text>
            <IonIcon name='bus' />
          </View>

          <View style={ss.imageContainer}>
            <ImageCache uri={'https://touro.scandorama.se/api/v1/resources/trip/2436/image'} style={ss.cardImage} />
            {/* {this._renderGradient()} */}

            <View style={ss.cardBody}>

              <View style={ss.cardTop} />

              <View style={ss.cardContent} >

              </View>

              <View style={ss.cardBottom}>

                <View style={ss.bottomLeft}>
                  <IonIcon name='people' color={Colors.black} size={30} />
                  <Text style={[ss.brandText, { color: Colors.black, marginLeft: 10 }]}>44</Text>
                </View>

                <View style={ss.bottomRight} />

              </View>
            </View>

          </View>
        </View>

      </View>
    )
  }
}

const ss = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
  },
  card: {
    height: 275,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  cardHeader: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 0,
    padding: 7,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardContent: {
    flex:1,
    //...
  },
  imageContainer: {
    borderWidth: 0,
    height: 225,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden'
  },
  cardImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.3
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
    // borderBottomLeftRadius: 10,
    // borderBottomRightRadius: 10
  },
  cardBody: {
    flex: 1
  },
  cardTop: {
    flex: 3
  },
  cardBottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  bottomLeft: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginLeft: 10
  },
  brandText: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  bottomRight: {
    flex: 1,
    flexDirection: 'row'
  }
})
