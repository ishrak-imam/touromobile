import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import { View, Text } from 'native-base'
import { IonIcon, Colors } from '../theme'
import ImageCache from './imageCache'
import { LinearGradient } from 'expo'
import { format } from 'date-fns'
import { getPax } from '../selectors'
const DATE_FORMAT = 'YY MM DD'

export default class TripCard extends Component {
  shouldComponentUpdate (nextProps) {
    return !nextProps.trip.equals(this.props.trip)
  }

  _renderGradient = () => {
    return (
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={ss.gradient}
      />
    )
  }
  render () {
    const { trip } = this.props

    const brand = trip.get('brand')
    const brCode = brand.toLowerCase()
    const name = trip.get('name')
    const outDate = format(trip.get('outDate'), DATE_FORMAT)
    const homeDate = format(trip.get('homeDate'), DATE_FORMAT)
    const transport = trip.get('transport')
    const image = trip.get('image')
    const pax = getPax(trip)

    return (
      <View style={ss.card}>

        <View style={[ss.cardHeader, { backgroundColor: Colors[`${brCode}Brand`] }]}>
          <Text style={ss.brandText}>{brand}</Text>
          <Text>{`${name} ${outDate} - ${homeDate}`}</Text>
          <IonIcon name={transport.get('type')} />
        </View>

        <View style={ss.imageContainer}>
          <ImageCache uri={image} style={ss.cardImage} />
          {/* {this._renderGradient()} */}
          <View style={ss.cardBody}>
            <View style={ss.cardTop} />
            <View style={ss.cardBottom}>
              <View style={ss.bottomLeft}>
                <IonIcon name='people' color={Colors.black} size={30} />
                <Text style={[ss.brandText, { color: Colors.black, marginLeft: 10 }]}>{pax.size}</Text>
              </View>
              <View style={ss.bottomRight} />
            </View>
          </View>
        </View>

      </View>
    )
  }
}

const ss = StyleSheet.create({
  card: {
    height: 250,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  cardHeader: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderWidth: 0,
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardContent: {
    flex: 1
  },
  imageContainer: {
    borderWidth: 0,
    height: 200,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden'// needed for iOS
  },
  cardImage: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.3,
    borderBottomLeftRadius: 10, // needed for Android
    borderBottomRightRadius: 10, // needed for Android
    width: null,
    height: null
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
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
