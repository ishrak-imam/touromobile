import I18n from './i18n'
import Expo from 'expo'
import en from './locales/en'
import sv from './locales/sv'

I18n.initAsync = async () => {
  const Localization = Expo.DangerZone.Localization || Expo.Localization || Expo.Util
  const locale = await Localization.getCurrentLocaleAsync()
  I18n.locale = (locale) ? locale.replace(/_/, '-') : ''
}

I18n.fallbacks = true

I18n.translations = {
  en,
  sv
}

export default I18n
