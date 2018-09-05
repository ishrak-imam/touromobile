import { SecureStore } from 'expo'

export const JWT_TOKEN = 'JWT_TOKEN'

const localStore = {
  set: async (key, value) => SecureStore.setItemAsync(key, JSON.stringify(value)),
  get: async key => {
    const value = await SecureStore.getItemAsync(key)
    // https://stackoverflow.com/questions/2647867/how-to-determine-if-variable-is-undefined-or-null
    // abstrach equality check for catching both null and undefined
    return (value == null) ? value : JSON.parse(value)
  },
  delete: async key => SecureStore.deleteItemAsync(key)
}

export default localStore
