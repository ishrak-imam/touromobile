import { Image } from 'react-native'
import Asset from 'expo-asset'
import * as Font from 'expo-font'

function cacheImages (images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image)
    } else {
      return Asset.fromModule(image).downloadAsync()
    }
  })
}

function cacheFonts (fonts) {
  return fonts.map(font => Font.loadAsync(font))
}

export default function cacheAssetsAsync ({ images = [], fonts = [] }) {
  return Promise.all([...cacheImages(images), ...cacheFonts(fonts)])
}
