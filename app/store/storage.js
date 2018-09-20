import { SecureStore } from 'expo'

const KEY = 'root'

const storage = {
  getItem: key => {
    return SecureStore.getItemAsync(KEY)
  },
  setItem: (key, value) => {
    return SecureStore.setItemAsync(KEY, value)
  },
  removeItem: key => {
    return SecureStore.deleteItemAsync(KEY)
  }
}

export default storage
