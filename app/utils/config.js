import { Platform } from 'react-native'
import { Constants } from 'expo'
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
const deviceId = Constants.deviceId

const useMockData = false // !isProduction && !isStaging

const config = {
  ...allConfigs[environment],
  environment,
  version,
  isDev,
  isProduction,
  isStaging,
  isDevice,
  deviceName,
  deviceId,
  useMockData,
  platform: OS
}

export default config
