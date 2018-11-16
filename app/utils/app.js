
import { Platform } from 'react-native'
const OS = Platform.OS

export const name = {
  ios: 'Touroguide Mobile App - iOS',
  android: 'Touroguide Mobile App - Android'
}[OS]

export const platform = {
  ios: 'iOS',
  android: 'Android'
}[OS]
