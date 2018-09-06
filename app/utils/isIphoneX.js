import { Dimensions, Platform } from 'react-native'

const isIphoneX = () => {
  let d = Dimensions.get('window')
  const { height, width } = d
  return (
    Platform.OS === 'ios' &&
    (height === 812 || width === 812)
  )
}

export default isIphoneX()
