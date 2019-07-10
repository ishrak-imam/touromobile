import { Platform } from 'react-native'
import Constants from 'expo-constants'
import allConfigs from '../../config.json'

const releaseChannel = Constants.manifest.releaseChannel
const version = Constants.manifest.version

let environment = ''

if (releaseChannel === undefined) {
  environment = 'DEV'
} else if (releaseChannel.indexOf('prod') !== -1) {
  environment = 'PRODUCTION'
} else if (releaseChannel.indexOf('staging') !== -1) {
  environment = 'STAGING'
} else {
  environment = 'STAGING'
}

const isDev = environment === 'DEV'
const isProduction = environment === 'PRODUCTION'
const isStaging = environment === 'STAGING'

const OS = Platform.OS

const isDevice = Constants.isDevice
const deviceName = Constants.deviceName
const systemVersion = OS === 'ios' ? Constants.platform['ios'].systemVersion : Constants.systemVersion
const expoSDKVersion = Constants.manifest.sdkVersion
const deviceYear = Constants.deviceYearClass
const deviceId = Constants.deviceId

const useMockData = !isProduction && !isStaging

const ssnAuthToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoicGFzc2VuZ2VyLmFwcEBzY2FuZG9yYW1hLnNlIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvc2lkIjoiODgiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOlsiRXh0ZXJuYWwiLCJXZWJzaXRlIl0sImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2dpdmVubmFtZSI6IlBhc3NlbmdlciIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3N1cm5hbWUiOiJBcHAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJwYXNzZW5nZXIuYXBwQHNjYW5kb3JhbWEuc2UiLCJzdWIiOiJwYXNzZW5nZXIuYXBwQHNjYW5kb3JhbWEuc2UiLCJqdGkiOiI2NGYxYzQ5Mi03YjRiLTQzODEtYmY2ZC1mN2M5ZTQ3MWVmMjMiLCJpYXQiOjE1NDg4NTAxODMsIm5iZiI6MTU0ODg1MDE4MywiZXhwIjoxODY0MjEwMTgzLCJpc3MiOiJodHRwczovL3RvdXJvLnNjYW5kb3JhbWEuc2UiLCJhdWQiOiJUb3Vyb0FjY2Vzc0F1ZGllbmNlIn0.m3zgxhVN4v4oX6iOSN9M2ArlVc7Zaomxn6MF3KpbK0E'

const structureVersion = 7

const config = {
  ...allConfigs[environment],
  environment,
  version,
  isDev,
  isProduction,
  isStaging,
  isDevice,
  deviceName,
  deviceYear,
  systemVersion,
  expoSDKVersion,
  deviceId,
  useMockData,
  ssnAuthToken,
  structureVersion,
  platform: OS
}

export default config
