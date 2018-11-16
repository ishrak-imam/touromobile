import Sentry from 'sentry-expo'
import config from './config'

// Sentry.enableInExpoDevelopment = true

Sentry.config(config.SENTRY_URL, {
  tags: {
    'app-environment': config.environment,
    'app-version': config.version,
    'app-platform': config.platform,
    'device-name': config.deviceName
  }
}).install()

export const setSentryUser = user => {
  Sentry.setUserContext(user)
}
