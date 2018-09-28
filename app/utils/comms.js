import { Call, Text, Web, Map } from 'react-native-openanything'

export const call = number => Call(number)
export const sms = number => Text(number)
export const web = url => Web(url)
export const map = address => Map(address)
