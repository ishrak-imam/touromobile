
class Cache {
  constructor (value, resolver) {
    this.value = value
    this.resolver = resolver
    this.prev = null
    this.computed = null
  }

  _shouldHitCache = () => {
    return this.value.equals(this.prev) && !!this.computed
  }

  getData = () => {
    if (this._shouldHitCache()) {
      return this.computed
    }
    this.prev = this.value
    this.computed = this.resolver(this.value)
    return this.computed
  }
}

export default Cache
