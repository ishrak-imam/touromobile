import I18n from './i18n'
import { Localization } from 'expo'
import en from './locales/en'
import sv from './locales/sv'

I18n.initAsync = () => {
  const locale = Localization.locale
  I18n.locale = 'sv' // locale ? locale.split('-')[0] : ''
}

I18n.fallbacks = true

I18n.translations = {
  en,
  sv
}

export default I18n
