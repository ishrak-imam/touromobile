import Sentry from 'sentry-expo'
import config from './config'
import { name, platform } from './app'

// Uncomment to turn on Sentry in development
// Sentry.enableInExpoDevelopment = true

Sentry.config(config.SENTRY_URL, {
  tags: {
    'app-version': `${config.environment}-${config.version}`,
    'app-platform': platform,
    'app-name': name
  }
}).install()

export const setSentryUser = email => {
  Sentry.setUserContext({ email })
}
