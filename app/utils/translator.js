import I18n from '../i18n'

const Translator = context => s => {
  return I18n.t(`${context}.${s}`)
}

export default Translator
