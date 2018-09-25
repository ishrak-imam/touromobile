import { Dimensions } from 'react-native'
import isIOS from '../utils/isIOS'

const { height, width } = Dimensions.get('window')
const isIphoneX = isIOS && (height === 812 || width === 812)

export default isIphoneX
