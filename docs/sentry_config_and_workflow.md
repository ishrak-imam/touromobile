
## Sentry

Sentry is used for error reporting in this application. The process is sentry is configured with necessary configuration values like following.

```
Sentry.config(config.SENTRY_URL, {
  tags: {
    'app-environment': config.environment,
    'app-version': config.version,
    'app-platform': config.platform,
    'device-name': config.deviceName
  }
}).install()
```

Here `SENTRY_URL` is configured in `config.json` file which can be found by creating a new project in sentry dashboard. Then necessary tags are added for additional information about an error event.

Then a method `setSentryUser` is exported from `utils/sentry.js` file which is called to set sentry user context whenever the application establishes a valid and logged in user.

### Configuration:

1. Install the `sentry-expo` package.
2. Place the following configurations in the `app.json` file.
```
"hooks": {
      "postPublish": [
        {
          "file": "sentry-expo/upload-sourcemaps",
          "config": {
            "organization": "your organization's short name here",
            "project": "your project name here",
            "authToken": "your auth token here"
          }
        }
      ]
    }
```

For further details please visit https://docs.expo.io/versions/latest/guides/using-sentry/