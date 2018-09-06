import { Dimensions } from 'react-native'
import isIOS from '../utils/isIOS'

const isIphoneX = () => {
  const { height, width } = Dimensions.get('window')
  return (
    isIOS && (height === 812 || width === 812)
  )
}

export default isIphoneX()
