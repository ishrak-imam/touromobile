// import configs from '../../config.json'

// const config = {
//   ...configs
// }

// export default config

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

const isProduction = environment === 'PRODUCTION'

const isDevice = Constants.isDevice

const useMockData = !isProduction

const config = {
  ...allConfigs[environment],
  environment,
  version,
  isProduction,
  isDevice,
  useMockData
}

export default config
